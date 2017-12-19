import 'mocha'
import { FileToTreeConverter } from '../lib/converter/FileToTreeConverter'
import { FileNode, ScanOptions } from 'file-hierarchy'
import * as path from 'path'
import { BucketNodeInterface, OutputNode, SocketNodeInterface, SockoNodeType, SockoNodeInterface } from 'socko-api'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')

chai.use(chaiAsPromised)

describe('FileToTreeConverter', function (): void {
  it('should correctly convert a directory to a tree', function (): Bluebird<void> {
    let scanOptions = new ScanOptions(path.join(__dirname, 'assets', 'FileToTreeConverterTest', 'default'))
    return new FileNode().scan(scanOptions)
      .then(
        value => {
          return new FileToTreeConverter().convert(value)
        }
      )
      .then(
        value => {
          chai.expect(
            value.type
          ).to.equal(SockoNodeType.Root)
          chai.expect(
            (
              value.getChildByName('testBucketGlob') as BucketNodeInterface
            ).type
          ).to.equal(SockoNodeType.Bucket)
          chai.expect(
            (
              value.getChildByName('testBucketGlob') as BucketNodeInterface
            ).pattern
          ).to.equal('entries*')
          chai.expect(
            (
              value.getChildByName('testBucketGlob') as BucketNodeInterface
            ).maxDepth
          ).to.equal(3)
          chai.expect(
            (
              value.getChildByName('testBucketRegExp') as BucketNodeInterface
            ).type
          ).to.equal(SockoNodeType.Bucket)
          chai.expect(
            (
              value.getChildByName('testBucketRegExp') as BucketNodeInterface
            ).pattern
          ).to.be.instanceOf(RegExp)
          chai.expect(
            (
              (
                value.getChildByName('testBucketRegExp') as BucketNodeInterface
              ).pattern as RegExp
            ).source
          ).to.equal('entries.*')
          chai.expect(
            (
              value.getChildByName('testBucketRegExp') as BucketNodeInterface
            ).maxDepth
          ).to.equal(-1)
          chai.expect(
            (
              value.getChildByName('testSocket.txt') as SocketNodeInterface
            ).type
          ).to.equal(SockoNodeType.Socket)

          let slots = (
            value.getChildByName('testSocket.txt') as SocketNodeInterface
          ).slots

          chai.expect(
            slots.length
          ).to.equal(18)

          let slotIndices = [
            18,
            26,
            44,
            54,
            63,
            70,
            151,
            172,
            190,
            211,
            223,
            239,
            478,
            500,
            519,
            541,
            554,
            571
          ]

          let sortedSlots = slots.sort((a, b) => { return a.index - b.index })

          sortedSlots.forEach((slot, index) => {
            chai.expect(slot.index).to.equal(slotIndices[index])
          })

          chai.expect(
            (
              value.getChildByName('testCartridge.txt') as SockoNodeInterface
            ).type
          ).to.equal(SockoNodeType.Cartridge)

          return Bluebird.props(
            {
              testSimpleNodeContent: (
                value.getChildByName('testSimpleNode.txt') as SockoNodeInterface
              ).readContent(),
              testCartridgeContent: (
                value.getChildByName('testCartridge.txt') as SockoNodeInterface
              ).readContent()
            }
          )
        }
      )
      .then(
        value => {
          chai.expect(
            value.testSimpleNodeContent.toString('UTF-8')
          ).to.equal('Some content')
          chai.expect(
            value.testCartridgeContent.toString('UTF-8')
          ).to.equal('CARTRIDGECONTENT')
        }
      )
  })
})
