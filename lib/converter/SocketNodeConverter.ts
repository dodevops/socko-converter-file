import { NodeConverterInterface } from './NodeConverterInterface'
import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import { FileNode } from 'file-hierarchy'
import { CartridgeSlotBuilder, SocketNodeBuilder, SockoNodeInterface } from 'socko-api'
import { UnknownPatternTypeError } from '../errors/UnknownPatternTypeError'
import * as fs from 'fs'
import * as XRegExp from 'xregexp'
import { getLogger, Logger } from 'loglevel'
import { InvalidCartridgePatternError } from '../errors/InvalidCartridgePatternError'
import { InvalidCartridgeCollectorPatternError } from '../errors/InvalidCartridgeCollectorPatternError'
import Bluebird = require('bluebird')

/**
 * A node converter for socko-api's SocketNodeInterfaces
 */
export class SocketNodeConverter implements NodeConverterInterface {
  private _log: Logger

  constructor () {
    this._log = getLogger('socko-converter-file:converter:SocketNodeConverter')
  }

  public isEligible (options: ConverterOptionsInterface, node: FileNode): boolean {
    let check = node.name.endsWith(options.socketNodeExtension)
    if (check) {
      this._log.debug('This is a Socket node.')
    }
    return check
  }

  public convert (options: ConverterOptionsInterface, node: FileNode): Bluebird<SockoNodeInterface> {
    let socketNodeName = node.name.slice(0, node.name.length - options.socketNodeExtension.length)

    this._log.debug(`Converting socket node ${socketNodeName}`)

    let socketNodeBuilder = new SocketNodeBuilder()
    socketNodeBuilder.withName(socketNodeName)

    this._log.debug('Reading socket node descriptor')
    return Bluebird.fromCallback(
      fs.readFile.bind(
        null,
        node.path,
        {
          encoding: options.inputEncoding
        }
      )
    )
      .then(
        content => {
          this._log.debug('Searching for cartridge slots in all supported flavours')

          for (let flavour of options.cartridgeFlavours) {
            XRegExp.forEach(
              content,
              flavour.pattern,
              (match: any, index) => {
                this._log.debug(`Found slot with ${flavour.name} flavour at index ${index}`)

                if (!match.hasOwnProperty(flavour.cartridgeGroupName)) {
                  return Bluebird.reject(new InvalidCartridgePatternError(flavour.cartridgeGroupName))
                }

                socketNodeBuilder.withCartridgeSlot(
                  new CartridgeSlotBuilder()
                    .withCartridgeName(match[flavour.cartridgeGroupName])
                    .withIndex(match.index)
                    .build()
                )
              }
            )

            this._log.debug('Removing cartridge descriptors from content')
            content = XRegExp.replace(content, flavour.pattern, '')

            this._log.debug('Searching for cartridge collector in all suported flavours')
            XRegExp.forEach(
              content,
              flavour.collectorPattern,
              (match: any, index) => {
                this._log.debug(`Found collector slot with ${flavour.name} flavour at index ${index}`)

                this._log.debug('Sanity-checking match')

                if (!match.hasOwnProperty(flavour.collectorPatternTypeGroupName)) {
                  return Bluebird.reject(
                    new InvalidCartridgeCollectorPatternError(flavour.collectorPatternTypeGroupName)
                  )
                }

                if (!match.hasOwnProperty(flavour.collectorMaxDepthGroupName)) {
                  return Bluebird.reject(
                    new InvalidCartridgeCollectorPatternError(flavour.collectorMaxDepthGroupName)
                  )
                }

                if (!match.hasOwnProperty(flavour.collectorPatternGroupName)) {
                  return Bluebird.reject(
                    new InvalidCartridgeCollectorPatternError(flavour.collectorPatternGroupName)
                  )
                }

                let pattern: RegExp | string
                if (match[flavour.collectorPatternTypeGroupName] === flavour.regExpPatternFlag) {
                  this._log.debug('This is a RegExp pattern')
                  pattern = new RegExp(match[flavour.collectorPatternGroupName])
                } else if (match[flavour.collectorPatternTypeGroupName] === flavour.globPatternFlag) {
                  this._log.debug('This is a glob pattern')
                  pattern = match[flavour.collectorPatternGroupName]
                } else {
                  return Bluebird.reject(new UnknownPatternTypeError(match[flavour.collectorPatternTypeGroupName]))
                }

                socketNodeBuilder.withCartridgeSlot(
                  new CartridgeSlotBuilder()
                    .withIndex(match.index)
                    .withIsCollector(true)
                    .withMaxDepth(parseInt(match[flavour.collectorMaxDepthGroupName], 10))
                    .withCartridgePattern(pattern)
                    .build()
                )
              }
            )

            this._log.debug('Removing cartridge collector descriptors from content')
            content = XRegExp.replace(content, flavour.collectorPattern, '')
          }

          return Bluebird.resolve(socketNodeBuilder.build())
        }
      )
  }
}
