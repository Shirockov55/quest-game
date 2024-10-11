import type { EActionType } from '@/constants'

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
