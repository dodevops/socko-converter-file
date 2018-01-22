import 'mocha'
import { BranchNodeBuilder, OutputNodeBuilder, RootNodeBuilder } from 'socko-api'
import { TreeToFileConverter } from '../lib/converter/TreeToFileConverter'
import { ConverterOptionsFactory } from '../lib/options/ConverterOptionsFactory'
import * as tempfs from 'temp-fs'
import * as chaiFiles from 'chai-files'
import * as path from 'path'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')
import Bluebird = require('bluebird')

chai.use(chaiAsPromised)

chai.use(chaiFiles)

function getTempPath (): Bluebird.Disposer<tempfs.dir> {
  return Bluebird.fromCallback<tempfs.dir>(
    tempfs.mkdir.bind(
      null,
      {
        recursive: true
      }
    )
  )
    .disposer(
      (tempPath: tempfs.dir) => {
        return Bluebird.resolve()
          .then(
            () => {
              return Bluebird.fromCallback(
                tempPath.unlink
              )
            }
          )
          .thenReturn()
      }
    )
}

describe('TreeToFileConverter', function (): void {
  describe('#convert', function (): void {
    it('should convert a tree to a file hierarchy', function (): Bluebird<void> {
      let hierarchy = new RootNodeBuilder()
        .withChild(
          new OutputNodeBuilder()
            .withName('testOutputNode.txt')
            .withReadContent(() => {
              return Bluebird.resolve('TESTCONTENT')
            })
            .build()
        )
        .withChild(
          new BranchNodeBuilder()
            .withName('testBranchNode')
            .withChild(
              new OutputNodeBuilder()
                .withName('testOutputNode2.txt')
                .withReadContent(() => {
                  return Bluebird.resolve('TESTCONTENTINBRANCHNODE')
                })
                .build()
            )
            .build()
        )
        .build()
      let options = new ConverterOptionsFactory().create()
      return Bluebird.using(
        getTempPath(),
        tempPath => {
          options.outputPath = tempPath.path as string
          return new TreeToFileConverter(
            options
          ).convert(hierarchy)
            .then(
              () => {
                chai.expect(
                  chaiFiles.file(path.join(tempPath.path as string, 'testOutputNode.txt'))
                ).to.equal('TESTCONTENT')
                chai.expect(
                  chaiFiles.file(path.join(tempPath.path as string, 'testBranchNode', 'testOutputNode2.txt'))
                ).to.equal('TESTCONTENTINBRANCHNODE')
              }
            )
        }
      )
    })
    it('should convert a tree to a file hierarchy in a missing output path', function (): Bluebird<void> {
      let hierarchy = new RootNodeBuilder()
        .withChild(
          new OutputNodeBuilder()
            .withName('testOutputNode.txt')
            .withReadContent(() => {
              return Bluebird.resolve('TESTCONTENT')
            })
            .build()
        )
        .withChild(
          new BranchNodeBuilder()
            .withName('testBranchNode')
            .withChild(
              new OutputNodeBuilder()
                .withName('testOutputNode2.txt')
                .withReadContent(() => {
                  return Bluebird.resolve('TESTCONTENTINBRANCHNODE')
                })
                .build()
            )
            .build()
        )
        .build()
      let options = new ConverterOptionsFactory().create()
      return Bluebird.using(
        getTempPath(),
        tempPath => {
          options.outputPath = path.join(tempPath.path as string, 'some-output', 'another-output')
          return new TreeToFileConverter(
            options
          ).convert(hierarchy)
            .then(
              () => {
                chai.expect(
                  chaiFiles.file(path.join(tempPath.path as string,
                    'some-output',
                    'another-output',
                    'testOutputNode.txt'))
                ).to.equal('TESTCONTENT')
                chai.expect(
                  chaiFiles.file(path.join(tempPath.path as string,
                    'some-output',
                    'another-output',
                    'testBranchNode',
                    'testOutputNode2.txt'))
                ).to.equal('TESTCONTENTINBRANCHNODE')
              }
            )
        }
      )
    })
  })
})
