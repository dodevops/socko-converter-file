import { BucketPatternInterface } from './BucketPatternInterface'

/**
 * An implementation of [[BucketPatternInterface]]
 */
export class BucketPattern implements BucketPatternInterface {
  private _pattern: RegExp
  private _patternGroupName: string
  private _patternTypeGroupName: string
  private _maxDepthGroupName: string
  private _regExpPatternFlag: string
  private _globPatternFlag: string

  public get pattern (): RegExp {
    return this._pattern
  }

  public set pattern (value: RegExp) {
    this._pattern = value
  }

  public get patternGroupName (): string {
    return this._patternGroupName
  }

  public set patternGroupName (value: string) {
    this._patternGroupName = value
  }

  public get patternTypeGroupName (): string {
    return this._patternTypeGroupName
  }

  public set patternTypeGroupName (value: string) {
    this._patternTypeGroupName = value
  }

  public get maxDepthGroupName (): string {
    return this._maxDepthGroupName
  }

  public set maxDepthGroupName (value: string) {
    this._maxDepthGroupName = value
  }

  public get regExpPatternFlag (): string {
    return this._regExpPatternFlag
  }

  public set regExpPatternFlag (value: string) {
    this._regExpPatternFlag = value
  }

  public get globPatternFlag (): string {
    return this._globPatternFlag
  }

  public set globPatternFlag (value: string) {
    this._globPatternFlag = value
  }
}
