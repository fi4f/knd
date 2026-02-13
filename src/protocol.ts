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


export type Monotonic = Signed & Readonly<{
  lamport    : string
  timestamp  : number
}>

export type Versioned<N extends number> = Readonly<{
  version: N
}>

export type WhitelistDevice = Pretty<
  & Is<typeof WHITELIST_DEVICE>
  & Signed
  & Versioned<1>
>

export type BlacklistDevice = Pretty<
  & Is<typeof BLACKLIST_DEVICE>
  & Signed
  & Versioned<1>
>

export type RenameStation = Pretty<
  & Is<typeof RENAME_STATION>
  & Signed
  & Versioned<1>
  & Readonly<{
    messageId: string
    stationId: string
    stationName: string
  }>
>

export type RenameChannel = Pretty<
  & Is<typeof RENAME_CHANNEL>
  & Signed
  & Versioned<1>
  & Readonly<{
    messageId: string
    channelId: string
    stationId: string
    channelName: string
  }>
>

export type PublishText = Pretty<
  & Is<typeof PUBLISH_TEXT>
  & Signed
  & Monotonic
  & Versioned<1>
  & Readonly<{
    messageId: string
    channelId: string
    stationId: string
    content  : string
  }>
>

export type PublishFile = Pretty<
  & Is<typeof PUBLISH_FILE>
  & Signed
  & Monotonic
  & Versioned<1>
  & Readonly<{
    messageId: string
    channelId: string
    stationId: string
    content  : FileMetadata
    preview ?: FileMetadata
  }>
>

type FileMetadata = Readonly<{
  id  : string
  name: string
  hash: string
  size: number // bytes
  mimeType: string
}>

export type Pretty<T> = {
  [K in keyof T]: T[K]
}