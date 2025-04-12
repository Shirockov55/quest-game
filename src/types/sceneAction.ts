import type { EActionType } from '@/constants'
import type { TSceneEmmitter } from './engines'

export interface TSceneActionContext {
  prevSceneId: string | null
}

export interface TSceneEmmitCallbacks {
  before?: (emitter: TSceneEmmitter, ctx: TSceneActionContext) => void
  after?: (emitter: TSceneEmmitter, ctx: TSceneActionContext) => void
}

export interface TBaseSceneAction {
  type: EActionType
  callbacks?: TSceneEmmitCallbacks
}

export interface TGoToSceneAction extends TBaseSceneAction {
  type: EActionType.GoToScene
  nextId: string
}

export interface TBackToPrevSceneAction extends TBaseSceneAction {
  type: EActionType.GoBackToPrevScene
}

export interface TGoToDialogTreeAction extends TBaseSceneAction {
  type: EActionType.GoToDialogTree
  nextId: string
}

export interface TGoToInteractive extends TBaseSceneAction {
  type: EActionType.GoToInteractive
}

export interface TCloseDialogAction extends TBaseSceneAction {
  type: EActionType.CloseDialog
}

export type TAction =
  | TGoToSceneAction
  | TBackToPrevSceneAction
  | TGoToDialogTreeAction
  | TGoToInteractive
  | TCloseDialogAction

export interface TActionBtn {
  text: string
  action: TAction
}
