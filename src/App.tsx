import { BadgePlus, Braces, QrCode, User } from "lucide-react"
import { Identity, OriginIdentity, DeviceIdentity, events, whitelist } from "./identity"

import "./style.css"
import { useEffect, useRef, useState } from "react"



type PublishText = {
  is: "v1-publish-text"

  // unique
  messageId: string

  // signed
  originKey: string
  deviceKey: string
  signature: string

  // payload
  content: string
}

type PublishFile = {
  is: "v1-publish-file"

  // unique
  messageId: string

  // signed
  originKey: string
  deviceKey: string
  signature: string

  // payload
  content  : FileInfo
  preview ?: FileInfo
}

type FileInfo = {
  is: "v1-file-info"

  // payload
  fileId  : string
  fileName: string
  fileType: string
  fileSize: number
  fileHash: string
}



export default function App() {
  const [origins , setOrigins ] = useState<OriginIdentity[]>([])
  const [devices , setDevices ] = useState<DeviceIdentity[]>([])
  const [stations, setStations] = useState<string[]>([])

  const [originName, setOriginName] = useState("")
  const [deviceName, setDeviceName] = useState("")

  const [trustedIdentities, setTrustedIdentities] = useState<Identity[]>([])

  function getOriginName(originKey: string) {
    return origins.find(o => o.publicKey === originKey)?.displayName || "Unknown"
  }

  function getDeviceName(deviceKey: string) {
    return devices.find(d => d.publicKey === deviceKey)?.displayName || "Unknown"
  }


  useEffect(() => {
    const storedOrigins  = JSON.parse(localStorage.getItem("origins" ) || "[]")
    const storedDevices  = JSON.parse(localStorage.getItem("devices" ) || "[]")
  }, [])

  useEffect(() => {
    // derive identities from stored origins
    const trustedIdentities: Identity[] = []

    for (const { publicKey: originKey } of origins)
      for (const { publicKey: deviceKey } of devices)
        if (Identity.isTrusted({ originKey, deviceKey }))
          trustedIdentities.push({ originKey, deviceKey })

    setTrustedIdentities(trustedIdentities)
  }, [origins, devices])


  useEffect(() => {
    const storedStations = JSON.parse(localStorage.getItem("stations") || "[]")
  })

  function createNewIdentity() {
    const origin = OriginIdentity.new(originName)
    const device = DeviceIdentity.new(deviceName)

    whitelist(origin, device)
    setOrigins([...origins, origin])
    setDevices([...devices, device])
  }


  return (
    <div className="w-full min-h-dvh flex items-center justify-center">
      <div className="w-fit rounded-lg border shadow-lg">
        <div className="p-8 flex flex-col gap-4">

          {/* list of trusted identities */}
          { trustedIdentities.length > 0 && (
            <>
              <span className="text-center italic">Select a trusted identity to use on this device.</span>

              <div className="flex flex-col gap-2 overflow-y-scroll h-32 bg-base-200 p-2 rounded-lg">
              { trustedIdentities.map(id => {
                return (
                  <div className="flex flex-row rounded-lg bg-base-300 hover:bg-primary cursor-pointer" key={`${id.originKey}-${id.deviceKey}`}>
                    <span className="flex gap-2 p-4"><User/> {getOriginName(id.originKey)} / {getDeviceName(id.deviceKey)}</span>
                  </div>
                )
              })}
            </div>

            <span className="text-center italic">Or</span>
            </>
          )}          

          { trustedIdentities.length === 0 && (
            <span className="text-center italic">No trusted identities could be found on this device.</span>
          )}

          {/* create a new identity */}
          <div className="w-xs flex flex-col gap-1 items-stretch">
            <span className="text-center font-semibold">Create a new identity</span>
            <input type="text" className="input" placeholder="Origin Name" value={originName} onChange={e => setOriginName(e.target.value)} />
            <input type="text" className="input" placeholder="Device Name" value={deviceName} onChange={e => setDeviceName(e.target.value)} />
            <button className="btn btn-primary" onClick={createNewIdentity}><BadgePlus /> Create</button>
          </div>

          {/* Request access from another device */}
          <div className="w-xs flex flex-col gap-1 items-stretch">
            <span className="text-center font-semibold">Request access from another device</span>
            <input type="text" className="input" placeholder="Device Name" value={deviceName} onChange={e => setDeviceName(e.target.value)} />
            <button className="btn btn-primary"><QrCode />Request</button>
          </div>

          {/* Import an existing identity */}
          <div className="w-xs flex flex-col gap-1 items-stretch">
            <span className="text-center font-semibold">Import an existing identity</span>
            <input type="text" className="input font-mono" placeholder="Identity JSON" />
            <button className="btn btn-primary"><Braces /> Import</button>
          </div>
        </div>
      </div>

    </div>
  )
}