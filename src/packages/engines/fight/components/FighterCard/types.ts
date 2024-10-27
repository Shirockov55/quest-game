export interface FighterNumberStat {
  id: string
  kind: 'number'
  label: string
  currVal: number
  readonly baseVal: number
  typeView: 'single' | 'range'
}

export interface FighterStringStat {
  id: string
  kind: 'info'
  label: string
  value: string
}

export interface FighterEffectStat {
  id: string
  kind: 'effect'
  value: string
  label?: string
  isPositive: boolean
}

export type FighterStat = FighterNumberStat | FighterStringStat | FighterEffectStat

export interface FightAction {
  id: string
  label: string
  effect(
    ownStats: FighterStat[],
    enemyStats: FighterStat[]
  ): {
    player?: Array<{
      id: string
      diff: number
    }>
    enemy: Array<{
      id: string
      diff: number
    }>
  }
}
