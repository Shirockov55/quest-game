import { EActionType } from '@/constants'
import type { TGameConfig, TSceneEmmitter, TextTree } from '@/types'
import { MapEngine, type TMapTree } from '@/packages/engines/map'
import { ETextTreeIds, GAME_ID, ScenesIds, ScenesImages } from './constants'
import { mapBaseData } from './mapEngineConfig'

export function useConfig(emitter: TSceneEmmitter) {
  const mapEngine = new MapEngine(mapBaseData, emitter)

  const gameConfig: TGameConfig = {
    name: GAME_ID,
    baseScene: ScenesIds.Map,
    scenes: {
      [ScenesIds.Map]: {
        baseSceneType: 'interactive',
        image: ScenesImages[ScenesIds.Map],
        additional: {
          interractive: {
            type: 'map',
            engine: mapEngine
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
