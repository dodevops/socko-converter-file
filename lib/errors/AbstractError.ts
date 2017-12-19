import { getLogger } from 'loglevel'

/**
 * An abstract error implementation supporting logging
 */
export abstract class AbstractError extends Error {

  /**
   * Create a new error and log that.
   * @param {string} type type of error message
   * @param {string} message error message
   */
  constructor (type: string, message: string) {
    super(message)
    getLogger(`socko-converter-file:error:${type}`).error(message)
  }
}
