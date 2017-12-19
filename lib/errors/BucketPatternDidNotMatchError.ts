import { AbstractError } from './AbstractError'

/**
 * The bucket pattern did not match the bucket descriptor
 */
export class BucketPatternDidNotMatchError extends AbstractError {

  constructor (pattern: string) {
    super(
      'BucketPatternDidNotMatchError',
      `A node was identified as a bucket node, but the following ` +
      `pattern didn't match the content of its child node: ${pattern}`
    )
  }
}
