import { FileNode } from 'file-hierarchy'
import { SockoNodeInterface } from 'socko-api'
import { ConverterOptionsInterface } from '../options/ConverterOptionsInterface'
import Bluebird = require('bluebird')

/**
 * An interface for specific node converters
 */
export interface NodeConverterInterface {

  /**
   * Can this node converter convert the specified FileNode
   * @param {ConverterOptionsInterface} options converter options
   * @param {FileNode} node node to check
   * @return {boolean}
   */
  isEligible (options: ConverterOptionsInterface, node: FileNode): boolean

  /**
   * Convert the given FileNode and return the SockoNodeInterface from it
   * @param {ConverterOptionsInterface} options
   * @param {FileNode} node
   * @return {Bluebird<SockoNodeInterface>}
   */
  convert (options: ConverterOptionsInterface, node: FileNode): Bluebird<SockoNodeInterface>
}
