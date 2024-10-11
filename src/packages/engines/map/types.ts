import type { BaseTree, TAction, TInteractiveEngine } from '@/types'

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

export type TEventSectors = Record<number, Record<number, TSectorEventTypeUnion>>

export interface TMapTree extends BaseTree {
  once?: boolean
}

export interface TBaseMapData {
  sceneId: string
  grid: [x: number, y: number]
  startCoord: [x: number, y: number]
  eventCells: TEventSectors
}

export interface TMapEngineConfig {
  type: 'map'
  engine: TInteractiveEngine
  baseData: TBaseMapData
}
