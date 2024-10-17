export const GAME_ID = 'mapRuine'

export const enum ETextTreeIds {
  Intro1 = 'intro1',
  Intro2 = 'intro2',
  Intro3 = 'intro3',
  Intro4 = 'intro4',
  Map = 'map',
  StrangeMan = 'strangeMan',
  MonsterToFight = 'monsterToFight'
}

export const enum ScenesIds {
  Intro1 = 'intro1',
  Intro2 = 'intro2',
  Intro3 = 'intro3',
  Intro4 = 'intro4',
  Map = 'map',
  Monster = 'monster',
  Rip = 'rip'
}

export const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.Intro1]: 'intro1.jpg',
  [ScenesIds.Intro2]: 'intro2.jpg',
  [ScenesIds.Intro3]: 'intro3.jpg',
  [ScenesIds.Intro4]: 'intro4.jpg',
  [ScenesIds.Map]: 'map.jpg',
  [ScenesIds.Monster]: 'enemy1.jpg',
  [ScenesIds.Rip]: 'rip.jpg'
}
