import { AbstractError } from './AbstractError'

/**
 * A cartridge collector pattern was missing a group
 */
export class InvalidCartridgeCollectorPatternError extends AbstractError {

  constructor (missingGroup: string) {
    super(
      'InvalidCartridgeCollectorPatternError',
      `The used cartridge collector pattern did not include the expected group ${missingGroup}`
    )
  }
}
