export type TSceneTransition =
  | string
  | {
      appear: string
      dissapear: string
    }

export type TSceneType = 'static' | 'interactive' | 'temp'

export const enum EActionType {
  GoToScene = 'GO_TO_SCENE',
  GoToDialogTree = 'GO_TO_DIALOG_TREE',
  GoToInteractive = 'GO_TO_INTERACTIVE'
}

export interface TGoToSceneAction {
  nextId: string
  type: EActionType.GoToScene
}

export interface TGoToDialogTreeAction {
  nextId: string
  type: EActionType.GoToDialogTree
}

export type TAction = TGoToSceneAction | TGoToDialogTreeAction

export interface TActionBtn {
  text: string
  action: TAction
}

export interface BaseTree {
  id: string
  mainText?:
    | string
    | {
        text: string
      }
}

export interface VariantsTree extends BaseTree {
  mainText: Required<BaseTree['mainText']>
  actions: TActionBtn[]
}

export interface DialogTree extends BaseTree {
  companion: {
    name: string
    answers: TActionBtn[]
    position?: 'left' | 'right'
    transition?: TSceneTransition
    speech?:
      | string
      | {
          text: string
        }
    avatar?: {
      image: string
    }
  }
}

export type TextTree = VariantsTree | DialogTree

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
    }
  }
}

interface TBaseInventory {
  id: string
}

interface TMapInventory extends TBaseInventory {
  run: () => void
}

export interface TGameConfig {
  name: string
  baseScene: string
  scenes: Record<string, TScene>
  inventory?: any[]
}
