export type Version = Readonly<{
  moniker: string
  major  : number
  minor  : number
  patch  : number
}>

export const Version = {
  new(o ?: Partial<Version>): Version {
    return Object.freeze({
      moniker: o?.moniker ?? "v",
      major  : o?.major   ?? 0,
      minor  : o?.minor   ?? 0,
      patch  : o?.patch   ?? 0,
    })
  },

  compare(a: Version, b: Version) {
    let k = 0;
    if ((k = a.major - b.major) !== 0) return k;
    if ((k = a.minor - b.minor) !== 0) return k;
    if ((k = a.patch - b.patch) !== 0) return k;
    return 0;
  },

  toString(a: Version) {
    return `${a.moniker} ${a.major}.${a.minor}.${a.patch}`
  },
}

export const VERSION = Version.new({ 
  moniker: "knd", 
  major: 0, 
  minor: 1, 
  patch: 0 
})