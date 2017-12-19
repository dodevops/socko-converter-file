import { ConverterOptionsInterface } from './ConverterOptionsInterface'
import { FlavourInterface } from '../flavours/FlavourInterface'
import { BucketPatternInterface } from './BucketPatternInterface'

/**
 * An implementation of [[ConverterOptionsInterface]]
 */
export class ConverterOptions implements ConverterOptionsInterface {
  private _socketNodeExtension: string
  private _cartridgeFlavours: Array<FlavourInterface>
  private _bucketNodeName: string
  private _outputEncoding: string
  private _bucketPattern: BucketPatternInterface
  private _inputEncoding: string
  private _outputPath: string
  private _checkBeforeOverwrite: boolean
  private _hashingAlgorithm: string
  private _cartridgeNodeExtension: string

  public get socketNodeExtension (): string {
    return this._socketNodeExtension
  }

  public set socketNodeExtension (value: string) {
    this._socketNodeExtension = value
  }

  public get cartridgeFlavours (): Array<FlavourInterface> {
    return this._cartridgeFlavours
  }

  public set cartridgeFlavours (value: Array<FlavourInterface>) {
    this._cartridgeFlavours = value
  }

  public get bucketNodeName (): string {
    return this._bucketNodeName
  }

  public set bucketNodeName (value: string) {
    this._bucketNodeName = value
  }

  public get outputEncoding (): string {
    return this._outputEncoding
  }

  public set outputEncoding (value: string) {
    this._outputEncoding = value
  }

  public get bucketPattern (): BucketPatternInterface {
    return this._bucketPattern
  }

  public set bucketPattern (value: BucketPatternInterface) {
    this._bucketPattern = value
  }

  public get inputEncoding (): string {
    return this._inputEncoding
  }

  public set inputEncoding (value: string) {
    this._inputEncoding = value
  }

  public get outputPath (): string {
    return this._outputPath
  }

  public set outputPath (value: string) {
    this._outputPath = value
  }

  public get checkBeforeOverwrite (): boolean {
    return this._checkBeforeOverwrite
  }

  public set checkBeforeOverwrite (value: boolean) {
    this._checkBeforeOverwrite = value
  }

  public get hashingAlgorithm (): string {
    return this._hashingAlgorithm
  }

  public set hashingAlgorithm (value: string) {
    this._hashingAlgorithm = value
  }

  public get cartridgeNodeExtension (): string {
    return this._cartridgeNodeExtension
  }

  public set cartridgeNodeExtension (value: string) {
    this._cartridgeNodeExtension = value
  }
}
