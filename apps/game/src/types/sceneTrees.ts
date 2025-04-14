import type { TSceneTransition } from './common'
import type { TActionBtn } from './sceneAction'
import type { DynamicText } from './text'

export interface BaseTree {
  id: string
  mainText?: DynamicText
}

export type VariantsTree<T extends BaseTree = BaseTree> = T & {
  mainText: DynamicText
  actions?: TActionBtn[]
}

export type DialogTree<T extends BaseTree = BaseTree> = T & {
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

export type TextTree<T extends BaseTree = BaseTree> = VariantsTree<T> | DialogTree<T>
