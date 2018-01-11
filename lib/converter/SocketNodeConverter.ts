import { NodeConverterInterface } from './NodeConverterInterface'
import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import { FileNode } from 'file-hierarchy'
import { CartridgeSlotBuilder, CartridgeSlotInterface, SocketNodeBuilder, SockoNodeInterface } from 'socko-api'
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

          let cartridgeSlots: Array<CartridgeSlotInterface> = []

          for (let flavour of options.cartridgeFlavours) {
            let match: any

            this._log.debug('Searching for cartridge slots in all suported flavours')

            match = XRegExp.exec(content, flavour.pattern)
            while (match) {
              this._log.debug(`Found slot with ${flavour.name} flavour at index ${match.index}`)

              if (!match.hasOwnProperty(flavour.cartridgeGroupName)) {
                return Bluebird.reject(new InvalidCartridgePatternError(flavour.cartridgeGroupName))
              }

              this._log.debug('Checking, if there are other slots behind this one.')

              for (let cartridgeSlot of cartridgeSlots) {
                if (cartridgeSlot.index > match.index) {
                  cartridgeSlot.index -= match[0].length
                }
              }

              cartridgeSlots.push(
                new CartridgeSlotBuilder()
                  .withCartridgeName(match[flavour.cartridgeGroupName])
                  .withIndex(match.index)
                  .build()
              )

              // rewrite indices of cartridge slots with higher indices

              content = XRegExp.replace(content, flavour.pattern, '')

              match = XRegExp.exec(content, flavour.pattern)
            }

            this._log.debug('Searching for cartridge collector slots in all suported flavours')

            match = XRegExp.exec(content, flavour.collectorPattern)
            while (match) {
              this._log.debug(`Found collector slot with ${flavour.name} flavour at index ${match.index}`)

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

              this._log.debug('Checking, if there are other slots behind this one.')

              for (let cartridgeSlot of cartridgeSlots) {
                if (cartridgeSlot.index > match.index) {
                  cartridgeSlot.index -= match[0].length
                }
              }

              let maxDepth: number

              if (match[flavour.collectorMaxDepthGroupName] === '-') {
                this._log.warn(
                  'Setting max Depth to - is deprecated and ' +
                  'support for it will be removed in future releases. Please set it to -1 instead.'
                )
                this._log.debug('Max depth was -, setting it to -1 to be backwards compatible.')
                maxDepth = -1
              } else {
                maxDepth = parseInt(match[flavour.collectorMaxDepthGroupName], 10)
              }

              cartridgeSlots.push(
                new CartridgeSlotBuilder()
                  .withIndex(match.index)
                  .withIsCollector(true)
                  .withMaxDepth(maxDepth)
                  .withCartridgePattern(pattern)
                  .build()
              )

              content = XRegExp.replace(content, flavour.collectorPattern, '')

              match = XRegExp.exec(content, flavour.collectorPattern)
            }

          }

          for (let cartridgeSlot of cartridgeSlots) {
            socketNodeBuilder.withCartridgeSlot(cartridgeSlot)
          }

          socketNodeBuilder.withReadContent(() => {
            return Bluebird.resolve(content)
          })

          return Bluebird.resolve(socketNodeBuilder.build())
        }
      )
  }
}
