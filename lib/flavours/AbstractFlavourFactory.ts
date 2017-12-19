import { FlavourInterface } from './FlavourInterface'

/**
 * An abstract factory implementation for different flavours holding default values for all flavours
 */
export abstract class AbstractFlavourFactory {
  public create (): FlavourInterface {
    let returnValue = this._createInternal()
    if (!returnValue.cartridgeGroupName) {
      returnValue.cartridgeGroupName = 'cartridge'
    }
    if (!returnValue.collectorPatternGroupName) {
      returnValue.collectorPatternGroupName = 'pattern'
    }

    if (!returnValue.collectorMaxDepthGroupName) {
      returnValue.collectorMaxDepthGroupName = 'maxDepth'
    }

    if (!returnValue.collectorPatternTypeGroupName) {
      returnValue.collectorPatternTypeGroupName = 'patternType'
    }

    if (!returnValue.globPatternFlag) {
      returnValue.globPatternFlag = 'G'
    }

    if (!returnValue.regExpPatternFlag) {
      returnValue.regExpPatternFlag = 'R'
    }
    return returnValue
  }

  /**
   * Should be overridden by the implementating class to set values for the flavour
   * @return {FlavourInterface}
   * @private
   */
  protected abstract _createInternal (): FlavourInterface
}
