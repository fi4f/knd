import { Version, VERSION } from "./version"
import { joinRoom, type DataPayload } from "trystero"

const appId = Version.toString(VERSION)
const roomId = "knd-test-room"

const room = joinRoom({ appId }, roomId)







const senderKeys = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])
const deviceKeys = await crypto.subtle.generateKey("Ed25519", true, ["sign", "verify"])

function message(is: string, ) {

}

function request(is: string, ) {

}





room.onPeerJoin((peer) => {
  // we don't need to do much here do we?
  // the only time we care about data is when we receive it, OR when we request it

  // when a peer joins should we request their identity
})