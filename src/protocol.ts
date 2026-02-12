export const WHITELIST_DEVICE = "universe:whitelist-device"
export const BLACKLIST_DEVICE = "universe:blacklist-device"

export const RENAME_STATION   = "station:rename-station"
export const RENAME_CHANNEL   = "station:rename-channel"

export const PUBLISH_TEXT     = "channel:publish-text"
export const PUBLISH_FILE     = "channel:publish-file"

export type uuid = `${string}-${string}-${string}-${string}-${string}`

export type Is<T extends string> = Readonly<{
  is: T
}>

export type Signed = Readonly<{
  senderKey  : string
  deviceKey  : string
  signature  : string
}>

export type WithVersionId<N extends number = 1> = Readonly<{
  versionId: N
}>

export type WithStationId = Readonly<{
  stationId: uuid
}>

export type WithChannelId = Readonly<{
  channelId: uuid
}>

export type WithMessageId = Readonly<{
  messageId: uuid
}>

export type Monotonic = Signed & Readonly<{
  lamport    : string
  timestamp  : number
}>

export type WhitelistDevice =
  & Is<typeof WHITELIST_DEVICE>
  & Signed
  & WithVersionId<1>

export type BlacklistDevice =
  & Is<typeof BLACKLIST_DEVICE>
  & Signed
  & WithVersionId<1>

export type RenameStation =
  & Is<typeof RENAME_STATION>
  & Signed
  & WithVersionId<1>
  & WithStationId
  & WithMessageId
  & Readonly<{
    stationName: string
  }>

export type RenameChannel =
  & Is<typeof RENAME_CHANNEL>
  & Signed
  & WithVersionId<1>
  & WithStationId
  & WithChannelId
  & WithMessageId
  & Readonly<{
    channelName: string
  }>

export type PublishText =
  & Is<typeof PUBLISH_TEXT>
  & Signed
  & WithStationId
  & WithChannelId
  & WithMessageId
  & Monotonic
  & Readonly<{
    content: string
  }>

export type PublishFile =
  & Is<typeof PUBLISH_FILE>
  & Signed
  & WithStationId
  & WithMessageId
  & WithChannelId
  & Monotonic
  & Readonly<{
    content  : FileMetadata
    preview ?: FileMetadata
  }>

type FileMetadata = Readonly<{
  id  : string
  name: string
  hash: string
  size: number // bytes
  mimeType: string
}>

type Merge<T> = T