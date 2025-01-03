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
          <template #overlay><component :is="customOverlayComponent" :gameId="gameId" /></template>
          <template #text-content><component :is="customTextComponent" /></template>
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
import { EActionType, PROVIDE_EMITTER } from '@/constants'
import { shallowRef, useTemplateRef } from 'vue'

const sceneRef = useTemplateRef<InstanceType<typeof Scene>>('sceneRef')
const customTextComponent = shallowRef<InstanceType<any> | null>(null)
const customOverlayComponent = shallowRef<InstanceType<any> | null>(null)

const actionHandler = (action: TAction) => {
  switch (action.type) {
    case EActionType.GoToScene:
      goToScene(action.nextId)
      break
    case EActionType.GoToDialogTree:
      sceneRef.value?.goToDialogTree(action.nextId)
      break
  }
}

const getState = (sceneId: string) => {
  // TODO: realize store
  return {}
}

const setState = (sceneId: string, state: Record<string, unknown>) => {
  // TODO: realize store
}

const getCharacteristics = () => {
  // TODO: realize store
  return []
}

const setCharacteristics = (state: Record<string, unknown>[]) => {
  // TODO: realize store
}

const emitter: TSceneEmmitter = {
  setAction: actionHandler,
  getState,
  setState,
  getCharacteristics,
  setCharacteristics,
  setCustomOverlayComponent: (component: InstanceType<any> | null) => {
    customOverlayComponent.value = component
  },
  setCustomTextComponent: (component: InstanceType<any> | null) => {
    customTextComponent.value = component
  }
}
provide(PROVIDE_EMITTER, emitter)

const config: TGameConfig = typeof useConfig === 'function' ? useConfig(emitter) : useConfig
const gameId = config.name
const scenes = config.scenes

const currId = ref(config.baseScene)
const currScene = ref<TScene>(scenes[currId.value])

const getScene = () => {
  // FIXME: invalid type to data prop
  return currScene.value as TScene
}

const goToScene = (nextId: string) => {
  const newScene = scenes[nextId]
  if (!newScene) return

  currId.value = nextId
  currScene.value = newScene
}
</script>
<style lang="scss">
@import './GameRunner.scss';
</style>
