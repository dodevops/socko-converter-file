import { FlavourInterface } from './FlavourInterface'

/**
 * An implementation of [[FlavourInterface]]
 */
export class Flavour implements FlavourInterface {
  private _name: string
  private _description: string
  private _example: string
  private _collectorExample: string
  private _pattern: RegExp
  private _collectorPattern: RegExp
  private _cartridgeGroupName: string
  private _collectorPatternGroupName: string
  private _collectorMaxDepthGroupName: string
  private _collectorPatternTypeGroupName: string
  private _regExpPatternFlag: string
  private _globPatternFlag: string
  private _environmentGroupName: string
  private _environmentTrueFlag: string

  public get name (): string {
    return this._name
  }

  public set name (value: string) {
    this._name = value
  }

  public get description (): string {
    return this._description
  }

  public set description (value: string) {
    this._description = value
  }

  public get example (): string {
    return this._example
  }

  public set example (value: string) {
    this._example = value
  }

  public get collectorExample (): string {
    return this._collectorExample
  }

  public set collectorExample (value: string) {
    this._collectorExample = value
  }

  public get pattern (): RegExp {
    return this._pattern
  }

  public set pattern (value: RegExp) {
    this._pattern = value
  }

  public get collectorPattern (): RegExp {
    return this._collectorPattern
  }

  public set collectorPattern (value: RegExp) {
    this._collectorPattern = value
  }

  public get cartridgeGroupName (): string {
    return this._cartridgeGroupName
  }

  public set cartridgeGroupName (value: string) {
    this._cartridgeGroupName = value
  }

  public get collectorPatternGroupName (): string {
    return this._collectorPatternGroupName
  }

  public set collectorPatternGroupName (value: string) {
    this._collectorPatternGroupName = value
  }

  public get collectorMaxDepthGroupName (): string {
    return this._collectorMaxDepthGroupName
  }

  public set collectorMaxDepthGroupName (value: string) {
    this._collectorMaxDepthGroupName = value
  }

  public get collectorPatternTypeGroupName (): string {
    return this._collectorPatternTypeGroupName
  }

  public set collectorPatternTypeGroupName (value: string) {
    this._collectorPatternTypeGroupName = value
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

  public get environmentGroupName (): string {
    return this._environmentGroupName
  }

  public set environmentGroupName (value: string) {
    this._environmentGroupName = value
  }

  public get environmentTrueFlag (): string {
    return this._environmentTrueFlag
  }

  public set environmentTrueFlag (value: string) {
    this._environmentTrueFlag = value
  }
}
