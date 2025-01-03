import type { TScene, TSceneEmmitter } from '@/types'
import type { InjectionKey } from 'vue'

export const enum EActionType {
  GoToScene = 'GO_TO_SCENE',
  GoToDialogTree = 'GO_TO_DIALOG_TREE',
  GoToInteractive = 'GO_TO_INTERACTIVE'
}

export const PROVIDE_EMITTER: InjectionKey<TSceneEmmitter> = Symbol('provide-emmiter')
export const PROVIDE_SCENES: InjectionKey<Record<string, TScene>> = Symbol('provide-scenes')
