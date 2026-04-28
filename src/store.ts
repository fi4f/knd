import { create } from "zustand"
import { DeviceIdentity, DeviceInfo, SenderIdentity, SenderInfo } from "./protocol"
import { immer } from "zustand/middleware/immer"

// the device identity is kind of inherently tied to the sender...
// if multiple senders want to use the same device there is no reason to try and share device ids


export type Identity = {
  sender    : SenderIdentity
  device    : DeviceIdentity
  senderInfo: SenderInfo
  deviceInfo: DeviceInfo
}

export const Identity = {

  updateSenderInfo(who: Identity, senderInfo: SenderInfo) {
    return {...who, senderInfo}
  },

  updateDeviceInfo(who: Identity, deviceInfo: DeviceInfo) {
    return {...who, deviceInfo}
  },
}