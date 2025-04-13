import type { TSceneActionContext, TSceneEmmitter } from '@/types'
import type { TMapStore } from './types'

export const returnStrategies = {
  removeEvent: (emitter: TSceneEmmitter, { prevSceneId }: TSceneActionContext) => {
    if (!prevSceneId) return
    const mapState = emitter.getState<TMapStore>(prevSceneId)
    if (!mapState || !mapState.lastX || !mapState.lastY) return

    const eventList = [...mapState.eventCells.entries()]
    const lastKey = getKeyFromCoords(mapState.lastX, mapState.lastY)
    const foundEvent = eventList.find(([key]) => key === lastKey)

    if (!foundEvent) return
    const [fKey, fVal] = foundEvent

    mapState.eventCells.delete(fKey)

    if (fVal.group) {
      const foundArr = eventList.filter(([, val]) => val.group === fVal.group)
      for (const [key] of foundArr) {
        mapState.eventCells.delete(key)
      }
    }

    emitter.setState<TMapStore>(prevSceneId, mapState)
  }
}

export const getKeyFromCoords = (x: number, y: number) => `${x}:${y}` as const
