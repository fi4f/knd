import nacl from "tweetnacl"
import util from "tweetnacl-util"
import z from "zod"

export const Ed25519PublicKeySchema = z.base64().length(44)
export const Ed25519SecretKeySchema = z.base64().length(88)
export const Ed25519SignatureSchema = z.base64().length(88)

export const SenderIdentitySchema = z.strictObject({
  is: z.literal("v1-sender-identity"),
  publicKey: Ed25519PublicKeySchema,
  secretKey: Ed25519SecretKeySchema.optional()
}).readonly()

export const DeviceIdentitySchema = z.strictObject({
  is: z.literal("v1-device-identity"),
  publicKey: Ed25519PublicKeySchema,
  secretKey: Ed25519SecretKeySchema.optional()
}).readonly()

export const WhitelistDeviceSchema = z.strictObject({
  is: z.literal("v1-whitelist-device"),
  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema
}).readonly()

export const BlacklistDeviceSchema = z.strictObject({
  is: z.literal("v1-blacklist-device"),
  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema
})

export const PublishTextSchema = z.strictObject({
  is: z.literal("v1-publish-text"),

  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema,

  messageId: z.uuidv4(),
  stationId: z.uuidv4(),
  channelId: z.uuidv4(),

  content: z.string()
}).readonly()


export const SenderInfoSchema = z.strictObject({
  is: z.literal("v1-sender-info"),
  displayName: z.string()
})

export const DeviceInfoSchema = z.strictObject({
  is: z.literal("v1-device-info"),
  displayName: z.string()
})

export const DeviceHistorySchema = z.strictObject({
  is: z.literal("v1-device-history"),

  events: z.array(z.union([
    WhitelistDeviceSchema,
    BlacklistDeviceSchema
  ])).readonly()
})

export type Ed25519PublicKey = z.infer<typeof Ed25519PublicKeySchema>
export type Ed25519SecretKey = z.infer<typeof Ed25519SecretKeySchema>
export type Ed25519Signature = z.infer<typeof Ed25519SignatureSchema>

export type SenderIdentity = z.infer<typeof SenderIdentitySchema>
export type DeviceIdentity = z.infer<typeof DeviceIdentitySchema>

export type WhitelistDevice = z.infer<typeof WhitelistDeviceSchema>
export type BlacklistDevice = z.infer<typeof BlacklistDeviceSchema>

export type PublishText = z.infer<typeof PublishTextSchema>

export type SenderInfo = z.infer<typeof SenderInfoSchema>
export type DeviceInfo = z.infer<typeof DeviceInfoSchema>

export const SenderIdentity = {
  new() {
    const {publicKey, secretKey} = nacl.sign.keyPair()
    return SenderIdentitySchema.parse({
      is       : "v1-sender-identity",
      publicKey: util.encodeBase64(publicKey),
      secretKey: util.encodeBase64(secretKey),
    })
  },

  from(
    publicKey : Ed25519PublicKey,
    secretKey?: Ed25519SecretKey
  ) {
    return SenderIdentitySchema.parse({
      is: "v1-sender-identity",
      publicKey,
      secretKey
    })
  },

  isAuthoritative(sender: SenderIdentity) {
    return sender.secretKey !== undefined
  },
}

export const DeviceIdentity = {
  new() {
    const {publicKey, secretKey} = nacl.sign.keyPair()
    return DeviceIdentitySchema.parse({
      is       : "v1-device-identity",
      publicKey: util.encodeBase64(publicKey),
      secretKey: util.encodeBase64(secretKey),
    })
  },

  from(
    publicKey : Ed25519PublicKey,
    secretKey?: Ed25519SecretKey
  ) {
    return DeviceIdentitySchema.parse({
      is: "v1-device-identity",
      publicKey,
      secretKey
    })
  },

  isAuthoritative(device: DeviceIdentity) {
    return device.secretKey !== undefined
  },  
}

export type Unsigned<T> = Omit<T, "signature">

export const WhitelistDevice = {
  new(
    sender: SenderIdentity, 
    device: DeviceIdentity
  ): Unsigned<WhitelistDevice> {
    return {
      is       : "v1-whitelist-device",
      senderKey: sender.publicKey,
      deviceKey: device.publicKey,
    }
  },

  __bytes__ (wd: Unsigned<WhitelistDevice>) {
    // canonical bytes
    return new TextEncoder().encode(JSON.stringify([
      wd.is       ,
      wd.senderKey,
      wd.deviceKey,
    ]))
  },

  sign(wd: Unsigned<WhitelistDevice>, sender: SenderIdentity) {
    if (!sender.secretKey) throw new Error("[WhitelistDevice.sign] Sender is missing secret key")
    
    const publicKeyBytes = util.decodeBase64(sender.publicKey)
    const secretKeyBytes = util.decodeBase64(sender.secretKey)
    const signatureBytes = nacl.sign.detached(WhitelistDevice.__bytes__(wd), secretKeyBytes)

    return WhitelistDeviceSchema.parse({
      ...wd, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(wd: WhitelistDevice) {
    const publicKeyBytes = util.decodeBase64(wd.senderKey)
    const signatureBytes = util.decodeBase64(wd.signature)

    return nacl.sign.detached.verify(
      WhitelistDevice.__bytes__(wd),
      signatureBytes,
      publicKeyBytes
    )
  }
}

export const BlacklistDevice = {
  new(
    sender: SenderIdentity, 
    device: DeviceIdentity
  ): Unsigned<BlacklistDevice> {
    return {
      is       : "v1-blacklist-device",
      senderKey: sender.publicKey,
      deviceKey: device.publicKey,
    }
  },

  __bytes__ (bd: Unsigned<BlacklistDevice>) {
    // canonical bytes
    return new TextEncoder().encode(JSON.stringify([
      bd.is       ,
      bd.senderKey,
      bd.deviceKey,
    ]))
  },

  sign(bd: Unsigned<BlacklistDevice>, sender: SenderIdentity) {
    if (!sender.secretKey) throw new Error("[BlacklistDevice.sign] Sender is missing secret key")
    
    const publicKeyBytes = util.decodeBase64(sender.publicKey)
    const secretKeyBytes = util.decodeBase64(sender.secretKey)
    const signatureBytes = nacl.sign.detached(BlacklistDevice.__bytes__(bd), secretKeyBytes)

    return BlacklistDeviceSchema.parse({
      ...bd, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(bd: BlacklistDevice) {
    const publicKeyBytes = util.decodeBase64(bd.senderKey)
    const signatureBytes = util.decodeBase64(bd.signature)

    return nacl.sign.detached.verify(
      BlacklistDevice.__bytes__(bd),
      signatureBytes,
      publicKeyBytes
    )
  }
}

export const DeviceHistory = {
  new() {

  }
}

export const SenderInfo = {
  new(displayName: string) {
    return SenderInfoSchema.parse({
      is: "v1-sender-info",
      displayName,
    })
  }
}

export const DeviceInfo = {
  new(displayName: string) {
    return DeviceInfoSchema.parse({
      is: "v1-device-info",
      displayName,
    })
  }
}