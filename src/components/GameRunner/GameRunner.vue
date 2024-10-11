<template>
  <div class="game-runner">
    <div class="game-canvas">
      <Transition name="fade" mode="out-in" appear>
        <Scene
          @action="actionHandler"
          :key="currId"
          :gameId="gameId"
          :data="currScene"
          ref="sceneRef"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TAction, TGameConfig, TScene, TSceneEmmitter } from '@/types'
import { ref } from 'vue'
import { Scene } from '@/components/Scene'

// TODO: Решить с динамическими импортами
// import { GameConfig } from '@/games/game1'
import { GameConfig } from '@/games/mapRuine'
import { EActionType } from '@/constants'

const sceneRef = ref<typeof Scene>()

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
  setState
}

const config: TGameConfig = typeof GameConfig === 'function' ? GameConfig(emitter) : GameConfig
const gameId = config.name
const scenes = config.scenes

const currId = ref(config.baseScene)
const currScene = ref<TScene>(scenes[currId.value])

const goToScene = (nextId: string) => {
  const newScene = scenes[nextId]
  if (!newScene) return

  currId.value = nextId
  currScene.value = structuredClone(newScene)
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
