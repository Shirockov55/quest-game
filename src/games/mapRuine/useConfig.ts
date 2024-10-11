import { EActionType } from '@/constants'
import type { BaseTree, TGameConfig, TInteractiveEngine, TScene, TextTree } from '@/types'
import type { TTextTypeSectorEvent } from './types'
import { MapEngine, type TEventSectors, type TMapTree } from '@/packages/engines/map'

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

// const engine = new MapEngine(baseData, emitter)

export function useConfig(interactiveEngine: TInteractiveEngine) {
  const gameConfig: TGameConfig = {
    name: 'mapRuine',
    baseScene: ScenesIds.Map,
    scenes: {
      [ScenesIds.Map]: {
        baseSceneType: 'interactive',
        image: ScenesImages[ScenesIds.Map],
        additional: {
          interractive: {
            type: 'map',
            engine: interactiveEngine,
            baseData: {
              sceneId: ScenesIds.Map,
              grid: [8, 8],
              startCoord: [8, 8],
              eventCells: (() => {
                const strangeMess: TTextTypeSectorEvent = {
                  type: 'text',
                  action: {
                    type: EActionType.GoToDialogTree,
                    nextId: ETextTreeIds.StrangeMan
                  }
                }

                const eventMapCells: TEventSectors = {
                  5: {
                    7: {
                      type: 'event',
                      imageOnFog: 'enemy1-fog.jpg',
                      image: 'enemy1.jpg',
                      action: {
                        type: EActionType.GoToDialogTree,
                        nextId: ETextTreeIds.MonsterToFight
                      }
                    },
                    8: strangeMess
                  },
                  6: {
                    7: strangeMess
                  }
                }

                return eventMapCells
              })()
            }
          }
        },
        textTrees: [
          {
            id: ETextTreeIds.Entry,
            mainText: 'Это карта',
            actions: [],
            once: true
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
                    nextId: ScenesIds.Monster
                  }
                }
              ]
            }
          }
        ] as TextTree<TMapTree>[]
      },
      [ScenesIds.Monster]: {
        image: ScenesImages[ScenesIds.Monster],
        textTrees: [
          {
            id: 'introFight',
            companion: {
              name: 'Монстр наебальщик',
              speech: 'Ну что! Пора подкрепится! Ам ам!',
              answers: []
            }
          }
        ]
      }
    }
  }

  return gameConfig
}
