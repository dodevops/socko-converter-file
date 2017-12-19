import { AbstractError } from './AbstractError'

/**
 * A cartridge pattern was missing a group
 */
export class InvalidCartridgePatternError extends AbstractError {

  constructor (missingGroup: string) {
    super(
      'InvalidCartridgePatternError',
      `The used cartridge pattern did not include the expected group ${missingGroup}`
    )
  }
}
