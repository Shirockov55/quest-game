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
import type { TAction, TGameConfig, TGoToSceneAction, TScene } from '@/types/gameConfig'
import { EActionType } from '@/types/gameConfig'
import { ref, computed } from 'vue'
import { Scene } from '@/components/Scene'

// TODO: Решить с динамическими импортами
// import { Games } from '@/games'
import { GameConfig } from '@/games/mapRuine'

const config: TGameConfig = GameConfig
const gameId = config.name
const scenes = config.scenes

const currId = ref(config.baseScene)
const currScene = ref<TScene>(scenes[currId.value])

const btnClick = (action: TAction) => {
  switch (action.type) {
    case EActionType.GoToScene:
      TGoToSceneAction(action)
      break
  }
}

const TGoToSceneAction = ({ nextId }: TGoToSceneAction) => {
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
