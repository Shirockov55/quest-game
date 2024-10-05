import { type GameConfig, ActionType } from '@/types/gameConfig'

console.log('Test game1!')

const enum ScenesIds {
  Stalker = 'Stalker',
  StalkerMonster = 'StalkerMonster'
}

const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.Stalker]: 'stalker1.jpg',
  [ScenesIds.StalkerMonster]: 'stalkerMonster.jpg'
}

const gameConfig: GameConfig = {
  name: 'game1',
  baseScene: ScenesIds.Stalker,
  scenes: {
    [ScenesIds.Stalker]: {
      image: ScenesImages[ScenesIds.Stalker],
      mainText: {
        text: 'Ты видишь какого-то странного сталкера'
      },
      buttons: [
        {
          text: 'Ты кто такой тут?',
          action: {
            type: ActionType.GoTo,
            nextId: ScenesIds.StalkerMonster
          }
        }
      ]
    },
    [ScenesIds.StalkerMonster]: {
      image: ScenesImages[ScenesIds.StalkerMonster],
      mainText: {
        text: 'Тебе пизда за такие вопросы!'
      }
    }
  }
}

export default gameConfig
