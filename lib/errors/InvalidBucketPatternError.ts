import { AbstractError } from './AbstractError'

/**
 * The used bucket pattern did not produce a correct match
 */
export class InvalidBucketPatternError extends AbstractError {

  constructor (groupMissing: string) {
    super('InvalidBucketPatternError', `The configured bucket pattern did not produce a group named ${groupMissing}`)
  }
}
