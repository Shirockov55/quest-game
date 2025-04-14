import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSceneStore = defineStore('scene', () => {
  const collection = ref<Record<string, unknown>>({})

  const setData = (sceneId: string, data: unknown) => {
    collection.value[sceneId] = data
  }

  const getData = <T = unknown>(sceneId: string): T | null => {
    return (collection.value[sceneId] as T) || null
  }

  const clearData = (sceneId: string) => {
    delete collection.value[sceneId]
  }

  return { setData, getData, clearData }
})
