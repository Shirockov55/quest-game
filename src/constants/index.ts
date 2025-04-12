import type { TGameConfig, TSceneEmmitter } from '@/types'
import type { InjectionKey } from 'vue'

export const enum EActionType {
  GoToScene = 'GO_TO_SCENE',
  GoToDialogTree = 'GO_TO_DIALOG_TREE',
  GoToInteractive = 'GO_TO_INTERACTIVE',
  CloseDialog = 'CLOSE_DIALOG'
}

export const PROVIDE_EMITTER: InjectionKey<TSceneEmmitter> = Symbol('provide-emmiter')
export const PROVIDE_CONFIG: InjectionKey<TGameConfig> = Symbol('provide-config')
