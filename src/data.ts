export type OriginInfo = {
  displayName: string
  publicKey  : string

  deviceEvents: DeviceEvent[]
}

export type DeviceInfo = {
  displayName: string
  publicKey  : string

  whitelistedLamport    : bigint
  whitelistedTimestamp  : number
  blacklistedLamport   ?: bigint
  blacklistedTimestamp ?: number
  signature: string
}

export const __WHITELIST_DEVICE__ = "__WHITELIST_DEVICE__"
export const __BLACKLIST_DEVICE__ = "__BLACKLIST_DEVICE__"
export const __TEXT_MESSAGE__     = "__TEXT_MESSAGE__"
export const __FILE_MESSAGE__     = "__FILE_MESSAGE__"

export type __WHITELIST_DEVICE__ = typeof __WHITELIST_DEVICE__
export type __BLACKLIST_DEVICE__ = typeof __BLACKLIST_DEVICE__
export type __TEXT_MESSAGE__     = typeof __TEXT_MESSAGE__
export type __FILE_MESSAGE__     = typeof __FILE_MESSAGE__

export type WhitelistEvent = Readonly<{
  is: __WHITELIST_DEVICE__
  originKey: string
  deviceKey: string

  lamport  : bigint
  timestamp: number
  signature: string
}>

export type BlacklistEvent = Readonly<{
  is: __BLACKLIST_DEVICE__
  originKey: string
  deviceKey: string

  lamport  : bigint
  timestamp: number
  signature: string
}>

export type DeviceEvent = 
  | WhitelistEvent 
  | BlacklistEvent

export type TextMessage = Readonly<{
  is       : __TEXT_MESSAGE__
  originKey: string
  deviceKey: string

  roomId   : string
  content  : string

  lamport  : bigint
  timestamp: number
  signature: string
}>

export type FileMessage = Readonly<{
  is       : __FILE_MESSAGE__
  originKey: string
  deviceKey: string

  roomId   : string
  content  : Resource
  preview ?: Resource

  lamport  : bigint
  timestamp: number
  signature: string
}>

export type Resource = Readonly<{
  id  : string
  name: string
  hash: string
  size: number // size in bytes
  mimeType: string
}>