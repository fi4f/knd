import type { uuid, Pretty } from "./protocol"








export type Selection =
  | Readonly<{
      stationId: undefined
      channelId: undefined
    }>
  | Readonly<{
      stationId: uuid
      channelId: undefined
    }>
  | Readonly<{
      stationId: uuid
      channelId: uuid
    }>

export type State = Pretty<
  & Selection
  & Readonly<{
    myCustomThing: string
  }>
>


// keep track of application state