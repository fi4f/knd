import { useEffect, useRef, useState } from "react"
import * as Trystero from "trystero"
import z from "zod"

import {SenderIdentity} from "./protocol"
import { useIdentityStore } from "./store"




export default function App() {

  const { senders } = useIdentityStore()


  
  return (
    <div>

    </div>
  )
}