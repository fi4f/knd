export type File = Readonly<{
  uuid: string
  name: string
  hash: string
  size: number // bytes
  mimeType: string
}>