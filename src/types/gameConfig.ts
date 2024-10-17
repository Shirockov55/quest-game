import type { TMapEngineConfig } from '@/packages/engines/map'
import type { TFightEngineConfig } from '@/packages/engines/fight'

import type { TSceneTransition } from './common'
import type { TSceneEmmitter } from './engines'
import type { TextTree } from './sceneTrees'

export type TSceneType = 'static' | 'interactive' | 'temp'

export interface TScene {
  image: string
  textTrees: TextTree[]
  baseSceneType?: TSceneType
  audio?: string
  transition?: TSceneTransition
  additional?: {
    interactive?: TInteractive
  }
}

export type TInteractive = TMapEngineConfig | TFightEngineConfig

export interface TGameConfig {
  name: string
  baseScene: string
  scenes: Record<string, TScene>
  inventory?: any[]
}

export type TAdapterGameConfig = TGameConfig | ((emitter: TSceneEmmitter) => TGameConfig)
