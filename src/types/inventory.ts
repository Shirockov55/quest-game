import type { TFightWeapon } from '@/packages/engines/fight'

export interface TBaseInventory {
  id: string
  label: string
}

export interface TMapInventory extends TBaseInventory {
  type: 'map'
  run: () => void
}

export interface TWeaponInventory<TStats = Record<string, unknown>> extends TBaseInventory {
  type: 'weapon'
  props: TFightWeapon<TStats>
  showInPanel?: boolean
}

export type TInventory<TStats = Record<string, unknown>> = TMapInventory | TWeaponInventory<TStats>
