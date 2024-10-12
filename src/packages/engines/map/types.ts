import type { BaseTree, TAction, InteractiveSceneBaseEngine } from '@/types'

export interface TTextTypeSectorEvent {
  type: 'text'
  action: TAction
}

export interface TLockTypeSectorEvent {
  type: 'lock'
  image?: string
  imageOnFog?: string
  action: TAction
}

export interface TEnemySectorEvent {
  type: 'event'
  image?: string
  imageOnFog?: string
  action: TAction
}

export type TSectorEventTypeUnion = TTextTypeSectorEvent | TLockTypeSectorEvent | TEnemySectorEvent

export type TEventCells = Map<`${number}:${number}`, TSectorEventTypeUnion>

export interface TMapTree extends BaseTree {
  once?: boolean
}

export interface TMapColors {
  activePointFill: string
  fullFogFill: string
  closeFogFill: string
  oldStepPointFill: string
}

export interface TBaseMapData {
  gameId: string
  sceneId: string
  grid: { x: number; y: number }
  startCoord: { x: number; y: number }
  eventCells: TEventCells
  colors?: Partial<TMapColors>
}

export interface TMapEngineConfig {
  type: 'map'
  engine: InteractiveSceneBaseEngine<TBaseMapData>
}
