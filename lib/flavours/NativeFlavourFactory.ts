import { AbstractFlavourFactory } from './AbstractFlavourFactory'
import { FlavourInterface } from './FlavourInterface'
import { Flavour } from './Flavour'
import * as XRegExp from 'xregexp'

/**
 * The native Flavours {{<< SOCKO: CARTRIDGE-NAME >>}} and {{<< SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN >>}}
 */
export class NativeFlavourFactory extends AbstractFlavourFactory {

  protected _createInternal (): FlavourInterface {
    let flavour = new Flavour()
    flavour.name = 'Native'
    flavour.description = 'SOCKO!\'s own, native flavour' +
      'Prefix cartridge name with E: to fetch the content from an environment variable'
    flavour.example = '{{<< SOCKO: CARTRIDGE-NAME >>}}'
    flavour.collectorExample = '{{<< SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN >>}}'
    flavour.pattern = XRegExp('{{<<\\sSOCKO:\\s(?<env>E:)?(?<cartridge>[^\\s]+)\\s>>}}')
    flavour.collectorPattern =
      XRegExp('{{<<\\sSOCKO:COLLECT:(?<maxDepth>[^:]*):(?<patternType>[^:]*):(?<pattern>[^\\s]*)\\s>>}}')
    return flavour
  }
}
