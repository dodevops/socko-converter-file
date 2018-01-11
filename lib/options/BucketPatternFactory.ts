import { BucketPatternInterface } from './BucketPatternInterface'
import { BucketPattern } from './BucketPattern'
import * as XRegExp from 'xregexp'

/**
 * A factory for [[BucketPatternInterface]]s
 */
export class BucketPatternFactory {

  /**
   * Create a new [[BucketPatternInterface]] implementation
   * @return {BucketPatternInterface}
   */
  public create (): BucketPatternInterface {
    let pattern = new BucketPattern()
    pattern.maxDepthGroupName = 'maxDepth'
    pattern.patternGroupName = 'pattern'
    pattern.patternTypeGroupName = 'patternType'
    pattern.globPatternFlag = 'G'
    pattern.regExpPatternFlag = 'R'
    pattern.pattern = XRegExp('^(?<maxDepth>[^:]+):((?<patternType>[^:]+):)?(?<pattern>.*)$')
    return pattern
  }
}
