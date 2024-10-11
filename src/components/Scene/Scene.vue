<template>
  <div class="game-scene">
    <div class="game-scene__img-box">
      <div class="game-scene__img-overlay">
        <canvas
          v-show="data.additional?.interractive"
          class="game-scene__canvas"
          :id="CANVAS_ID"
          :width="canvasSize.w"
          :height="canvasSize.h"
        ></canvas>
        <img :src="imageUrl()" class="game-scene__img" ref="imageRef" />
      </div>
    </div>
    <div class="game-scene__text">
      <div class="message-box">
        <p v-if="currTree.mainText" class="message-box__message">
          {{
            typeof currTree.mainText === 'string'
              ? currTree.mainText
              : typeof currTree.mainText === 'function'
                ? currTree.mainText()
                : currTree.mainText.text
          }}
        </p>
        <div v-if="'actions' in currTree" class="message-box__action-btns">
          <div v-if="currTree.actions?.length" class="action-btns">
            <button
              v-for="btn in currTree.actions"
              @click="btnClick(btn.action)"
              class="action-btn"
              type="button"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
        <div v-else-if="'companion' in currTree" class="message-box__companion companion-card">
          <p class="companion-card__name">{{ currTree.companion.name }}</p>
          <p v-if="currTree.companion.speech" class="companion-card__speech">
            {{
              typeof currTree.companion.speech === 'string'
                ? currTree.companion.speech
                : typeof currTree.companion.speech === 'function'
                  ? currTree.companion.speech()
                  : currTree.companion.speech.text
            }}
          </p>
          <div v-if="currTree.companion.answers.length" class="action-btns">
            <button
              v-for="btn in currTree.companion.answers"
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
import type { TScene, TAction, TextTree } from '@/types'
import { EActionType } from '@/constants'
import { onMounted, onUnmounted, ref, computed, reactive } from 'vue'
import { CANVAS_ID } from './constants'

interface SceneProps {
  gameId: string
  data: TScene
}

const { gameId, data } = defineProps<SceneProps>()
const emit = defineEmits<{ action: [action: TAction] }>()

const imageUrl = () => {
  const baseUrl = `/src/games/${gameId}/assets/images/${data.image}`
  const url = new URL(baseUrl, import.meta.url).href
  return url
}

const imageRef = ref<HTMLImageElement>()
const canvasSize = reactive({ w: '100%', h: '100%' })

const emptyTree: TextTree = {
  id: 'empty',
  mainText: ''
}

const textTrees = computed(() => {
  return [emptyTree, ...data.textTrees]
})

const currTreeId = ref(data.textTrees[0]?.id || emptyTree.id)
const currTree = computed(() => {
  return data.textTrees.find((tree) => tree.id === currTreeId.value)!
})

let audio: HTMLAudioElement | undefined
let timeout: number | undefined
if (data.audio) {
  const audioURL = `/src/games/${gameId}/assets/audio/${data.audio}`
  audio = new Audio(audioURL)
  audio.addEventListener('canplay', () => {
    timeout = setTimeout(function () {
      audio?.play()
    }, 3000)
  })
}

onMounted(() => {
  if (data?.additional?.interractive) {
    const engine = data.additional.interractive.engine
    const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement
    if (!canvas) return

    updateCanvasSizeByImage()

    const observer = new ResizeObserver(() => {
      if (!imageRef.value) return

      const [imageW, imageH] = updateCanvasSizeByImage()
      engine.resize(imageW, imageH)
    })

    observer.observe(imageRef.value!)

    setTimeout(() => {
      // TODO: Сделать после загрузки изображения для правильных размеров
      engine.render(canvas)
    }, 500)
  }
})

onUnmounted(() => {
  clearTimeout(timeout)
  audio?.pause()
})

const updateCanvasSizeByImage = () => {
  const imageW = imageRef.value?.width!
  const imageH = imageRef.value?.height!
  canvasSize.w = `${imageW}px`
  canvasSize.h = `${imageH}px`
  return [imageW, imageH]
}

const btnClick = (action: TAction) => {
  switch (action.type) {
    case EActionType.GoToDialogTree:
      goToDialogTree(action.nextId)
      break
    default:
      emit('action', action)
  }
}

const goToDialogTree = (textTreeId: string) => {
  currTreeId.value = textTreeId
}

defineExpose({
  goToDialogTree
})
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
    display: flex;
    justify-content: center;
    height: 100%;
  }
  &__img {
    object-fit: contain;
    max-height: 100%;
    user-select: none;
  }
  &__text {
    border-top: 1px solid white;
    min-height: 300px;
    padding: 12px;
    flex-shrink: 0;
  }
  &__canvas {
    position: absolute;
    inset: 0;
    left: 50%;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    cursor: pointer;
  }
}

.message-box {
  margin: 0 auto;
  width: 100%;
  max-width: 980px;
  &__action-btns {
    margin-top: 12px;
  }
  &__companion {
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

.companion-card {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px;
  &__name {
    color: yellow;
    margin-bottom: 8px;
  }
  &__speech {
    margin-bottom: 12px;
  }
}
</style>
