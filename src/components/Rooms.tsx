import { LogIn, X } from "lucide-react"
import React from "react"







export default function Rooms() {
  let recentRooms = [
    "room1",
    "room2",
    "room3",
  ]

  return (
    <div className="flex gap-4 bg-base-200 w-fit rounded-lg shadow-lg p-8 h-56">

      {/* Join a Room */}
      <div className="grow flex flex-col gap-1">
        <span className="font-semibold text-xl flex justify-center">Join a Room</span>
        <div className="grow"></div>
        <input className="input input-bordered text-center" type="text" placeholder="Room Code"/>
        <button className="btn btn-primary">Join</button>
        <div className="grow"></div>
      </div>

      <div className="divider divider-horizontal"></div>

      {/* Recent Rooms */}
      <div className="grow flex flex-col gap-1">
        <span className="font-semibold text-xl flex justify-center">Recent Rooms</span>
        <div className="grow"></div>
        <div className="flex flex-col gap-1">
          {recentRooms.map(room => (
            <div key={room} className="rounded-lg bg-base-100 shadow-lg hover:bg-primary grid grid-cols-[min-content_120px_min-content] items-center w-fit p-1 gap-2 cursor-pointer">
              <LogIn/>
              <span className="p-1">{room}</span>
              {/* <button className="btn btn-sm btn-circle btn-ghost"><LogIn/></button> */}
              <button className="btn btn-sm btn-circle btn-ghost"><X/></button>
            </div>
          ))}
        </div>
        <div className="grow"></div>
      </div>
    </div>
  )
}