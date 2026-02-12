export type Secret = string | [string, string]

export const Secret = {
  mend(s: Secret, scrub=true) {
    const id = (Array.isArray(s) ? s : s.split("?"))[0] ?? ""
    const pw = (Array.isArray(s) ? s : s.split("?"))[1] ?? ""
    if (scrub) return [
        Secret.scrub(id),
        Secret.scrub(pw)
      ].join("?")
    else return [id, pw].join("?")
  },

  rend(s: Secret, scrub=true) {
    const id = (Array.isArray(s) ? s : s.split("?"))[0] ?? ""
    const pw = (Array.isArray(s) ? s : s.split("?"))[1] ?? ""
    if (scrub) return [
        Secret.scrub(id),
        Secret.scrub(pw)
      ] as const
    else return [id, pw] as const
  },

  id(s: Secret, scrub=true) {
    return Secret.rend(s, scrub)[0]
  },

  pw(s: Secret, scrub=true) {
    return Secret.rend(s, scrub)[1]
  },

  scrub(s: string, keep: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
    return [...s.trim().toUpperCase()].filter(c => keep.includes(c)).join("")
  }
}