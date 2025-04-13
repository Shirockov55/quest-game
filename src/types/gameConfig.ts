import type { TMapEngineConfig } from '@/packages/engines/map'
import type { TFightEngineConfig, FighterCharsCfg } from '@/packages/engines/fight'

import type { TSceneTransition } from './common'
import type { TSceneEmmitter } from './engines'
import type { TextTree } from './sceneTrees'
import type { TInventory } from './inventory'

export type TSceneType = 'static' | 'interactive' | 'temp'

export interface TScene<TStats = Record<string, unknown>> {
  image: string
  textTrees: TextTree[]
  baseSceneType?: TSceneType
  audio?: string
  transition?: TSceneTransition
  additional?: {
    interactive?: TMapEngineConfig | TFightEngineConfig<TStats>
  }
  textBoxAbsolute?: boolean
  hooks?: {
    before?: (emitter: TSceneEmmitter) => void
    after?: (emitter: TSceneEmmitter) => void
  }
}

export type TInteractive = TMapEngineConfig | TFightEngineConfig

export interface TGameConfig<TStats = Record<string, unknown>> {
  name: string
  baseScene: string
  scenes: Record<string, TScene<TStats>>
  charsSchema?: FighterCharsCfg<TStats>
  playerChars?: TStats
  inventory?: TInventory<TStats>[]
}

export type TAdapterGameConfig = TGameConfig | ((emitter: TSceneEmmitter) => TGameConfig)
