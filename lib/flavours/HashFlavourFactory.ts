import { AbstractFlavourFactory } from './AbstractFlavourFactory'
import { FlavourInterface } from './FlavourInterface'
import { Flavour } from './Flavour'
import * as XRegExp from 'xregexp'

/**
 * The hash flavours # SOCKO: CARTRIDGE-NAME # and # SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN #
 */
export class HashFlavourFactory extends AbstractFlavourFactory {

  protected _createInternal (): FlavourInterface {
    let flavour = new Flavour()
    flavour.name = 'Hash'
    flavour.description = 'Documents suitable for source code with hash-style comments'
    flavour.example = '# SOCKO: CARTRIDGE-NAME #'
    flavour.collectorExample = '# SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN #'
    flavour.pattern = XRegExp('#\\sSOCKO:\\s(?<cartridge>[^\\s]+)\\s#')
    flavour.collectorPattern =
      XRegExp('#\\sSOCKO:COLLECT:(?<maxDepth>[^:]*):(?<patternType>[^:]*):(?<pattern>[^\\s]*)\\s#')
    return flavour
  }
}
