import { AbstractFlavourFactory } from './AbstractFlavourFactory'
import { FlavourInterface } from './FlavourInterface'
import { Flavour } from './Flavour'
import * as XRegExp from 'xregexp'

/**
 * The JSON Flavour "_SOCKO": "CARTRIDGE-NAME", and "_SOCKO:COLLECT": "MAXIMUMDEPTH:PATTERNTYPE:PATTERN",
 */
export class JsonFlavourFactory extends AbstractFlavourFactory {

  protected _createInternal (): FlavourInterface {
    let flavour = new Flavour()
    flavour.name = 'JSON'
    flavour.description = 'Flavour suitable for JSON documents. The trailing , is optional' +
      'Prefix cartridge name with E: to fetch the content from an environment variable'
    flavour.example = '"_SOCKO": "CARTRIDGE-NAME",'
    flavour.collectorExample = '"_SOCKO:COLLECT": "MAXIMUMDEPTH:PATTERNTYPE:PATTERN",'
    flavour.pattern = XRegExp('"_SOCKO":\\s"(?<env>E:)?(?<cartridge>[^"]+)",?')
    flavour.collectorPattern =
      XRegExp('"_SOCKO:COLLECT":\\s"(?<maxDepth>[^:]*):(?<patternType>[^:]*):(?<pattern>[^"]*)",?')
    return flavour
  }
}
