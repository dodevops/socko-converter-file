import { HashFlavourFactory } from './lib/flavours/HashFlavourFactory'
import { JsonFlavourFactory } from './lib/flavours/JsonFlavourFactory'
import { MultilineSlashFlavourFactory } from './lib/flavours/MultilineSlashFlavourFactory'
import { NativeFlavourFactory } from './lib/flavours/NativeFlavourFactory'
import { SlashFlavourFactory } from './lib/flavours/SlashFlavourFactory'
import { XmlFlavourFactory } from './lib/flavours/XmlFlavourFactory'

let flavours = [
  new HashFlavourFactory().create(),
  new JsonFlavourFactory().create(),
  new MultilineSlashFlavourFactory().create(),
  new NativeFlavourFactory().create(),
  new SlashFlavourFactory().create(),
  new XmlFlavourFactory().create()
]

console.log('The following flavours are supported currently:\n')

for (let flavour of flavours) {
  console.log(`  * ${flavour.name}: ${flavour.description}`)
  console.log('    * Cartridge example: `' + flavour.example + '`')
  console.log('    * Cartridge collector example: `' + flavour.collectorExample + '`')
}
