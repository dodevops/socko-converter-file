/**
 * A pattern for BucketNode declarations
 */
export interface BucketPatternInterface {
  /**
   * An [XRegExp](http://xregexp.com/) regular expression describing the pattern of bucket nodes. It should
   * hold the capture groups specified by patternGroupName, patternTypeGroupName and maxDepthGroupName
   */
  pattern: RegExp

  /**
   * The capture group name holding the bucket entry pattern [pattern]
   */
  patternGroupName: string

  /**
   * The capture group name holding the bucket entry pattern type [patternType]
   */
  patternTypeGroupName: string

  /**
   * The capture group name holding the maximum depth of the bucket [maxDepth]
   */
  maxDepthGroupName: string

  /**
   * What string in the patternType-match should trigger a RegExp pattern? [R]
   */
  regExpPatternFlag: string

  /**
   * What string in the patternType-match should trigger a glob pattern? [G]
   */
  globPatternFlag: string
}
