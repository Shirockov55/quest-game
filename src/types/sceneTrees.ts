import type { TSceneTransition } from './common'
import type { TActionBtn } from './sceneAction'
import type { DynamicText } from './text'

export interface BaseTree {
  id: string
  mainText?: DynamicText
}

export interface VariantsTree extends BaseTree {
  mainText: DynamicText
  actions: TActionBtn[]
}

export interface DialogTree extends BaseTree {
  companion: {
    name: string
    answers: TActionBtn[]
    position?: 'left' | 'right'
    transition?: TSceneTransition
    speech?: DynamicText
    avatar?: {
      image: string
    }
  }
}

export type TextTree = VariantsTree | DialogTree
