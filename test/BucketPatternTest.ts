import 'mocha'
import { ConverterOptionsFactory } from '../lib/options/ConverterOptionsFactory'
import * as XRegExp from 'xregexp'
import chai = require('chai')
import chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

describe('The default bucket pattern', function (): void {
  it('should match', function (): void {
    let match = XRegExp.exec('MAXDEPTH:PATTERNTYPE:PATTERN',
      new ConverterOptionsFactory().create().bucketPattern.pattern)
    chai.expect(
      (
        match as any
      ).maxDepth
    ).to.equal('MAXDEPTH')
    chai.expect(
      (
        match as any
      ).patternType
    ).to.equal('PATTERNTYPE')
    chai.expect(
      (
        match as any
      ).pattern
    ).to.equal('PATTERN')
  })
})
