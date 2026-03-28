import * as Y from "yjs"
import { IndexeddbPersistence } from "y-indexeddb"


import nacl from "tweetnacl"
import util from "tweetnacl-util"

const idoc = new Y.Doc()
new IndexeddbPersistence("knd-id", idoc)
export const events = idoc.getArray<DeviceEvent>("device-events")


export type OriginIdentity = {
  is: "v1-origin-identity"
  publicKey  : string
  secretKey ?: string
  displayName: string
}

export type DeviceIdentity = {
  is: "v1-device-identity"
  publicKey  : string
  secretKey ?: string
  displayName: string
}

export type Identity = {
  originKey: string,
  deviceKey: string,
}

export type WhitelistDevice = {
  is: "v1-whitelist-device"
  originKey: string
  deviceKey: string
  signature: string
}

export type BlacklistDevice = {
  is: "v1-blacklist-device"
  originKey: string
  deviceKey: string
  signature: string
}

export type DeviceEvent = 
  | WhitelistDevice
  | BlacklistDevice

export const OriginIdentity = {
  new(displayName: string): OriginIdentity {
    const kp = nacl.sign.keyPair()
    return {
      is: "v1-origin-identity" as const,
      publicKey  : util.encodeBase64(kp.publicKey),
      secretKey  : util.encodeBase64(kp.secretKey),
      displayName,
    }
  }
}

export const DeviceIdentity = {
  new(displayName: string): DeviceIdentity {
    const kp = nacl.sign.keyPair()
    return {
      is: "v1-device-identity" as const,
      publicKey  : util.encodeBase64(kp.publicKey),
      secretKey  : util.encodeBase64(kp.secretKey),
      displayName,
    }
  }
}

export const Identity = {
  isWhitelisted(i: Identity, given: DeviceEvent[] = events.toArray()) {
    for (const e of given)
      if (
        e.is === "v1-whitelist-device" &&
        e.originKey === i.originKey &&
        e.deviceKey === i.deviceKey &&
        WhitelistDevice.verify(e)
      ) return true
    return false
  },

  isBlacklisted(i: Identity, given: DeviceEvent[] = events.toArray()) {
    for (const e of given)
      if (
        e.is === "v1-blacklist-device" &&
        e.originKey === i.originKey &&
        e.deviceKey === i.deviceKey &&
        BlacklistDevice.verify(e)
      ) return true
    return false
  },

  isTrusted(i: Identity, given: DeviceEvent[] = events.toArray()) {
    return Identity.isWhitelisted(i, given) && !Identity.isBlacklisted(i, given)
  }
}

export function whitelist(origin: OriginIdentity, device: DeviceIdentity) {
  const w = WhitelistDevice.sign({
    is: "v1-whitelist-device",
    originKey: origin.publicKey, 
    deviceKey: device.publicKey 
  }, origin.secretKey!)

  events.push([w])
}

export function blacklist(origin: OriginIdentity, device: DeviceIdentity) {
  const b = BlacklistDevice.sign({
    is: "v1-blacklist-device",
    originKey: origin.publicKey, 
    deviceKey: device.publicKey 
  }, origin.secretKey!)

  events.push([b])
}

export const WhitelistDevice = {
  canonicalPayload(w: WhitelistDevice | Omit<WhitelistDevice, "signature">) {
    return [
      w.is,
      w.originKey,
      w.deviceKey,
    ] as const
  },

  sign(w: Omit<WhitelistDevice, "signature">, secretKey: string): WhitelistDevice {    
    const secretKeyBytes = util.decodeBase64(secretKey)

    const canonicalPayload      = WhitelistDevice.canonicalPayload(w)
    const canonicalMessage      = JSON.stringify (canonicalPayload)
    const canonicalMessageBytes = util.decodeUTF8(canonicalMessage)

    const signatureBytes = nacl.sign.detached(canonicalMessageBytes, secretKeyBytes)
    const signature      = util.encodeBase64(signatureBytes)

    return {...w, signature}
  },

  verify(w: WhitelistDevice) {
    const publicKeyBytes = util.decodeBase64(w.originKey)
    const signatureBytes = util.decodeBase64(w.signature)

    const canonicalPayload      = WhitelistDevice.canonicalPayload(w)
    const canonicalMessage      = JSON.stringify (canonicalPayload)
    const canonicalMessageBytes = util.decodeUTF8(canonicalMessage)

    return nacl.sign.detached.verify(
      canonicalMessageBytes,
      signatureBytes,
      publicKeyBytes
    )
  }
}

export const BlacklistDevice = {
  canonicalPayload(b: BlacklistDevice | Omit<BlacklistDevice, "signature">) {
    return [
      b.is,
      b.originKey,
      b.deviceKey,
    ] as const
  },

  sign(b: Omit<BlacklistDevice, "signature">, secretKey: string): BlacklistDevice {    
    const secretKeyBytes = util.decodeBase64(secretKey)

    const canonicalPayload      = BlacklistDevice.canonicalPayload(b)
    const canonicalMessage      = JSON.stringify (canonicalPayload)
    const canonicalMessageBytes = util.decodeUTF8(canonicalMessage)

    const signatureBytes = nacl.sign.detached(canonicalMessageBytes, secretKeyBytes)
    const signature      = util.encodeBase64(signatureBytes)

    return {...b, signature}
  },

  verify(b: BlacklistDevice) {
    const publicKeyBytes = util.decodeBase64(b.originKey)
    const signatureBytes = util.decodeBase64(b.signature)

    const canonicalPayload      = BlacklistDevice.canonicalPayload(b)
    const canonicalMessage      = JSON.stringify (canonicalPayload)
    const canonicalMessageBytes = util.decodeUTF8(canonicalMessage)

    return nacl.sign.detached.verify(
      canonicalMessageBytes,
      signatureBytes,
      publicKeyBytes
    )
  }
}