import { useEffect, useState } from 'react'
import * as Trystero from 'trystero'
import nacl from 'tweetnacl'
import util from 'tweetnacl-util'
import z from 'zod'

const Ed25519PublicKeySchema = z.base64().length(44)
const Ed25519SecretKeySchema = z.base64().length(88)
const Ed25519SignatureSchema = z.base64().length(88)

const PublishTextSchema = z.strictObject({
  is: z.literal("v1-publish-text"),

  messageId: z.uuidv4(),
  stationId: z.uuidv4(),
  senderKey: Ed25519PublicKeySchema,
  signature: Ed25519SignatureSchema,

  content: z.string(),
})

type Ed25519PublicKey = z.infer<typeof Ed25519PublicKeySchema>
type Ed25519SecretKey = z.infer<typeof Ed25519SecretKeySchema>
type Ed25519Signature = z.infer<typeof Ed25519SignatureSchema>

type PublishText = z.infer<typeof PublishTextSchema>

type Unsigned<T> = Omit<T, "signature">

const PublishText = {
  new(stationId: string, senderKey: string, content: string): Unsigned<PublishText> {
    return {
      is: "v1-publish-text",

      messageId: crypto.randomUUID(),
      stationId,
      senderKey,
      content
    }
  },

  __bytes__(t: Unsigned<PublishText>) {
    return util.decodeUTF8(JSON.stringify([
      t.is       ,
      t.messageId,
      t.stationId,
      t.senderKey,
      t.content  ,
    ]))
  },

  sign(t: Unsigned<PublishText>, secretKey: string) {
    const canonicalBytes = PublishText.__bytes__(t)
    const secretKeyBytes = util.decodeBase64(secretKey)
    const signatureBytes = nacl.sign.detached(canonicalBytes, secretKeyBytes)

    return PublishTextSchema.parse({
      ...t, signature: util.encodeBase64(signatureBytes)
    })
  },

  verify(t: PublishText) {
    const canonicalBytes = PublishText.__bytes__(t)
    const publicKeyBytes = util.decodeBase64(t.senderKey)
    const signatureBytes = util.decodeBase64(t.signature)
    return nacl.sign.detached.verify(canonicalBytes, signatureBytes, publicKeyBytes)
  }
}

export default function App() {
  const [room, setRoom] = useState<Trystero.Room>()

  const [stationId , setStationId ] = useState<string>(crypto.randomUUID())
  
  const [publicKey  , setPublicKey  ] = useState<string>("")
  const [secretKey  , setSecretKey  ] = useState<string>("")
  const [displayName, setDisplayName] = useState<string>("")

  const [history, setHistory] = useState<PublishText[]>([])

  const [txh, setTxh] = useState<Trystero.ActionSender  <PublishText[]>>()
  const [rxh, setRxh] = useState<Trystero.ActionReceiver<PublishText[]>>()

  const [message, setMessage] = useState<string>("")

  function dedupe(history: PublishText[]) {
    const seen = new Set<string>()
    return history.filter((h) => !seen.has(h.messageId) && seen.add(h.messageId))
  }

  function mergeHistory(otherHistory: any[]) {
    setHistory(history => dedupe([...history, ...otherHistory.filter(h => PublishText.verify(h))]))
  }

  function name() {

  }

  function send() {
    if (!txh) {
      alert("You must be connected to a station to send messages!")
      return
    }

    const m = PublishText.sign(PublishText.new(stationId, publicKey, message), secretKey)
    mergeHistory([m])
    txh([m])

    setMessage("")
  }

  function join() {
    if (!stationId.trim()) {
      alert("Station Id is required to connect!")
      return
    }


    setRoom(Trystero.joinRoom({appId: "knd"}, stationId))
  }

  useEffect(() => {
    const kp = nacl.sign.keyPair()
    setPublicKey(() => util.encodeBase64(kp.publicKey))
    setSecretKey(() => util.encodeBase64(kp.secretKey))
  }, [])


  useEffect(() => {
    if (!room) return

    const [txh, rxh] = room.makeAction<PublishText[]>("history")
  
    setTxh(() => txh)
    setRxh(() => rxh)
  }, [room])

  useEffect(() => {
    if (!room) return

    if (txh) room.onPeerJoin(peerId => {
      txh(history, peerId)
    })

    if (rxh) rxh(h => mergeHistory(h))

    return () => {
      // cleanup
      if (txh) room.onPeerJoin(() => {})
      if (rxh)             rxh(() => {})
    }
  })

  return (
    <div className="flex flex-col">
      {/* Join Station */}
      <div>
        <input  className="input" type="text"  disabled={!!room} onKeyUp={ke => ke.key === "Enter" && join()} value={stationId} onChange={(e) => setStationId(e.target.value)} />
        <button className="btn" onClick={join} disabled={!!room}>Join</button>
      </div>



      {/* Message History */}
      <div className="w-md max-h-96 min-h-96 overflow-y-scroll">
        {history.map(h => (
          <div className={`flex flex-col ${publicKey === h.senderKey && "bg-primary text-primary-content"}`} key={h.messageId}>
            <span>{h.messageId}</span>
            <span>{h.senderKey}</span>
            <span>{ h.content }</span>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div>
        <input  className="input" disabled={!room} onKeyUp={ke => ke.key === "Enter" && send()}type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="btn"   disabled={!room} onClick={send}>Send</button>
      </div>

      {/* Keys */}
      <div className="flex flex-col">
        <span>Public Key: {publicKey}</span>
        <span>Secret Key: {secretKey}</span>
      </div>
    </div>
  )
}