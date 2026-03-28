export const WHITELIST_DEVICE = "universe:whitelist-device"
export const BLACKLIST_DEVICE = "universe:blacklist-device"
export const RENAME_STATION   = "station:rename-station"
export const RENAME_CHANNEL   = "station:rename-channel"
export const PUBLISH_TEXT     = "channel:publish-text"
export const PUBLISH_FILE     = "channel:publish-file"


export namespace V1 {
  export type WhitelistDevice = Readonly<{
    is: typeof WHITELIST_DEVICE
    // signed
    senderKey: string
    deviceKey: string
    signature: string
    // versioned
    version: 1
  }>

  export type BlacklistDevice = Readonly<{
    is: typeof BLACKLIST_DEVICE
    // signed
    senderKey: string
    deviceKey: string
    signature: string
    // versioned
    version: 1
  }>

  export type RenameStation = Readonly<{
    is: typeof RENAME_STATION
    // unique
    messageId: string
    stationId: string
    // signed
    senderKey: string
    deviceKey: string
    signature: string
    // monotonic
    lamport  : string
    timestamp: number
    // versioned
    version: 1
    // payload
    stationName: string
  }>

  export type RenameChannel = Readonly<{
    is: typeof RENAME_CHANNEL
    // unique
    messageId: string
    stationId: string
    channelId: string
    // signed
    senderKey: string
    deviceKey: string
    signature: string
    // monotonic
    lamport  : string
    timestamp: number
    // versioned
    version: 1
    // payload
    channelName: string
  }>

  export type PublishText = Readonly<{
    is: typeof PUBLISH_TEXT
    // unique
    messageId: string
    stationId: string
    channelId: string
    // signed
    senderKey: string
    deviceKey: string
    signature: string
    // monotonic
    lamport  : string
    timestamp: number
    // versioned
    version: 1
    // payload
    content: string
  }>

  export type PublishFile = Readonly<{
    is: typeof PUBLISH_FILE
    // unique
    messageId: string
    stationId: string
    channelId: string
    // signed
    senderKey: string
    deviceKey: string
    signature: string
    // monotonic
    lamport  : string
    timestamp: number
    // versioned
    version: 1
    // payload
    content  : FileMetadata
    preview ?: FileMetadata
  }>  
}


export type FileMetadata = Readonly<{
  id  : string
  name: string
  hash: string
  size: number // bytes
  mimeType: string
}>

export type uuid = `${string}-${string}-${string}-${string}-${string}`