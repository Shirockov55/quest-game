import type { TMapEngineData, TEventCells, TTextTypeSectorEvent } from '@/packages/engines/map'
import { EActionType } from '@/constants'

import { ETextTreeIds, GAME_ID, ScenesIds } from './constants'

export const mapBaseData: TMapEngineData = {
  gameId: GAME_ID,
  sceneId: ScenesIds.Map,
  grid: { x: 8, y: 8 },
  startCoord: { x: 8, y: 8 },
  eventCells: (() => {
    const strangeMess: TTextTypeSectorEvent = {
      type: 'text',
      action: {
        type: EActionType.GoToDialogTree,
        nextId: ETextTreeIds.StrangeMan
      }
    }

    const eventMapCells: TEventCells = new Map()
    eventMapCells
      .set('5:7', {
        type: 'event',
        imageOnFog: 'enemy1-fog.jpg',
        image: 'enemy1.jpg',
        action: {
          type: EActionType.GoToDialogTree,
          nextId: ETextTreeIds.MonsterToFight
        }
      })
      .set('5:8', strangeMess)
      .set('6:7', strangeMess)

    return eventMapCells
  })()
}
