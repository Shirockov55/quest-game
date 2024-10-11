export interface TBaseInventory {
  id: string
}

export interface TMapInventory extends TBaseInventory {
  run: () => void
}
