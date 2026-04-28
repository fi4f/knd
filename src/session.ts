

import * as Trystero from 'trystero'
import type { Ed25519PublicKey, Ed25519SecretKey } from './protocol'

export type Session = {
  stationId: string,

  senderPublicKey: Ed25519PublicKey,
  senderSecretKey: Ed25519SecretKey,

  devicePublicKey: Ed25519PublicKey,
  deviceSecretKey: Ed25519SecretKey,

  history: any[],

  __trm__: Trystero.Room
  __ttx__: Trystero.ActionSender  <any>
  __trx__: Trystero.ActionReceiver<any>
}





export const Session = {

}