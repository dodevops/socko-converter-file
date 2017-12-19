import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import { RootNodeInterface, SockoNodeInterface, SockoNodeType } from 'socko-api'
import * as fs from 'fs'
import * as path from 'path'
import { getLogger, Logger } from 'loglevel'
import { createHash } from 'crypto'
import Bluebird = require('bluebird')

/**
 * A converter to convert a socko-api SockoNodeInterface tree into a file tree
 */
export class TreeToFileConverter {
  private _options: ConverterOptionsInterface
  private _log: Logger

  /**
   * Build the converter with the given options
   * @param {ConverterOptionsInterface} options the converter options to use
   */
  constructor (options: ConverterOptionsInterface) {
    this._options = options
    this._log = getLogger('socko-converter-file:converter:TreeToFileConverter')
  }

  /**
   * Dump the given socko-api RootNodeInterface as a file tree
   * @param {RootNodeInterface} root
   * @return {Bluebird<void>}
   */
  public convert (root: RootNodeInterface): Bluebird<void> {
    return this._convert(root)
  }

  /**
   * The recursive converter method
   * @param {SockoNodeInterface} node the current node to convert
   * @return {Bluebird<void>}
   * @private
   */
  private _convert (node: SockoNodeInterface): Bluebird<void> {
    let pathResolver
    this._log.debug('Fetching path to work on')
    if (node.type === SockoNodeType.Root) {
      pathResolver = Bluebird.resolve(this._options.outputPath)
    } else {
      pathResolver = node.getPath(path.sep)
        .then(
          value => {
            let pathComponents = value.split(path.sep)
            pathComponents.shift()
            pathComponents.unshift(this._options.outputPath)
            return Bluebird.resolve(path.join.apply(null, pathComponents))
          }
        )
    }

    return pathResolver
      .then(
        nodePath => {
          this._log.debug(`Working at path ${nodePath}`)
          if (node.type === SockoNodeType.Output) {
            this._log.debug('This is a content node')
            return this._processFile(node, nodePath)
          } else {
            this._log.debug('Creating path')
            return this._processDirectory(node, nodePath)
          }
        }
      )
  }

  /**
   * Convert a socko-api BranchNodeInterface into a directory
   * @param {SockoNodeInterface} node current BranchNodeInterface node to process
   * @param {string} nodePath output path to use
   * @return {Bluebird<void>}
   * @private
   */
  private _processDirectory (node: SockoNodeInterface, nodePath: string): Bluebird<void> {
    return Bluebird.fromCallback(fs.mkdir.bind(null, nodePath))
      .catch(
        (error) => {
          return error.code === 'EEXIST'
        },
        () => {
          this._log.debug('Path already exists. Ignoring that.')
          return Bluebird.resolve()
        }
      )
      .then(
        () => {
          this._log.debug('Scanning children...')
          return Bluebird.reduce<SockoNodeInterface, void>(
            node.getChildren() as Array<SockoNodeInterface>,
            (total, child) => {
              return this._convert(child)
            },
            null
          )
        }
      )
      .thenReturn()
  }

  /**
   * Convert a socko-api OutputNodeInterface into a file
   *
   * @param {SockoNodeInterface} node node to process
   * @param {string} nodePath output path to use
   * @return {Bluebird<void>}
   * @private
   */
  private _processFile (node: SockoNodeInterface, nodePath: string): Bluebird<void> {
    return node.readContent()
      .then(
        content => {
          let options = {}
          if (typeof content === 'string') {
            this._log.debug(`The retrieved content is a string. Using encoding ${this._options.outputEncoding}`)
            options = {
              encoding: this._options.outputEncoding
            }
          }

          let writeFileCommand = Bluebird.fromCallback(
            fs.writeFile.bind(
              null,
              nodePath,
              content,
              options
            )
          )

          if (this._options.checkBeforeOverwrite) {
            this._log.debug('Checking, if new content differs from existing content')

            return Bluebird.fromCallback(
              fs.stat.bind(null, nodePath)
            )
              .catch(
                error => {
                  return error.code === 'ENOENT'
                },
                () => {
                  this._log.debug('File does not already exist. Writing file')
                  return writeFileCommand
                }
              )
              .then(
                () => {
                  this._log.debug('Hashing new content')

                  let newHash = createHash(this._options.hashingAlgorithm)
                  newHash.update(content)

                  this._log.debug('Reading original content')
                  let readOptions = {}
                  if (typeof content === 'string') {
                    readOptions = {
                      encoding: this._options.inputEncoding
                    }
                  }
                  return Bluebird.fromCallback(
                    fs.readFile.bind(null, nodePath, readOptions)
                  )
                    .then(
                      originalContent => {
                        this._log.debug('Hashing original content')

                        let originalHash = createHash(this._options.hashingAlgorithm)
                        originalHash.update(originalContent)

                        if (originalHash.digest() !== newHash.digest()) {
                          this._log.debug('Content differs. Write new file.')
                          return writeFileCommand
                        } else {
                          this._log.debug('Content matches. Skipping file.')
                          return Bluebird.resolve()
                        }
                      }
                    )
                }
              )
          } else {
            return writeFileCommand
          }
        }
      )
  }
}
