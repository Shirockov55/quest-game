<template>
  <div class="game-scene">
    <div class="game-scene__img-box">
      <div class="game-scene__img-overlay">
        <img :src="imageUrl()" class="game-scene__img" />
      </div>
    </div>
    <div class="game-scene__text">
      <div class="message-box">
        <p class="message-box__message">{{ data.mainText.text }}</p>
        <div v-if="data.buttons?.length" class="message-box__action-btns">
          <div class="action-btns">
            <button
              v-for="btn in data.buttons"
              @click="btnClick(btn.action)"
              class="action-btn"
              type="button"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Scene, Action } from '@/types/gameConfig'
import { toRef, onMounted, onUnmounted } from 'vue'

interface SceneProps {
  gameId: string
  data: Scene
}

const { gameId, data } = defineProps<SceneProps>()
const emit = defineEmits<{ btnClick: [action: Action] }>()

const imageUrl = () => {
  const baseUrl = `/src/games/${gameId}/assets/images/${data.image}`
  const url = new URL(baseUrl, import.meta.url).href
  //   debugger
  return url
}

const btnClick = (action: Action) => {
  emit('btnClick', action)
}
</script>
<style lang="scss">
.game-scene {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__img-box {
    position: relative;
    flex-grow: 1;
    text-align: center;
  }
  &__img-overlay {
    position: absolute;
    inset: 0;
    height: 100%;
    text-align: center;
  }
  &__img {
    object-fit: contain;
    max-height: 100%;
  }
  &__text {
    border-top: 1px solid white;
    min-height: 300px;
    padding: 12px;
    flex-shrink: 0;
  }
}

.message-box {
  margin: 0 auto;
  width: 100%;
  max-width: 980px;
  &__action-btns {
    margin-top: 12px;
  }
}
.action-btns {
  display: flex;
  gap: 12px;
}
.action-btn {
  padding: 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
</style>
