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
          <template #overlay><component :is="customOverlayComponent" /></template>
          <template #text-content><component :is="customTextComponent" /></template>
        </Scene>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAction, TGameConfig, TScene, TSceneEmmitter } from '@/types'
import { ref, computed } from 'vue'
import { Scene } from '@/components/Scene'

// TODO: Create dynamic imports
// import { GameConfig } from '@/games/game1'
import { useConfig } from '@/games/mapRuine'
import { EActionType } from '@/constants'
import type { ComponentPublicInstance } from 'vue'
import { shallowRef } from 'vue'

const sceneRef = ref<typeof Scene>()
const customTextComponent = shallowRef<ComponentPublicInstance | null>(null)
const customOverlayComponent = shallowRef<ComponentPublicInstance | null>(null)

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

const setState = () => {
  // TODO: realize store
}

const emitter: TSceneEmmitter = {
  setAction: actionHandler,
  getState,
  setState,
  setCustomTextComponent: (component: ComponentPublicInstance) => {
    customOverlayComponent.value = component
  }
}

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
.game-runner {
  height: 100%;
}
.game-canvas {
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
