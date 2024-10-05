<template>
  <div class="game-runner">
    <div class="game-canvas">
      <Transition name="fade" mode="out-in" appear>
        <Scene @btnClick="btnClick" :key="currId" :gameId="gameId" :data="currScene" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Action, GameConfig, RouteAction, Scene as IScene } from '@/types/gameConfig'
import { ActionType } from '@/types/gameConfig'
import { ref, computed } from 'vue'
import { Scene } from '@/components/Scene'

// TODO: Решить с динамическими импортами
// import { Games } from '@/games'
import Config from '@/games/game1'
const gameId = 'game1'

const config: GameConfig = Config.default
const scenes = config.scenes

const currId = ref(config.baseScene)
const currScene = ref<IScene>(scenes[currId.value])

const btnClick = (action: Action) => {
  switch (action.type) {
    case ActionType.GoTo:
      goToAction(action)
      break
  }
}

const goToAction = ({ nextId }: RouteAction) => {
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
