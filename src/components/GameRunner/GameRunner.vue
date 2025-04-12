<template>
  <div class="game-runner">
    <div class="game-canvas">
      <Transition name="fade" mode="out-in" appear>
        <Scene
          @action="actionHandler"
          :key="currId"
          :gameId="gameId"
          :data="getScene()"
          ref="sceneRef"
        >
          <template #overlay
            ><component
              v-if="customOverlayComponent"
              :is="customOverlayComponent.component"
              v-bind="customOverlayComponent.props"
          /></template>
          <template v-if="customTextComponent" #text-content
            ><component :is="customTextComponent"
          /></template>
        </Scene>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAction, TGameConfig, TScene, TSceneEmmitter } from '@/types'
import { ref, provide } from 'vue'
import { Scene } from '@/components/Scene'

// TODO: Create dynamic imports
// import { GameConfig } from '@/games/game1'
import { useConfig } from '@/games/mapRuine'
import { EActionType, PROVIDE_CONFIG, PROVIDE_EMITTER } from '@/constants'
import { shallowRef, useTemplateRef } from 'vue'
import { useSceneStore } from '@/stores/scene'
import { useCharacterStore } from '@/stores/character'

const sceneRef = useTemplateRef<InstanceType<typeof Scene>>('sceneRef')
const customTextComponent = shallowRef<InstanceType<any> | null>(null)
const customOverlayComponent = shallowRef<{
  component: InstanceType<any> | null
  props?: Record<string, unknown> | null
} | null>(null)

const lockInteractive = ref(false)

const getContext = () => {
  return {
    currentSceneId: currId.value,
    lastSceneId: lastId.value,
    lockInteractive: lockInteractive.value
  }
}

const actionHandler = (action: TAction) => {
  const { lastSceneId } = getContext()
  action.callbacks?.before?.(emitter, { lastSceneId })

  switch (action.type) {
    case EActionType.GoToScene:
      lockInteractive.value = false
      goToScene(action.nextId)
      break
    case EActionType.GoToDialogTree:
      sceneRef.value?.goToDialogTree(action.nextId)
      break
    case EActionType.CloseDialog:
      lockInteractive.value = false
      sceneRef.value?.goToDialogTree(null)
      break
  }

  action.callbacks?.after?.(emitter, { lastSceneId })
}

const { setData, getData } = useSceneStore()
const { setBatchData: setBatchChars, getFullData: getAllChars } = useCharacterStore()

const setCharacteristics = (state: Record<string, unknown>) => {
  setBatchChars(state)
}

const emitter: TSceneEmmitter = {
  setAction: actionHandler,
  lockInteractive: (val: boolean) => {
    lockInteractive.value = val
  },
  getContext,
  getState: getData,
  setState: setData,
  getCharacteristics: getAllChars,
  setCharacteristics,
  setCustomOverlayComponent: (
    component: InstanceType<any> | null,
    props?: Record<string, unknown> | null
  ) => {
    customOverlayComponent.value = {
      component,
      props
    }
  },
  setCustomTextComponent: (component: InstanceType<any> | null) => {
    customTextComponent.value = component
  }
}
provide(PROVIDE_EMITTER, emitter)

const config: TGameConfig<any> = typeof useConfig === 'function' ? useConfig(emitter) : useConfig
const gameId = config.name
const scenes = config.scenes

if (config.playerChars) {
  setBatchChars(config.playerChars)
}

const currId = ref(config.baseScene)
const lastId = ref<string | null>(null)
const currScene = ref<TScene>(scenes[currId.value])

provide(PROVIDE_CONFIG, config)

const getScene = () => {
  // FIXME: invalid type to data prop
  return currScene.value as TScene
}

const goToScene = (nextId: string) => {
  const newScene = scenes[nextId]
  if (!newScene) return

  lastId.value = currId.value
  currId.value = nextId
  currScene.value = newScene
}
</script>
<style lang="scss">
@import './GameRunner.scss';
</style>
