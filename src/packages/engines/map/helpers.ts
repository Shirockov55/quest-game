import type { TSceneActionContext, TSceneEmmitter } from '@/types'
import type { TMapStore } from './types'
import { EActionType } from '@/constants'

export const returnStrategies = {
  removeEvent: (treeId: string, emitter: TSceneEmmitter, { prevSceneId }: TSceneActionContext) => {
    if (!prevSceneId) return
    const mapState = emitter.getState<TMapStore>(prevSceneId)
    if (!mapState) return

    const eventList = [...mapState.eventCells.entries()]
    const foundEvent = eventList.find(([, val]) => {
      return val.action.type === EActionType.GoToDialogTree && treeId === val.action.nextId
    })

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
