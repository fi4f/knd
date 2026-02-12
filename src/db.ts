import type { BlacklistDevice, PublishFile, PublishText, RenameChannel, RenameStation, WhitelistDevice } from "./types"

export const db = {

  open() {
    return new Promise((res, rej) => {
      const request = window.indexedDB.open("knd", 1)

      request.onupgradeneeded = (e) => {
        const schema = request.result

        let store;

        store = schema.createObjectStore("whitelist-device", {keyPath: "deviceKey"})
          store.createIndex("senderKey", "senderKey", {unique: false})

        store = schema.createObjectStore("device-blacklist", {keyPath: "deviceKey"})
          store.createIndex("senderKey", "senderKey", {unique: false})  

        store = schema.createObjectStore("rename-station", {keyPath: "messageId"})
          store.createIndex("senderKey", "senderKey", {unique: false})
          store.createIndex("deviceKey", "deviceKey", {unique: false})
          store.createIndex("lamport"  , "lamport"  , {unique: false})

        store = schema.createObjectStore("rename-channel", {keyPath: "messageId"})
          store.createIndex("senderKey", "senderKey", {unique: false})
          store.createIndex("deviceKey", "deviceKey", {unique: false})
          store.createIndex("lamport"  , "lamport"  , {unique: false})

        store = schema.createObjectStore("publish-text", {keyPath: "messageId"})
          store.createIndex("senderKey", "senderKey", {unique: false})
          store.createIndex("deviceKey", "deviceKey", {unique: false})
          store.createIndex("stationId", "stationId", {unique: false})
          store.createIndex("channelId", "channelId", {unique: false})
          store.createIndex("lamport"  , "lamport"  , {unique: false})

          store.createIndex("station-channel-lamport", ["stationId", "channelId", "lamport"], {unique: false})

        store = schema.createObjectStore("publish-file", {keyPath: "messageId"})
          store.createIndex("senderKey", "senderKey", {unique: false})
          store.createIndex("deviceKey", "deviceKey", {unique: false})
          store.createIndex("stationId", "stationId", {unique: false})
          store.createIndex("channelId", "channelId", {unique: false})
          store.createIndex("lamport"  , "lamport"  , {unique: false})

          store.createIndex("station-channel-lamport", ["stationId", "channelId", "lamport"], {unique: false})

        store = schema.createObjectStore("files", )
      }      

      request.onsuccess = () => {
        res(request.result)
      }

      request.onerror   = () => {
        rej(request.error )
      }
    })
  },

  storeWhitelistDevice(db: IDBDatabase, record: WhitelistDevice) {
    return new Promise<void>((res, rej) => {
      const tx      = db.transaction("whitelist-device", "readwrite")
      const store   = tx.objectStore("whitelist-device"             )
      const request = store.put(record)

      request.onsuccess = () => res()
      request.onerror   = () => rej()
    })
  },

  storeDeviceBlacklist(db: IDBDatabase, record: BlacklistDevice) {
    return new Promise<void>((res, rej) => {
      const tx      = db.transaction("device-blacklist", "readwrite")
      const store   = tx.objectStore("device-blacklist"             )
      const request = store.put(record)

      request.onsuccess = () => res()
      request.onerror   = () => rej()
    })
  },

  storeRenameStation(db: IDBDatabase, record: RenameStation) {
    return new Promise<void>((res, rej) => {
      const tx      = db.transaction("rename-station", "readwrite")
      const store   = tx.objectStore("rename-station"             )
      const request = store.put(record)

      request.onsuccess = () => res()
      request.onerror   = () => rej()
    })
  },

  storeRenameChannel(db: IDBDatabase, record: RenameChannel) {
    return new Promise<void>((res, rej) => {
      const tx      = db.transaction("rename-channel", "readwrite")
      const store   = tx.objectStore("rename-channel"             )
      const request = store.put(record)

      request.onsuccess = () => res()
      request.onerror   = () => rej()
    })
  },

  storePublishText(db: IDBDatabase, record: PublishText) {
    return new Promise<void>((res, rej) => {
      const tx      = db.transaction("publish-text", "readwrite")
      const store   = tx.objectStore("publish-text"             )
      const request = store.put(record)

      request.onsuccess = () => res()
      request.onerror   = () => rej()
    })
  },

  storePublishFile(db: IDBDatabase, record: PublishFile) {
    return new Promise<void>((res, rej) => {
      const tx      = db.transaction("publish-file", "readwrite")
      const store   = tx.objectStore("publish-file"             )
      const request = store.put(record)

      request.onsuccess = () => res()
      request.onerror   = () => rej()
    })
  },

  fetchDeviceWhitelist(db: IDBDatabase) {
    return new Promise<WhitelistDevice[]>((res, rej) => {
      const tx      = db.transaction("whitelist-device", "readonly")
      const store   = tx.objectStore("whitelist-device"            )
      const request = store.getAll()
      request.onsuccess = () => res(request.result)
      request.onerror   = () => rej(request.error )
    })
  },

  fetchDeviceBlacklist(db: IDBDatabase) {
    return new Promise<BlacklistDevice[]>((res, rej) => {
      const tx      = db.transaction("device-blacklist", "readonly")
      const store   = tx.objectStore("device-blacklist"            )
      const request = store.getAll()
      request.onsuccess = () => res(request.result)
      request.onerror   = () => rej(request.error )
    })
  },

  fetchStationNames(db: IDBDatabase) {
    return new Promise<RenameStation[]>((res, rej) => {
      const tx      = db.transaction("rename-station", "readonly")
      const store   = tx.objectStore("rename-station"            )
      const request = store.getAll()
      request.onsuccess = () => res(request.result)
      request.onerror   = () => rej(request.error )
    })
  },

  fetchChannelNames(db: IDBDatabase) {
    return new Promise<RenameChannel[]>((res, rej) => {
      const tx      = db.transaction("rename-channel", "readonly")
      const store   = tx.objectStore("rename-channel"            )
      const request = store.getAll()
      request.onsuccess = () => res(request.result)
      request.onerror   = () => rej(request.error )
    })
  },

  fetchPublishedTexts(db: IDBDatabase) {
    return new Promise<RenameStation[]>((res, rej) => {
      const tx      = db.transaction("publish-text", "readonly")
      const store   = tx.objectStore("publish-text"            )
      const request = store.getAll()
      request.onsuccess = () => res(request.result)
      request.onerror   = () => rej(request.error )
    })
  },

  fetchPublishedFiles(db: IDBDatabase) {
    return new Promise<RenameStation[]>((res, rej) => {
      const tx      = db.transaction("publish-file", "readonly")
      const store   = tx.objectStore("publish-file"            )
      const request = store.getAll()
      request.onsuccess = () => res(request.result)
      request.onerror   = () => rej(request.error )
    })
  }
}

