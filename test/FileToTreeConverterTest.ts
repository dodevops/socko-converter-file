import 'mocha'
import { FileToTreeConverter } from '../lib/converter/FileToTreeConverter'
import { FileNode, ScanOptions } from 'file-hierarchy'
import * as path from 'path'
import {
  BucketNodeInterface,
  CartridgeSlotBuilder,
  SocketNodeInterface,
  SockoNodeInterface,
  SockoNodeType
} from 'socko-api'
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
          ).to.equal(24)

          let testSlots = [
            new CartridgeSlotBuilder().withIndex(18).withCartridgeName('HASHCARTRIDGE').build(),
            new CartridgeSlotBuilder().withIndex(26).withCartridgeName('JSONCARTRIDGE').build(),
            new CartridgeSlotBuilder().withIndex(44).withCartridgeName('MULTILINECARTRIDGE').build(),
            new CartridgeSlotBuilder().withIndex(54).withCartridgeName('NATIVECARTRIDGE').build(),
            new CartridgeSlotBuilder().withIndex(63).withCartridgeName('SLASHCARTRIDGE').build(),
            new CartridgeSlotBuilder().withIndex(70).withCartridgeName('XMLCARTRIDGE').build(),

            new CartridgeSlotBuilder().withIndex(96).withCartridgePattern(/HASHCOLLECTOR.*/)
              .withIsCollector(true)
              .withMaxDepth(-1).build(),
            new CartridgeSlotBuilder().withIndex(105).withCartridgePattern(/JSONCOLLECTOR.*/)
              .withIsCollector(true)
              .withMaxDepth(0).build(),
            new CartridgeSlotBuilder().withIndex(124).withCartridgePattern(/MULTILINESLASHCOLLECTOR.*/)
              .withIsCollector(true)
              .withMaxDepth(1).build(),
            new CartridgeSlotBuilder().withIndex(135).withCartridgePattern(/NATIVECOLLECTOR.*/)
              .withIsCollector(true)
              .withMaxDepth(2).build(),
            new CartridgeSlotBuilder().withIndex(144).withCartridgePattern(/SLASHCOLLECTOR.*/)
              .withIsCollector(true)
              .withMaxDepth(3).build(),
            new CartridgeSlotBuilder().withIndex(151).withCartridgePattern(/XMLCOLLECTOR.*/)
              .withIsCollector(true)
              .withMaxDepth(4).build(),

            new CartridgeSlotBuilder().withIndex(176).withCartridgePattern('HASHCOLLECTOR*')
              .withIsCollector(true)
              .withMaxDepth(-1).build(),
            new CartridgeSlotBuilder().withIndex(185).withCartridgePattern('JSONCOLLECTOR*')
              .withIsCollector(true)
              .withMaxDepth(0).build(),
            new CartridgeSlotBuilder().withIndex(204).withCartridgePattern('MULTILINESLASHCOLLECTOR*')
              .withIsCollector(true)
              .withMaxDepth(1).build(),
            new CartridgeSlotBuilder().withIndex(215).withCartridgePattern('NATIVECOLLECTOR*')
              .withIsCollector(true)
              .withMaxDepth(2).build(),
            new CartridgeSlotBuilder().withIndex(224).withCartridgePattern('SLASHCOLLECTOR*')
              .withIsCollector(true)
              .withMaxDepth(3).build(),
            new CartridgeSlotBuilder().withIndex(231).withCartridgePattern('XMLCOLLECTOR*')
              .withIsCollector(true)
              .withMaxDepth(4).build(),

            new CartridgeSlotBuilder().withIndex(245).withCartridgeName('HASHCARTRIDGE')
              .withEnvironment().build(),
            new CartridgeSlotBuilder().withIndex(253).withCartridgeName('JSONCARTRIDGE')
              .withEnvironment().build(),
            new CartridgeSlotBuilder().withIndex(271).withCartridgeName('MULTILINECARTRIDGE')
              .withEnvironment().build(),
            new CartridgeSlotBuilder().withIndex(281).withCartridgeName('NATIVECARTRIDGE')
              .withEnvironment().build(),
            new CartridgeSlotBuilder().withIndex(290).withCartridgeName('SLASHCARTRIDGE')
              .withEnvironment().build(),
            new CartridgeSlotBuilder().withIndex(297).withCartridgeName('XMLCARTRIDGE')
              .withEnvironment().build()
          ]

          let sortedSlots = slots.sort((a, b) => { return a.index - b.index })
          sortedSlots.forEach((slot, index) => {
            chai.expect(slot).to.eql(testSlots[ index ])
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
              ).readContent(),
              testSocketNodeContent: (
                value.getChildByName('testSocket.txt') as SocketNodeInterface
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
          chai.expect(
            value.testSocketNodeContent
          ).to.equal(`CARTRIDGES

HASH:


JSON:


MULTILINESLASH:


NATIVE:


SLASH:


XML:


COLLECTORSREGEXP

HASH:


JSON:



MULTILINESLASH:



NATIVE:



SLASH:


XML:


COLLECTORSGLOB:

HASH:


JSON:



MULTILINESLASH:



NATIVE:



SLASH:


XML:


ENV:

HASH:


JSON:


MULTILINESLASH:


NATIVE:


SLASH:


XML:
`
          )
        }
      )
  })
})
