import type { DynamicText } from '.'
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
    interractive?: {
      render: (el: HTMLCanvasElement) => void
      resize: (w: number, h: number) => void
      setText?: () => void
    }
  }
}

interface TBaseInventory {
  id: string
}

interface TMapInventory extends TBaseInventory {
  run: () => void
}

export interface TSceneEmmitter {
  setText(text: DynamicText): void
}

export interface TGameConfig {
  name: string
  baseScene: string
  scenes: Record<string, TScene>
  inventory?: any[]
}

export type TAdapterGameConfig = TGameConfig | ((emitter: TSceneEmmitter) => TGameConfig)
