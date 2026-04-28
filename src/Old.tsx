import { useEffect, useState } from "react"


type Message = {
  senderKey: string

  messageId: string
  stationId: string
  channelId: string

  content  : string
}


export default function App() {
  const [stations, setStations] = useState<string[]>(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"])
  const [channels, setChannels] = useState<string[]>(["generally-general-in-general", "random", "alpha", "bravo", "charlie", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])

  const [messages, setMessages] = useState<string[]>([])


  const [stationId, setStationId] = useState<string>("")
  const [channelId, setChannelId] = useState<string>("")


  useEffect(() => {
    
  }, [])
  
  return <>
    {/* Station dialog */}
    <div className="w-dvw h-dvh flex flex-row grow p-8 gap-1">
      <div className="flex flex-col w-62 rounded-lg gap-1">
        <div className="flex flex-col min-h-20 gap-1 bg-base-300 rounded-lg p-2">
          <span className="truncate">{stationId}</span>
          <span className="truncate">#{channelId}</span>
        </div>
        <div className="flex flex-row gap-1 grow min-h-0">
          {/* Stations */}
          <div className="flex flex-col items-center w-20 bg-base-300 rounded-lg p-2 gap-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {stations.map(station => (
              <div className={`flex flex-row items-center justify-center rounded-lg min-w-16 min-h-16 text-xl cursor-pointer ${station === stationId ? "bg-primary text-primary-content" : "bg-base-100 text-base-content"}`}
                onClick={() => setStationId(station)}
              >
                {station.trim().substring(0, 1).toUpperCase()}
              </div>
            ))}
            <button className="btn btn-ghost min-w-16 min-h-16 text-xl rounded-lg" onClick={() => setStationId("")}>+</button>
          </div>
          {/* Channels */}
          <div className="flex flex-col w-40 bg-base-300 rounded-lg p-2 gap-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {channels.map(channel => (
              <div className={`flex flex-row items-center justify-start rounded-lg p-1 cursor-pointer ${channel === channelId ? "bg-primary text-primary-content" : "bg-base-100 text-base-content"}`}
                onClick={() => setChannelId(channel)}
              >
                <span className="truncate">#{channel}</span>
              </div>
            ))}
            <button className="btn btn-ghost rounded-lg" onClick={() => setChannelId("")}>+</button>
          </div>
        </div>
        <div className="flex flex-row min-h-20 gap-1 bg-base-300 rounded-lg p-2">
        </div>
      </div>


      {/* Messages */}
      <div className="flex flex-col grow rounded-lg gap-1">
        <div className="flex flex-col grow rounded-lg p-2 bg-base-300 overflow-y-scroll">

        </div>

        <div className="flex flex-row gap-1">
          <input className="bg-base-300 grow max-w-none rounded-lg p-2" type="text"/>
          <input className="rounded-lg p-2 btn btn-primary" type="button" value="Send"/>
        </div>
      </div>

      {/* Presence */}
      <div className="flex flex-col w-62 bg-base-300 rounded-lg p-2">

      </div>
    </div>
  </>
}