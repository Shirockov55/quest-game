import type { BaseTree, TAction, InteractiveSceneBaseEngine, TBaseInterractiveData } from '@/types'

export interface TBaseSectorEvent {
  type: string
  action: TAction
  group?: string
}

export interface TTextTypeSectorEvent extends TBaseSectorEvent {
  type: 'text'
}

export interface TLockTypeSectorEvent extends TBaseSectorEvent {
  type: 'lock'
  image?: string
  imageOnFog?: string
  action: TAction
}

export interface TEnemySectorEvent extends TBaseSectorEvent {
  type: 'event'
  image?: string
  imageOnFog?: string
  action: TAction
  lockInteractive?: boolean
}

export type TSectorEventTypeUnion = TTextTypeSectorEvent | TLockTypeSectorEvent | TEnemySectorEvent

export type TCoordsMapKey = `${number}:${number}`
export type TCoordsMapValue = [number, number, number, number]

export type TMapCells = Map<TCoordsMapKey, TCoordsMapValue>
export type TEventCells = Map<TCoordsMapKey, TSectorEventTypeUnion>

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
  fogConfig?: {
    fogExists?: boolean
    reducedFogExists?: boolean
    reducedRange?: number
  }
  colors?: Partial<TMapColors>
}

export interface TMapEngineConfig {
  type: 'map'
  engine: () => InteractiveSceneBaseEngine<TMapEngineData>
  baseData: {}
}

export interface TMapStore {
  eventCells: TEventCells
  openedSectors?: Set<TCoordsMapKey>
  lastX?: number
  lastY?: number
}
