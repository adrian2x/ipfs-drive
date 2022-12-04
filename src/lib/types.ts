export interface Mtime {
  secs: number
  nsecs?: number
}

export interface IPFSEntry {
  readonly type: 'dir' | 'file'
  readonly cid: any
  readonly name: string
  readonly path: string
  mode?: number
  mtime?: Mtime
  size: number
}

export interface MFSEntry {
  /**
   * The object's name
   */
  name: string

  /**
   * The object's type (directory or file)
   */
  type: 'directory' | 'file'

  /**
   * The size of the file in bytes
   */
  size: number

  /**
   * The CID of the object
   */
  cid: any

  /**
   * The UnixFS mode as a Number
   */
  mode?: number

  /**
   * An object with numeric secs and nsecs properties
   */
  mtime?: Mtime
}
