import { NodeConverterInterface } from './NodeConverterInterface'
import { FileNode } from 'file-hierarchy'
import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import { CartridgeNodeBuilder, SockoNodeInterface } from 'socko-api'
import * as fs from 'fs'
import { getLogger, Logger } from 'loglevel'
import Bluebird = require('bluebird')

/**
 * A node converter for socko-api's CartridgeNodeInterfaces
 */
export class CartridgeNodeConverter implements NodeConverterInterface {
  private _log: Logger

  constructor () {
    this._log = getLogger('socko-converter-file:converter:CartridgeNodeConverter')
  }

  public isEligible (options: ConverterOptionsInterface, node: FileNode): boolean {
    let check = node.name.endsWith(options.cartridgeNodeExtension)
    if (check) {
      this._log.debug('This is a Cartridge node.')
    }
    return check
  }

  public convert (options: ConverterOptionsInterface, node: FileNode): Bluebird<SockoNodeInterface> {
    let name = node.name.slice(0, node.name.indexOf(options.cartridgeNodeExtension))
    return Bluebird.resolve(
      new CartridgeNodeBuilder()
        .withName(name)
        .withReadContent(
          () => {
            return Bluebird.fromCallback(
              fs.readFile.bind(
                null,
                node.path
              )
            )
          }
        )
        .build()
    )
  }
}
