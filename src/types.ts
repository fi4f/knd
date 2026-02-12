export const WHITELIST_DEVICE = "device:whitelist"
export const BLACKLIST_DEVICE = "device:blacklist"
export const RENAME_STATION   = "rename:station"
export const RENAME_CHANNEL   = "rename:channel"
export const PUBLISH_TEXT     = "publish:text"
export const PUBLISH_FILE     = "publish:file"

export type WhitelistDevice = Readonly<{
  is: typeof WHITELIST_DEVICE

  //signed
  senderKey: string
  deviceKey: string
  signature: string // verify with senderKey
  // version
  version  : 1
}>

export type BlacklistDevice = Readonly<{
  is: typeof BLACKLIST_DEVICE

  //signed
  senderKey: string
  deviceKey: string
  signature: string // verify with senderKey
  // version
  version  : 1
}>

export type RenameStation = Readonly<{
  is: typeof RENAME_STATION

  // unique
  stationId: string
  messageId: string
  // signed
  senderKey: string
  deviceKey: string // verify
  signature: string // verify with deviceKey
  // version
  version  : 1
}>

export type RenameChannel = Readonly<{
  is: typeof RENAME_CHANNEL
  display  : string

  // unique
  stationId: string
  channelId: string
  messageId: string
  // signed
  senderKey: string
  deviceKey: string // verify
  signature: string // verify with deviceKey
  // version
  version  : 1
}>

export type PublishText = Readonly<{
  is: typeof PUBLISH_TEXT
  content  : string
  
  // unique
  stationId: string
  channelId: string
  messageId: string
  // signed
  senderKey: string
  deviceKey: string // verify
  signature: string // verify with deviceKey
  // monotonic
  lamport  : string
  timestamp: number
  // version
  version  : 1
}>

export type PublishFile = Readonly<{
  is: typeof PUBLISH_FILE
  content  : FileMetadata
  preview ?: FileMetadata

  // unique
  stationId: string
  messageId: string
  channelId: string
  // signed
  senderKey: string
  deviceKey: string // verify
  signature: string // verify with deviceKey
  // monotonic
  lamport  : string
  timestamp: number
  // version
  version  : 1
}>

type FileMetadata = Readonly<{
  id  : string
  name: string
  hash: string
  size: number // bytes
  mimeType: string
}>