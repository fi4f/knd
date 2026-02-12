export const WHITELIST_DEVICE = "device:whitelist"
export const BLACKLIST_DEVICE = "device:blacklist"
export const TEXT_MESSAGE     = "message:text"
export const FILE_MESSAGE     = "message:file"
export const FILE_REQUEST     = "request:file"
export const FILE_CONTENT     = "content:file"

export const HISTORY_REQUEST  = "request:history"
export const HISTORY_CONTENT  = "content:history"

export const IDENTITY_REQUEST = "request:identity"
export const IDENTITY_CONTENT = "content:identity"

export namespace Event {
  export type Signed = Readonly<{
    id       : string
    senderKey: string
    deviceKey: string
    signature: string
  }>

  export type Monotonic = Signed & Readonly<{
    lamport  : string
    timestamp: number
  }>

  export type WhitelistDevice = Signed & Readonly<{
    is: typeof WHITELIST_DEVICE
  }>

  export type BlacklistDevice = Signed & Readonly<{
    is: typeof BLACKLIST_DEVICE
  }>

  export type TextMessage = Monotonic & Readonly<{
    is: typeof TEXT_MESSAGE
    content  : string
    replyTo ?: string
  }>

  export type FileMessage = Monotonic & Readonly<{
    is: typeof FILE_MESSAGE
    content  : FileMetadata
    preview ?: FileMetadata
  }>

  export type FileRequest = Signed & Readonly<{
    is   : typeof FILE_REQUEST
    file : FileMetadata
    reqId: string
  }>

  export type FileContent = Signed & Readonly<{
    is    : typeof FILE_CONTENT
    file  : FileMetadata
    resId : string
    content: Blob
  }>

  export type HistoryRequest = Signed & Readonly<{
    is      : typeof HISTORY_REQUEST
    recent  : number
    before ?: string // lamport
  }>

  export type HistoryContent = Signed & Readonly<{
    is     : typeof HISTORY_CONTENT
    recent : number
    before : string // lamport
    content: Array<
      | Event.TextMessage
      | Event.FileMessage
    >
  }>

  export type IdentityRequest = Signed & Readonly<{
    is: typeof IDENTITY_REQUEST
  }>
}



type FileMetadata = Readonly<{
  id  : string
  name: string
  hash: string
  size: number // bytes
  mimeType: string
}>