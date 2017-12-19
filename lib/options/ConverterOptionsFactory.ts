import { ConverterOptionsInterface } from './ConverterOptionsInterface'
import { ConverterOptions } from './ConverterOptions'
import { HashFlavourFactory } from '../flavours/HashFlavourFactory'
import { JsonFlavourFactory } from '../flavours/JsonFlavourFactory'
import { XmlFlavourFactory } from '../flavours/XmlFlavourFactory'
import { SlashFlavourFactory } from '../flavours/SlashFlavourFactory'
import { MultilineSlashFlavourFactory } from '../flavours/MultilineSlashFlavourFactory'
import { NativeFlavourFactory } from '../flavours/NativeFlavourFactory'
import { BucketPatternFactory } from './BucketPatternFactory'

/**
 * A factory for [[ConverterOptionsInterface]] implementations
 */
export class ConverterOptionsFactory {
  public create (): ConverterOptionsInterface {
    let options = new ConverterOptions()

    options.socketNodeExtension = '.socket'
    options.cartridgeFlavours = [
      new HashFlavourFactory().create(),
      new JsonFlavourFactory().create(),
      new MultilineSlashFlavourFactory().create(),
      new NativeFlavourFactory().create(),
      new SlashFlavourFactory().create(),
      new XmlFlavourFactory().create()
    ]
    options.bucketNodeName = '.socko.include'
    options.inputEncoding = 'UTF-8'
    options.outputEncoding = 'UTF-8'
    options.bucketPattern = new BucketPatternFactory().create()
    options.checkBeforeOverwrite = false
    options.hashingAlgorithm = 'sha1'
    options.cartridgeNodeExtension = '.cartridge'
    return options
  }
}
