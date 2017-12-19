import { AbstractFlavourFactory } from './AbstractFlavourFactory'
import { FlavourInterface } from './FlavourInterface'
import { Flavour } from './Flavour'
import * as XRegExp from 'xregexp'

/**
 * The slash Flavours // SOCKO: CARTRIDGE-NAME // and // SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN //
 */
export class SlashFlavourFactory extends AbstractFlavourFactory {

  protected _createInternal (): FlavourInterface {
    let flavour = new Flavour()
    flavour.name = 'Slash'
    flavour.description = 'Flavour for source code with slash-comment style'
    flavour.example = '// SOCKO: CARTRIDGE-NAME //'
    flavour.collectorExample = '// SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN //'
    flavour.pattern = XRegExp('//\\sSOCKO:\\s(?<cartridge>[^\\s]+)\\s//')
    flavour.collectorPattern =
      XRegExp('//\\sSOCKO:COLLECT:(?<maxDepth>[^:]*):(?<patternType>[^:]*):(?<pattern>[^\\s]*)\\s//')
    return flavour
  }
}
