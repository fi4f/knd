import nacl from "tweetnacl"
import util from "tweetnacl-util"
import z from "zod"

export const Ed25519PublicKeySchema = z.base64().length(44)
export const Ed25519SecretKeySchema = z.base64().length(88)
export const Ed25519SignatureSchema = z.base64().length(88)

export const WhitelistDeviceSchema = z.strictObject({
  is: z.literal("v1-whitelist-device"),
  messageId: z.uuidv4(),
  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema
}).readonly()

export const BlacklistDeviceSchema = z.strictObject({
  is: z.literal("v1-blacklist-device"),
  messageId: z.uuidv4(),
  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema
})

export const UpdateSenderInfoSchema = z.strictObject({
  is: z.literal("v1-update-sender-info"),

  messageId: z.uuidv4(),

  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema,

  displayName: z.string()
}).readonly()

export const UpdateDeviceInfoSchema = z.strictObject({
  is: z.literal("v1-update-device-info"),

  messageId: z.uuidv4(),

  senderKey: Ed25519PublicKeySchema,
  deviceKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema,

  displayName: z.string()
}).readonly()

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

export type Ed25519PublicKey = z.infer<typeof Ed25519PublicKeySchema>
export type Ed25519SecretKey = z.infer<typeof Ed25519SecretKeySchema>
export type Ed25519Signature = z.infer<typeof Ed25519SignatureSchema>

export type WhitelistDevice  = z.infer<typeof WhitelistDeviceSchema >
export type BlacklistDevice  = z.infer<typeof BlacklistDeviceSchema >
export type UpdateSenderInfo = z.infer<typeof UpdateSenderInfoSchema>
export type UpdateDeviceInfo = z.infer<typeof UpdateDeviceInfoSchema>
export type PublishText      = z.infer<typeof PublishTextSchema>

export type Unsigned<T> = Omit<T, "signature">

export const WhitelistDevice = {
  new(
    senderKey: Ed25519PublicKey,
    deviceKey: Ed25519PublicKey
  ): Unsigned<WhitelistDevice> {
    return {
      is       : "v1-whitelist-device",
      senderKey: Ed25519PublicKeySchema.parse(senderKey),
      deviceKey: Ed25519PublicKeySchema.parse(deviceKey),
      messageId: crypto.randomUUID(),
    }
  },

  __bytes__ (wd: Unsigned<WhitelistDevice>) {
    // canonical bytes
    return util.decodeUTF8(JSON.stringify([
      wd.is       ,
      wd.messageId,
      wd.senderKey,
      wd.deviceKey,
    ]))
  },

  sign(wd: Unsigned<WhitelistDevice>, secretKey: Ed25519SecretKey) {
    const canonicalBytes = WhitelistDevice.__bytes__(wd)
    const secretKeyBytes = util.decodeBase64(secretKey)
    const signatureBytes = nacl.sign.detached(canonicalBytes, secretKeyBytes)

    return WhitelistDeviceSchema.parse({
      ...wd, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(wd: WhitelistDevice) {
    const canonicalBytes = WhitelistDevice.__bytes__(wd)
    const publicKeyBytes = util.decodeBase64(wd.senderKey)
    const signatureBytes = util.decodeBase64(wd.signature)

    return nacl.sign.detached.verify(canonicalBytes, signatureBytes, publicKeyBytes)
  }
}

export const BlacklistDevice = {
  new(
    senderKey: Ed25519PublicKey, 
    deviceKey: Ed25519PublicKey
  ): Unsigned<BlacklistDevice> {
    return {
      is       : "v1-blacklist-device",
      senderKey: Ed25519PublicKeySchema.parse(senderKey),
      deviceKey: Ed25519PublicKeySchema.parse(deviceKey),
      messageId: crypto.randomUUID(),
    }
  },

  __bytes__ (bd: Unsigned<BlacklistDevice>) {
    // canonical bytes
    return util.decodeUTF8(JSON.stringify([
      bd.is       ,
      bd.messageId,
      bd.senderKey,
      bd.deviceKey,
    ]))
  },

  sign(bd: Unsigned<BlacklistDevice>, secretKey: Ed25519SecretKey) {
    const canonicalBytes = BlacklistDevice.__bytes__(bd)
    const secretKeyBytes = util.decodeBase64(secretKey)
    const signatureBytes = nacl.sign.detached(canonicalBytes, secretKeyBytes)

    return BlacklistDeviceSchema.parse({
      ...bd, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(bd: BlacklistDevice) {
    const canonicalBytes = BlacklistDevice.__bytes__(bd)
    const publicKeyBytes = util.decodeBase64(bd.senderKey)
    const signatureBytes = util.decodeBase64(bd.signature)
    return nacl.sign.detached.verify(canonicalBytes, signatureBytes, publicKeyBytes)
  }
}

export const UpdateSenderInfo = {
  new(
    senderKey  : string, 
    deviceKey  : string, 
    displayName: string
  ) {
    return UpdateSenderInfoSchema.parse({
      is       : "v1-update-sender-info",
      senderKey,
      deviceKey,
      displayName,
      messageId: crypto.randomUUID(),
    })
  },

  __bytes__(ui: Unsigned<UpdateSenderInfo>) {
    return util.decodeUTF8(JSON.stringify([
      ui.is       ,
      ui.messageId,
      ui.senderKey,
      ui.deviceKey,
      ui.displayName,
    ]))
  },

  sign(ui: Unsigned<UpdateSenderInfo>, secretKey: Ed25519SecretKey) {
    const canonicalBytes = UpdateSenderInfo.__bytes__(ui)
    const secretKeyBytes = util.decodeBase64(secretKey)
    const signatureBytes = nacl.sign.detached(canonicalBytes, secretKeyBytes)

    return UpdateSenderInfoSchema.parse({
      ...ui, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(ui: UpdateSenderInfo) {
    const canonicalBytes = UpdateSenderInfo.__bytes__(ui)
    const publicKeyBytes = util.decodeBase64(ui.deviceKey)
    const signatureBytes = util.decodeBase64(ui.signature)
    return nacl.sign.detached.verify(canonicalBytes, signatureBytes, publicKeyBytes)
  }
}

export const UpdateDeviceInfo = {
  new(
    senderKey  : string, 
    deviceKey  : string, 
    displayName: string
  ) {
    return UpdateDeviceInfoSchema.parse({
      is       : "v1-update-device-info",
      senderKey,
      deviceKey,
      displayName,
      messageId: crypto.randomUUID(),
    })
  },

  __bytes__(ui: Unsigned<UpdateDeviceInfo>) {
    return util.decodeUTF8(JSON.stringify([
      ui.is       ,
      ui.messageId,
      ui.senderKey,
      ui.deviceKey,
      ui.displayName,
    ]))
  },

  sign(ui: Unsigned<UpdateDeviceInfo>, secretKey: Ed25519SecretKey) {
    const canonicalBytes = UpdateDeviceInfo.__bytes__(ui)
    const secretKeyBytes = util.decodeBase64(secretKey)
    const signatureBytes = nacl.sign.detached(canonicalBytes, secretKeyBytes)

    return UpdateDeviceInfoSchema.parse({
      ...ui, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(ui: UpdateDeviceInfo) {
    const canonicalBytes = UpdateDeviceInfo.__bytes__(ui)
    const publicKeyBytes = util.decodeBase64(ui.deviceKey)
    const signatureBytes = util.decodeBase64(ui.signature)
    return nacl.sign.detached.verify(canonicalBytes, signatureBytes, publicKeyBytes)
  }
}

export const PublishText = {
  new(
    stationId: string, 
    channelId: string, 
    senderKey: string, 
    deviceKey: string, 
    content  : string
  ): Unsigned<PublishText> {
    return {
      is       : "v1-publish-text",
      stationId,
      channelId,
      senderKey,
      deviceKey,
      content  ,
      messageId: crypto.randomUUID(),
    }
  },

  __bytes__(pt: Unsigned<PublishText>) {
    return util.decodeUTF8(JSON.stringify([
      pt.is       ,
      pt.messageId,
      pt.stationId,
      pt.channelId,
      pt.senderKey,
      pt.deviceKey,
      pt.content  ,
    ]))
  },

  sign(pt: Unsigned<PublishText>, secretKey: Ed25519SecretKey) {
    const canonicalBytes = PublishText.__bytes__(pt)
    const secretKeyBytes = util.decodeBase64(secretKey)
    const signatureBytes = nacl.sign.detached(canonicalBytes, secretKeyBytes)

    return PublishTextSchema.parse({
      ...pt, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(pt: PublishText) {
    const canonicalBytes = PublishText.__bytes__(pt)
    const publicKeyBytes = util.decodeBase64(pt.deviceKey)
    const signatureBytes = util.decodeBase64(pt.signature)
    return nacl.sign.detached.verify(canonicalBytes, signatureBytes, publicKeyBytes)
  }
}

export function validate(a: any) {
  switch (a.is) {
    case "v1-whitelist-device"  : return WhitelistDevice .verify(WhitelistDeviceSchema .parse(a))
    case "v1-blacklist-device"  : return BlacklistDevice .verify(BlacklistDeviceSchema .parse(a))
    case "v1-update-sender-info": return UpdateSenderInfo.verify(UpdateSenderInfoSchema.parse(a))
    case "v1-update-device-info": return UpdateDeviceInfo.verify(UpdateDeviceInfoSchema.parse(a))
    case "v1-publish-text"      : return PublishText     .verify(PublishTextSchema     .parse(a))
    default: throw new Error(`[validate] Unknown type '${a.is}'`)
  }
}