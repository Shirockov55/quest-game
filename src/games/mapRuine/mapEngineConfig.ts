import {
  type TMapEngineData,
  type TEventCells,
  type TTextTypeSectorEvent,
  type TMapStore,
  getKeyFromCoords
} from '@/packages/engines/map'
import { EActionType } from '@/constants'

import { ETextTreeIds, GAME_ID, ScenesIds } from './constants'

export const mapBaseData: TMapEngineData = {
  gameId: GAME_ID,
  sceneId: ScenesIds.Map,
  grid: { x: 5, y: 5 },
  startCoord: { x: 5, y: 3 },
  fogConfig: {
    fogExists: true,
    reducedFogExists: true
  }
}

const getRandomEnemies = (data: TMapEngineData, count = 10) => {
  const eventMapCells: TEventCells = new Map()
  const offset = 1
  while (count) {
    const randX = Math.floor(Math.random() * data.grid.x)
    const randY = Math.floor(Math.random() * data.grid.y)
    const key = getKeyFromCoords(randX, randY)

    if (eventMapCells.has(key)) continue

    let foundNeighbour = false
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const offsetKey = getKeyFromCoords(randX + i, randY + j)
        if (eventMapCells.has(offsetKey)) {
          foundNeighbour = true
          continue
        }
      }
    }
    if (foundNeighbour) continue

    const group = `monster_${Math.round(Math.random() * 1000)}`

    eventMapCells.set(key, {
      type: 'event',
      imageOnFog: 'enemy1-fog.jpg',
      image: 'enemy1.jpg',
      lockInteractive: true,
      group,
      action: {
        type: EActionType.GoToDialogTree,
        nextId: ETextTreeIds.MonsterToFight
      }
    })
    count--
  }
  return eventMapCells
}

export const mapBaseDynamicData: TMapStore = {
  eventCells: (() => {
    const strangeMess: TTextTypeSectorEvent = {
      type: 'text',
      // group,
      action: {
        type: EActionType.GoToDialogTree,
        nextId: ETextTreeIds.StrangeMan
      }
    }

    const randEnemies = getRandomEnemies(mapBaseData, 3)

    const eventMapCells: TEventCells = new Map()

    const res = new Map([...eventMapCells, ...randEnemies])
    return res
  })()
}
