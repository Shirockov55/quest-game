import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCharacterStore = defineStore('character', () => {
  const collection = ref<Record<string, unknown>>({})

  const setData = (key: string, val: unknown) => {
    collection.value[key] = val
  }

  const getData = (key: string): unknown | null => {
    return collection.value[key] || null
  }

  const getFullData = () => {
    return collection.value
  }

  const setBatchData = (data: Record<string, unknown>) => {
    for (const key in data) {
      collection.value[key] = data[key]
    }
  }

  return { setData, getData, getFullData, setBatchData }
})
