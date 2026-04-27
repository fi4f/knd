import { create, createStore } from "zustand"
import { DeviceIdentity, SenderIdentity, type Ed25519PublicKey } from "./protocol"
import { immer } from "zustand/middleware/immer"


export type IdentityStoreState   = {
  senders   : SenderIdentity[]
  devices   : DeviceIdentity[]
  lastSender: SenderIdentity | null
  lastDevice: DeviceIdentity | null  
}

export type IdentityStoreActions = {
  setSenders   : (senders: SenderIdentity[]) => void
  setDevices   : (devices: DeviceIdentity[]) => void
  setLastSender: (sender: SenderIdentity | null) => void
  setLastDevice: (device: DeviceIdentity | null) => void
  addSender    : (sender: SenderIdentity) => void
  addDevice    : (device: DeviceIdentity) => void
  removeSender : (sender: SenderIdentity) => void
  removeDevice : (device: DeviceIdentity) => void
  clearSenders : () => void
  clearDevices : () => void
}

export type IdentityStore = IdentityStoreState & IdentityStoreActions



export const useIdentityStore = create<IdentityStore>()(immer((set, get) => ({
  senders: JSON.parse(localStorage.getItem("knd-senders") || "[]"),
  devices: JSON.parse(localStorage.getItem("knd-devices") || "[]"),
  lastSender: JSON.parse(localStorage.getItem("knd-last-sender") || "null"),
  lastDevice: JSON.parse(localStorage.getItem("knd-last-device") || "null"),

  setSenders   : (senders: SenderIdentity[]) => set({senders}),
  setDevices   : (devices: DeviceIdentity[]) => set({devices}),
  setLastSender: (sender: SenderIdentity | null) => set({lastSender: sender}),
  setLastDevice: (device: DeviceIdentity | null) => set({lastDevice: device}),

  // add sender if it doesn't exist
  addSender    : (sender: SenderIdentity) => set(state => {
    if (!state.senders.some(s => s.publicKey === sender.publicKey)) {
      state.senders.push(sender)
    }
  }),
  addDevice    : (device: DeviceIdentity) => set(state => {
    if (!state.devices.some(d => d.publicKey === device.publicKey)) {
      state.devices.push(device)
    }
  }),

  removeSender : (sender: SenderIdentity) => set({senders: get().senders.filter(s => s.publicKey !== sender.publicKey)}),
  removeDevice : (device: DeviceIdentity) => set({devices: get().devices.filter(d => d.publicKey !== device.publicKey)}),

  clearSenders : () => set({senders: []}),
  clearDevices : () => set({devices: []}),
})))

