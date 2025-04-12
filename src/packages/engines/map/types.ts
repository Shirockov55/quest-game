import type { BaseTree, TAction, InteractiveSceneBaseEngine, TBaseInterractiveData } from '@/types'

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
  lockInteractive?: boolean
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

export interface TMapEngineData extends TBaseInterractiveData {
  grid: { x: number; y: number }
  startCoord: { x: number; y: number }
  colors?: Partial<TMapColors>
}

export interface TMapEngineConfig {
  type: 'map'
  engine: () => InteractiveSceneBaseEngine<TMapEngineData>
  baseData: {}
}

export interface TMapStore {
  eventCells: TEventCells
  openedSectors?: Record<number, Record<number, boolean>>
  lastX?: number
  lastY?: number
}
