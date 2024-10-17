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

export interface TGoToInteractive {
  type: EActionType.GoToInteractive
}

export type TAction = TGoToSceneAction | TGoToDialogTreeAction | TGoToInteractive

export interface TActionBtn {
  text: string
  action: TAction
}
