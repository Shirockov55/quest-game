import type { DynamicText, TAction } from '@/types'

export interface TTextTypeSectorEvent {
  type: 'text'
  text: DynamicText
}

export interface TLockTypeSectorEvent {
  type: 'lock'
  image?: string
  imageOnFog?: string
  text?: DynamicText
}

export interface TEnemySectorEvent {
  type: 'event'
  image?: string
  imageOnFog?: string
  textTrees?: TAction[]
}

export type TSectorEventTypeUnion = TTextTypeSectorEvent | TLockTypeSectorEvent | TEnemySectorEvent

export type TEventSectors = Record<number, Record<number, TSectorEventTypeUnion>>
