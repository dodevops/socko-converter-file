import { NodeConverterInterface } from './NodeConverterInterface'
import { FileNode } from 'file-hierarchy'
import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import { BucketNodeBuilder, SockoNodeInterface } from 'socko-api'
import { InvalidBucketPatternError } from '../errors/InvalidBucketPatternError'
import { UnknownPatternTypeError } from '../errors/UnknownPatternTypeError'
import * as fs from 'fs'
import * as XRegExp from 'xregexp'
import { BucketPatternDidNotMatchError } from '../errors/BucketPatternDidNotMatchError'
import { getLogger, Logger } from 'loglevel'
import Bluebird = require('bluebird')

/**
 * A node converter for socko-api's BucketNodeInterfaces
 */
export class BucketNodeConverter implements NodeConverterInterface {
  private _log: Logger

  constructor () {
    this._log = getLogger('socko-converter-file:converter:BucketNodeConverter')
  }

  public isEligible (options: ConverterOptionsInterface, node: FileNode): boolean {
    let check = node.stats.isDirectory() &&
      node.getChildren().length === 1 &&
      node.getChildren()[0].name === options.bucketNodeName
    if (check) {
      this._log.debug('This is a bucket node.')
    }
    return check
  }

  public convert (options: ConverterOptionsInterface, node: FileNode): Bluebird<SockoNodeInterface> {
    this._log.debug('Reading the bucket descriptor')
    return Bluebird.fromCallback(
      fs.readFile.bind(
        null,
        node.getChildren()[0].path,
        {
          encoding: options.inputEncoding
        }
      )
    )
      .then(
        content => {
          this._log.debug(`Trying to match ${content} with ${options.bucketPattern.pattern.source}`)
          let match = XRegExp.exec(content.trim(), options.bucketPattern.pattern) as any
          if (!match) {
            return Bluebird.reject(new BucketPatternDidNotMatchError(options.bucketPattern.pattern.source))
          } else if (!match.hasOwnProperty(options.bucketPattern.maxDepthGroupName)) {
            return Bluebird.reject(new InvalidBucketPatternError(options.bucketPattern.maxDepthGroupName))
          } else if (!match.hasOwnProperty(options.bucketPattern.patternGroupName)) {
            return Bluebird.reject(new InvalidBucketPatternError(options.bucketPattern.patternGroupName))
          } else {
            let pattern: string | RegExp

            let patternType: string

            if (match.hasOwnProperty(options.bucketPattern.patternTypeGroupName)) {
              patternType = match[options.bucketPattern.patternTypeGroupName]
            } else {
              this._log.warn(
                'The patterntype is missing from the bucket pattern. This is deprecated and support for it' +
                'will be removed in future versions. Please add a "G" between the max depth and the pattern parameter.'
              )
              this._log.debug(
                `Setting patterntype to ${options.bucketPattern.globPatternFlag} to be backwards compatible`
              )
              patternType = options.bucketPattern.globPatternFlag
            }

            if (patternType === options.bucketPattern.regExpPatternFlag) {
              this._log.debug('This is a RegExp pattern')
              pattern = new RegExp(match.pattern)
            } else if (patternType === options.bucketPattern.globPatternFlag) {
              this._log.debug('This is a Glob pattern')
              pattern = match.pattern
            } else {
              return Bluebird.reject(new UnknownPatternTypeError(patternType))
            }

            this._log.debug('Creating new BucketNodeInterface')

            return Bluebird.resolve(
              new BucketNodeBuilder()
                .withName(node.name)
                .withPattern(pattern)
                .withMaxDepth(
                  parseInt(
                    (
                      match as any
                    ).maxDepth,
                    10
                  )
                )
                .build()
            )
          }
        }
      )
  }
}
