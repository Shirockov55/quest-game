<template>
  <div class="game-scene">
    <div class="game-scene__img-box">
      <div class="game-scene__img-overlay">
        <canvas
          v-show="data.additional?.interactive"
          class="game-scene__canvas"
          :id="CANVAS_ID"
          :width="canvasSize.w"
          :height="canvasSize.h"
        ></canvas>
        <img :src="imageUrl()" class="game-scene__img" ref="imageRef" />
      </div>
    </div>
    <slot name="overlay">
      <div class="game-scene__text" :class="{ 'game-scene__text_absolute': data.textBoxAbsolute }">
        <div class="message-box">
          <slot name="text-content">
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
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { TScene, TAction, TextTree } from '@/types'
import { EActionType } from '@/constants'
import { onMounted, onUnmounted, ref, computed, reactive, useTemplateRef } from 'vue'
import { CANVAS_ID } from './constants'
import { getImageUrl } from '@/helpers'

interface SceneProps {
  gameId: string
  data: TScene
}

const { gameId, data } = defineProps<SceneProps>()
const emit = defineEmits<{ action: [action: TAction] }>()

const imageUrl = () => {
  return getImageUrl(gameId, data.image)
}

const imageRef = useTemplateRef<HTMLImageElement>('imageRef')
const canvasSize = reactive({ w: '100%', h: '100%' })

const emptyTree: TextTree = {
  id: 'empty',
  mainText: ''
}

const currTreeId = ref(data.textTrees[0]?.id || emptyTree.id)
const textTrees = computed(() => {
  return [emptyTree, ...data.textTrees]
})
const currTree = computed(() => {
  return textTrees.value.find((tree) => tree.id === currTreeId.value)!
})

let audio: HTMLAudioElement | undefined
let timeout: ReturnType<typeof setTimeout> | undefined
if (data.audio) {
  const audioURL = `/src/games/${gameId}/assets/audio/${data.audio}`
  audio = new Audio(audioURL)
  audio.addEventListener('canplay', () => {
    timeout = setTimeout(function () {
      audio?.play()
    }, 3000)
  })
}

const runInteractive = () => {
  const interactive = data?.additional?.interactive
  if (!interactive) {
    console.warn('Interactive not found')
    return
  }

  const engine = interactive.engine
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
    // TODO: Make after image load and delete timeout
    engine.render(canvas)
  }, 500)
}

onMounted(() => {
  if (data.baseSceneType === 'interactive') runInteractive()
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
    case EActionType.GoToInteractive:
      runInteractive()
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
@import './Scene.scss';
</style>
