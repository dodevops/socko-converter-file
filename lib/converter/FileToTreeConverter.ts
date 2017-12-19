import { RootNodeBuilder, RootNodeInterface, SimpleNodeBuilder, SockoNodeInterface } from 'socko-api'
import { FileNode } from 'file-hierarchy'
import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import { ConverterOptionsFactory } from '../options/ConverterOptionsFactory'
import { getLogger, Logger } from 'loglevel'
import * as fs from 'fs'
import { SocketNodeConverter } from './SocketNodeConverter'
import { BucketNodeConverter } from './BucketNodeConverter'
import { NodeConverterInterface } from './NodeConverterInterface'
import { CartridgeNodeConverter } from './CartridgeNodeConverter'
import Bluebird = require('bluebird')

/**
 * Converting a File tree to a node tree
 */
export class FileToTreeConverter {

  /**
   * Currently used converters
   * @type {NodeConverterInterface[]}
   */
  private static CONVERTERS: Array<NodeConverterInterface> = [
    new SocketNodeConverter(),
    new BucketNodeConverter(),
    new CartridgeNodeConverter()
  ]

  private _resultingTree: SockoNodeInterface
  private _options: ConverterOptionsInterface
  private _log: Logger

  constructor (options?: ConverterOptionsInterface) {
    if (options) {
      this._options = options
    } else {
      this._options = new ConverterOptionsFactory().create()
    }

    this._resultingTree = new RootNodeBuilder().build()
    this._log = getLogger('socko-converter-file:converter:FileToTreeConverter')
  }

  /**
   * Convert the given FileNode tree into a socko-api tree.
   * @param {FileNode} fileTree the FileNode to convert
   * @return {Bluebird<RootNodeInterface>} the root node of the resulting socko-api tree
   */
  public convert (fileTree: FileNode): Bluebird<RootNodeInterface> {
    return this._convertTree(fileTree, this._resultingTree)
      .then(
        () => {
          return this._resultingTree
        }
      )
  }

  /**
   * Recursively convert the FileNode tree relying on [[NodeConverterInterface]]s to convert specific feature nodes
   *
   * @param {FileNode} fileTree the current FileNode to convert
   * @param {SockoNodeInterface} currentTreeNode the corresponding place in the resulting tree
   * @return {Bluebird<SockoNodeInterface>} the converted node
   * @private
   */
  private _convertTree (fileTree: FileNode, currentTreeNode: SockoNodeInterface): Bluebird<SockoNodeInterface> {
    this._log.debug(`Converting children of ${fileTree.name} at ${fileTree.path}`)

    return Bluebird.reduce<FileNode, Array<SockoNodeInterface>>(
      fileTree.getChildren(),
      (total, current) => {
        this._log.debug(`Checking ${current.name} at ${current.path}`)
        return Bluebird.resolve()
          .then(
            () => {
              for (let nodeConverter of FileToTreeConverter.CONVERTERS) {
                if (nodeConverter.isEligible(this._options, current)) {
                  return nodeConverter.convert(this._options, current)
                }
              }
              if (current.stats.isDirectory()) {
                this._log.debug('This simply is a directory.')
                let newNode = new SimpleNodeBuilder()
                  .withName(current.name)
                  .build()
                return this._convertTree(current, newNode)
              } else {
                this._log.debug('This is a simple file.')
                return Bluebird.resolve(
                  new SimpleNodeBuilder()
                    .withName(current.name)
                    .withReadContent(
                      () => {
                        return Bluebird.fromCallback(
                          fs.readFile.bind(
                            null,
                            current.path
                          )
                        )
                      }
                    )
                    .build()
                )
              }
            }
          )
          .then(
            value => {
              total.push(value)
              return Bluebird.resolve(total)
            }
          )
      },
      []
    )
      .then(
        children => {
          this._log.debug('Adding children to the converted node')
          for (let child of children) {
            currentTreeNode.addChild(child)
          }
          return Bluebird.resolve(currentTreeNode)
        }
      )
  }

}
