import { EActionType } from '@/constants'
import type { TGameConfig, TSceneEmmitter, TextTree } from '@/types'
import { MapEngine, returnStrategies, type TMapStore, type TMapTree } from '@/packages/engines/map'
import { FightEngine } from '@/packages/engines/fight'

import { ETextTreeIds, GAME_ID, ScenesIds, ScenesImages } from './constants'
import { mapBaseData, mapBaseDynamicData } from './mapEngineConfig'
import {
  fightBaseData,
  charsSchema,
  playerChars,
  playerInventory,
  enemies
} from './fightEngineConfig'
import type { TFightStats } from './types'

export function useConfig(emitter: TSceneEmmitter) {
  const gameConfig: TGameConfig<TFightStats> = {
    name: GAME_ID,
    baseScene: ScenesIds.Map,
    charsSchema: charsSchema,
    playerChars: playerChars,
    inventory: playerInventory,
    scenes: {
      [ScenesIds.Intro1]: {
        image: ScenesImages[ScenesIds.Intro1],
        textBoxAbsolute: true,
        textTrees: [
          {
            id: ETextTreeIds.Intro1,
            mainText: 'Вы проснулись...',
            actions: [
              {
                text: 'Сесть...',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.Intro2
                }
              },
              {
                text: 'Cпать дальше...',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.Rip
                }
              }
            ]
          }
        ]
      },
      [ScenesIds.Rip]: {
        image: ScenesImages[ScenesIds.Rip],
        textBoxAbsolute: true,
        textTrees: [
          {
            id: 'rip',
            mainText: 'Чтош... Наверное надо было вставать'
          }
        ]
      },
      [ScenesIds.Intro2]: {
        image: ScenesImages[ScenesIds.Intro2],
        textBoxAbsolute: true,
        textTrees: [
          {
            id: ETextTreeIds.Intro2,
            mainText: 'Самочувствие паршивое...',
            actions: [
              {
                text: 'Надо посмотреть что вокруг...',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.Intro3
                }
              },
              {
                text: 'Cпать дальше...',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.Rip
                }
              }
            ]
          }
        ]
      },
      [ScenesIds.Intro3]: {
        image: ScenesImages[ScenesIds.Intro3],
        textBoxAbsolute: true,
        textTrees: [
          {
            id: ETextTreeIds.Intro3,
            mainText: 'Вы нашли рюкзак и карту',
            actions: [
              {
                text: 'Что дальше?',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.Hero
                }
              }
            ]
          }
        ]
      },
      [ScenesIds.Hero]: {
        image: ScenesImages[ScenesIds.Hero],
        textBoxAbsolute: true,
        textTrees: [
          {
            id: ETextTreeIds.Intro4,
            mainText: 'Мы готовы погулять!',
            actions: [
              {
                text: '[Посмотреть карту]',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.Map
                }
              }
            ]
          }
        ]
      },
      [ScenesIds.Map]: {
        baseSceneType: 'interactive',
        image: ScenesImages[ScenesIds.Map],
        additional: {
          interactive: {
            type: 'map',
            engine: () => new MapEngine(mapBaseData, emitter),
            baseData: mapBaseDynamicData
          }
        },
        hooks: {
          before: (emitter: TSceneEmmitter) => {
            const mapState = emitter.getState<TMapStore>(ScenesIds.Map)
            if (mapState && !mapState.eventCells.size) {
              emitter.setAction({
                type: EActionType.GoToScene,
                nextId: ScenesIds.Hero
              })
            }
          }
        },
        textTrees: [
          {
            id: ETextTreeIds.Map,
            mainText: 'Вы смотрите на карту'
          },
          {
            id: ETextTreeIds.StrangeMan,
            mainText: 'Этот чел какой-то странный'
          },
          {
            id: ETextTreeIds.MonsterToFight,
            mainText: 'Когда вы подходите ближе, то на ваших глазах мужик превратился в монстра',
            companion: {
              name: 'Монстр наебальщик',
              speech: 'Ну что! Попался в ловушку!',
              answers: [
                {
                  text: '[Драка неизбежна]',
                  action: {
                    type: EActionType.GoToScene,
                    nextId: ScenesIds.Monster,
                    afterReturning: {
                      success: returnStrategies.removeEvent,
                      fail: null
                    }
                  }
                },
                {
                  text: '[Убежать]',
                  action: {
                    type: EActionType.CloseDialog
                  }
                }
              ]
            }
          }
        ] as TextTree<TMapTree>[]
      },
      [ScenesIds.Monster]: {
        image: ScenesImages[ScenesIds.Monster],
        textBoxAbsolute: true,
        additional: {
          interactive: {
            type: 'fight',
            engine: () => new FightEngine<TFightStats>(fightBaseData, emitter),
            baseData: {
              fightResults: {
                success: {
                  type: EActionType.GoBackToPrevScene,
                  withSuccess: true
                },
                fail: { type: EActionType.GoToScene, nextId: ScenesIds.Rip }
              },
              enemies: [
                {
                  chars: enemies.monstr1,
                  effects: { tripper: charsSchema.effects.tripper },
                  weapons: [playerInventory[0]]
                }
              ]
            }
          }
        },
        textTrees: [
          {
            id: 'introFight',
            companion: {
              name: 'Монстр наебальщик',
              speech: 'Ну что! Пора подкрепится! Ам ам!',
              answers: [
                {
                  text: '[Начать драку]',
                  action: {
                    type: EActionType.GoToInteractive
                  }
                }
              ]
            }
          }
        ]
      }
    }
  }

  return gameConfig
}
