import { joinRoom, type ActionReceiver, type ActionSender, type DataPayload, type Room } from "trystero/nostr"
import { Secret } from "./secret"
import { VERSION, Version } from "./version"

export type Message<T extends DataPayload = any> = Readonly<{
  is  : string
  data: T

  reqId ?: string
  resId ?: string
}>

export type Session = Readonly<{
  secret: string
  id    : string
  pw    : string

  rm    : Room
  tx    : ActionSender  <Message>
  rx    : ActionReceiver<Message>
}>

const appId = Version.toString(VERSION)

export const Session = {
  new(secret: string, roomId: string): Session {
    secret = Secret.mend(secret)
    const id = Secret.id(secret)
    const pw = Secret.pw(secret)

    const rm = joinRoom({ appId }, roomId)

    const [tx, rx] = rm.makeAction<Message>("mssg")

    return Object.freeze({
      secret,
      id, pw,
      rm,
      tx, rx
    })
  }
}

