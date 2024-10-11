import type { TEventSectors, TMapEngineConfig } from '@/packages/engines/map'
import type { DynamicText } from './text'
import type { TAction } from './sceneAction'
import type { TSceneTransition } from './common'
import type { TextTree } from './sceneTrees'

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

export interface TSceneEmmitter {
  setAction(action: TAction): void
  getState(sceneId: string): Record<string, unknown>
  setState(sceneId: string, state: Record<string, unknown>): void
}

export interface TInteractiveEngine {
  render(canvas: HTMLCanvasElement): void
  resize(boxW: number, boxH: number): void
}

export interface TGameConfig {
  name: string
  baseScene: string
  scenes: Record<string, TScene>
  inventory?: any[]
}

export type TAdapterGameConfig = TGameConfig | ((emitter: TSceneEmmitter) => TGameConfig)
