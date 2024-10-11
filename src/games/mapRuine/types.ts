import type { TAction, TextTree } from '@/types'

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
