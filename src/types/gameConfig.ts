export type TSceneTransition =
  | string
  | {
      appear: string
      dissapear: string
    }

export const enum EActionType {
  GoToScene = 'GO_TO_SCENE',
  GoToDialogTree = 'GO_TO_DIALOG_TREE'
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
  audio?: string
  transition?: TSceneTransition
}

export interface TGameConfig {
  name: string
  baseScene: string
  scenes: Record<string, TScene>
}
