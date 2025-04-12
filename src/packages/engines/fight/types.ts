import type {
  InteractiveSceneBaseEngine,
  TAction,
  TBaseInterractiveData,
  TWeaponInventory
} from '@/types'

export interface TFightEngineData extends TBaseInterractiveData {}

export interface TFightEngineConfig<TStats = Record<string, unknown>> {
  type: 'fight'
  engine: () => InteractiveSceneBaseEngine<TFightEngineData>
  baseData: {
    enemies: {
      chars: TStats
      effects: Record<string, FighterEffectCfgStat>
      weapons: TWeaponInventory<TStats>[]
    }[]
  }
}

export interface TFightResults {
  success: TAction
  fail: TAction
}

export interface FightTemplateProps {
  gameId: string
  playerChars: FighterChars
  enemyChars: FighterChars[]
  fightResults: TFightResults
  schema: FighterCharsCfg
  weapons: TWeaponInventory[]
  enemyWeapons: TWeaponInventory[]
}

export interface FighterNumberCfgStat {
  kind: 'number'
  label: string
  typeView: 'single' | 'range'
}

export interface FighterStringCfgStat {
  kind: 'info'
  label: string
}

export interface FighterEffectCfgStat {
  kind: 'effect'
  label: string
  isPositive: boolean
}

export interface FighterCharsCfg<TStats = Record<string, unknown>> {
  main: {
    [key in keyof TStats]: TStats[key] extends number | number[]
      ? FighterNumberCfgStat
      : TStats[key] extends string
        ? FighterStringCfgStat
        : FighterNumberCfgStat | FighterStringCfgStat
  }
  effects: Record<string, FighterEffectCfgStat>
}

export interface FighterNumberStat extends FighterNumberCfgStat {
  currVal: number
  readonly baseVal: number
}

export interface FighterStringStat extends FighterStringCfgStat {
  value: string
}

export type FighterStat = FighterNumberStat | FighterStringStat

export interface FighterChars<TStats = Record<string, unknown>> {
  main: {
    [key in keyof TStats]: TStats[key] extends number | number[]
      ? FighterNumberStat
      : TStats[key] extends string
        ? FighterStringStat
        : FighterStat
  }
  effects: Record<string, FighterEffectCfgStat>
}

export interface TFightWeapon<TStats = Record<string, unknown>> {
  effect: (
    ownStats: FighterChars<TStats>,
    enemyStats: FighterChars<TStats>
  ) => {
    player?: {
      id: keyof TStats
      diff: number | boolean
    }[]
    enemy?: {
      id: keyof TStats
      diff: number | boolean
    }[]
  }
  disabled?: (statsPlayer: FighterChars<TStats>, statsEnemy: FighterChars<TStats>) => boolean
}
