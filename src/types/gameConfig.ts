import type { TMapEngineConfig } from '@/packages/engines/map'
import type { TSceneTransition } from './common'
import type { TextTree } from './sceneTrees'
import type { TSceneEmmitter } from './engines'

export type TSceneType = 'static' | 'interactive' | 'temp'

export interface TScene {
  image: string
  textTrees: TextTree[]
  baseSceneType?: TSceneType
  audio?: string
  transition?: TSceneTransition
  additional?: {
    interractive?: TInterractive
  }
}

export type TInterractive = TMapEngineConfig

export interface TGameConfig {
  name: string
  baseScene: string
  scenes: Record<string, TScene>
  inventory?: any[]
}

export type TAdapterGameConfig = TGameConfig | ((emitter: TSceneEmmitter) => TGameConfig)
