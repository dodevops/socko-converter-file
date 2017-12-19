import { AbstractError } from './AbstractError'

/**
 * The pattern of the descriptor was not known
 */
export class UnknownPatternTypeError extends AbstractError {

  constructor (patterntype: string) {
    super('UnknownPatternTypeError', `Unkown pattern type ${patterntype} specified`)
  }
}
