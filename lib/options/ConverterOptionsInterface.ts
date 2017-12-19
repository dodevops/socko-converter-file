import { FlavourInterface } from '../flavours/FlavourInterface'
import { BucketPatternInterface } from './BucketPatternInterface'

/**
 * Options for the converters
 */
export interface ConverterOptionsInterface {
  /**
   * The extension of socket files [.socket]
   */
  socketNodeExtension: string

  /**
   * The extension to identify cartridge nodes [.cartridge]
   */
  cartridgeNodeExtension: string

  /**
   * Available Cartridge Flavours. A list of [[FlavourInterfaces]]
   * [list of all FlavourInterface-implementations in the flavours directory]
   */

  cartridgeFlavours: Array<FlavourInterface>

  /**
   * The name of the child node, if this node is a bucket node [.socko.include]
   */
  bucketNodeName: string

  /**
   * The file encoding to use when reading files [UTF-8]
   */
  inputEncoding: string

  /**
   * An [XRegExp](http://xregexp.com/) regular expression describing the pattern of bucket nodes.
   *
   * The pattern should have to named groups called 'maxDepth', 'patternType' and 'pattern' denoting the
   * positions of the maximum depth, the pattern type ([G]lob or [R]egExp) and the bucket entry pattern in the text
   *
   * [/^(?<maxDepth>[^:)+):(?<patternType>[^:)+):(?<pattern>.*)$/]
   */
  bucketPattern: BucketPatternInterface

  /**
   * Path, where to write the converted tree to
   */
  outputPath: string

  /**
   * The file encoding to use when writing files [UTF-8]
   */
  outputEncoding: string

  /**
   * Before overwriting a file, check, if the current content matches the content to write. Is slower, but doesn't
   * affect file modification times if nothing changed. [false]
   */
  checkBeforeOverwrite: boolean

  /**
   * Hashing algorithm used to check contents, if checkBeforeOverwrite is true. [sha1]
   */
  hashingAlgorithm: string

}
