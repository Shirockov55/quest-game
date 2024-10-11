import type { EActionType } from '@/constants'

export interface TGoToSceneAction {
  type: EActionType.GoToScene
  nextId: string
  withSaveState?: boolean
}

export interface TGoToDialogTreeAction {
  type: EActionType.GoToDialogTree
  nextId: string
}

export type TAction = TGoToSceneAction | TGoToDialogTreeAction

export interface TActionBtn {
  text: string
  action: TAction
}
