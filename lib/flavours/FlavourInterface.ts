/**
 * A "flavour" is a certain pattern to identify and configure cartridge and cartridge collector slots
 */
export interface FlavourInterface {
  /**
   * The descriptive name of this flavour
   */
  name: string

  /**
   * A short description about the usage of this flavour
   */
  description: string

  /**
   * A small example of a text, that would match this flavour
   */
  example: string

  /**
   * A small example of a text, that would match this flavour as a cartridge collector
   */
  collectorExample: string

  /**
   * An [XRegExp](http://xregexp.com/) regular expression describing this flavour.
   *
   * It should hold the capture group specified by cartridgeGroupName
   */
  pattern: RegExp

  /**
   * An [XRegExp](http://xregexp.com/) regular expression describing this flavour as a collector
   *
   * It should hold the capture groups specified by collectorPatternGroupName, collectorMaxDepthGroupName and
   * collectorPatternTypeGroupName
   */
  collectorPattern: RegExp

  /**
   * The named group used in the pattern to denote the cartridge name [cartridge]
   */
  cartridgeGroupName: string

  /**
   * The named group used in the pattern to denote the cartridge collector pattern [pattern]
   */
  collectorPatternGroupName: string

  /**
   * The named group used in the pattern to denote the cartridge collector's max depth [maxDepth]
   */
  collectorMaxDepthGroupName: string

  /**
   * The named group used in the pattern to denote the cartridge collector's pattern type [patternType]
   */
  collectorPatternTypeGroupName: string

  /**
   * What string in the patternType-match should trigger a RegExp pattern? [R]
   */
  regExpPatternFlag: string

  /**
   * What string in the patternType-match should trigger a glob pattern? [G]
   */
  globPatternFlag: string

  /**
   * The named group used in the pattern to denote, if the cartridge slot should use environment variables
   */
  environmentGroupName: string

  /**
   * The value of the environmentGroupName to denote, that the environment variables should be used
   */
  environmentTrueFlag: string

}
