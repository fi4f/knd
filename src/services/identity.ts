export type IdentityService = {
  getOriginKey(): string
  getDeviceKey(): string

  sign  (data: string                                ): string
  verify(data: string, signature: string, key: string): boolean

  getDisplayName(            ): string
  setDisplayName(name: string): void  

  exportIdentity(                      ): ExportedIdentity
  importIdentity(data: ExportedIdentity): void
}

export type ExportedIdentity = {

}