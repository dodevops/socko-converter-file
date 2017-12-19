import 'mocha'
import * as XRegExp from 'xregexp'
import { HashFlavourFactory } from '../lib/flavours/HashFlavourFactory'
import { JsonFlavourFactory } from '../lib/flavours/JsonFlavourFactory'
import { MultilineSlashFlavourFactory } from '../lib/flavours/MultilineSlashFlavourFactory'
import { NativeFlavourFactory } from '../lib/flavours/NativeFlavourFactory'
import { SlashFlavourFactory } from '../lib/flavours/SlashFlavourFactory'
import { XmlFlavourFactory } from '../lib/flavours/XmlFlavourFactory'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

for (
  let flavour of
  [
    new HashFlavourFactory().create(),
    new JsonFlavourFactory().create(),
    new MultilineSlashFlavourFactory().create(),
    new NativeFlavourFactory().create(),
    new SlashFlavourFactory().create(),
    new XmlFlavourFactory().create()
  ]
  ) {
  describe(`${flavour.name}-Flavour`, function (): void {
    it(`should match the example ${flavour.example}`, function (): void {
      let match = XRegExp.exec(flavour.example, flavour.pattern)
      chai.expect(
        match[flavour.cartridgeGroupName]
      ).to.equal('CARTRIDGE-NAME')
    })
    it(`should match the collector example ${flavour.collectorExample}`, function (): void {
      let match = XRegExp.exec(flavour.collectorExample, flavour.collectorPattern)
      chai.expect(
        match[flavour.collectorMaxDepthGroupName]
      ).to.equal('MAXIMUMDEPTH')
      chai.expect(
        match[flavour.collectorPatternTypeGroupName]
      ).to.equal('PATTERNTYPE')
      chai.expect(
        match[flavour.collectorPatternGroupName]
      ).to.equal('PATTERN')
    })
  })
}
