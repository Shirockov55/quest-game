export const GAME_ID = 'mapRuine'

export const enum ETextTreeIds {
  Entry = 'entry',
  StrangeMan = 'strangeMan',
  MonsterToFight = 'monsterToFight'
}

export const enum ScenesIds {
  Map = 'map',
  Monster = 'monster'
}

export const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.Map]: 'map.jpg',
  [ScenesIds.Monster]: 'enemy1.jpg'
}
