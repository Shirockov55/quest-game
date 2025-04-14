<template>
  <div class="fight-template">
    <div class="fight-template__left-col">
      <FighterCard
        class="fight-frame"
        :class="{ shake: isShaking['player'] }"
        :avatar="getImageUrl(gameId, 'hero.jpg')"
        :stats="allStats['player']"
      />
      <div v-if="isPlayerStep" class="fight-template__actions fight-frame fight-actions-list">
        <div
          v-for="(weapon, i) in props.weapons"
          @click="clickOnAction(weapon, 'player', 'enemy')"
          :key="i"
          class="fight-actions-list__item"
          :aria-disabled="weapon.props.disabled?.(allStats['player'], allStats['enemy']) || false"
        >
          {{ weapon.label }}
        </div>
      </div>
    </div>
    <div class="fight-template__right-col">
      <FighterCard
        class="fight-frame"
        :class="{ shake: isShaking['enemy'] }"
        :avatar="getImageUrl(gameId, 'enemy1.jpg')"
        :stats="allStats['enemy']"
      />
      <div
        v-if="!isPlayerStep"
        class="fight-template__actions fight-template__actions_reversed fight-frame fight-actions-list"
      >
        <div
          v-for="(action, i) in props.enemyWeapons"
          :key="i"
          class="fight-actions-list__item"
          :aria-disabled="action.props.disabled?.(allStats['enemy'], allStats['player']) || false"
        >
          {{ action.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, nextTick } from 'vue'
import clone from 'lodash.clonedeep'
import { FighterCard } from '../FighterCard'

import { getImageUrl } from '@/helpers'
import { watch } from 'vue'
import { PROVIDE_EMITTER } from '@/constants'
import type { FightTemplateProps, FighterStat, FighterNumberStat } from '../../types'
import type { TWeaponInventory } from '@/types'

const props = defineProps<FightTemplateProps>()

const emitter = inject(PROVIDE_EMITTER)

const isPlayerStep = ref(true)
const isShaking = ref({
  player: false,
  enemy: false
})
const shakeElement = (target: 'player' | 'enemy') => {
  const { resolve, promise } = Promise.withResolvers()
  isShaking.value[target] = true

  // Убираем класс shake после завершения анимации
  setTimeout(() => {
    isShaking.value[target] = false
    resolve(null)
  }, 500) // Должно соответствовать времени анимации в CSS

  return promise
}

const allStats = ref({
  player: props.playerChars,
  enemy: props.enemyChars[0]
})

const getNextPlayer = () => {
  isPlayerStep.value = !isPlayerStep.value
}

watch(isPlayerStep, async (val) => {
  if (!val) {
    clickOnAction(props.enemyWeapons[0], 'enemy', 'player')
  }
})

const getNewStatsAfterEffects = (
  targetKey: 'player' | 'enemy',
  effectRes: Array<{
    id: string
    diff: number | boolean
  }>
) => {
  const newStatsEnemy = clone(allStats.value[targetKey])
  for (const effect of effectRes) {
    const findedStat = newStatsEnemy.main[effect.id]
    if (!findedStat || findedStat.kind === 'info') continue

    if (typeof effect.diff === 'number' && findedStat.kind === 'number') {
      const newVal = findedStat.currVal + effect.diff
      findedStat.currVal = Math.max(newVal, 0)
    }
    // else if (typeof effect.diff === 'boolean' && findedStat.kind === 'effect') {
    //   findedStat.isPositive = effect.diff
    // }
    console.log(`Эффект на ${targetKey}`, findedStat.label, effect.diff)
  }

  return newStatsEnemy
}

const checkEndFight = (newStats: Record<string, FighterStat>) => {
  const healthStat = newStats['health'] as FighterNumberStat | undefined
  if (!healthStat) return null

  return healthStat.currVal <= 0
}

const clickOnAction = async (
  action: TWeaponInventory,
  playerKey: 'player' | 'enemy',
  enemyKey: 'player' | 'enemy'
) => {
  const findedAction = (playerKey === 'player' ? props.weapons : props.enemyWeapons).find(
    (a) => a.id === action.id
  )
  if (!findedAction) return

  await shakeElement(enemyKey)

  const effectRes = findedAction.props.effect(props.playerChars, props.enemyChars[0])

  allStats.value[enemyKey] = getNewStatsAfterEffects(enemyKey, effectRes.enemy || [])
  if (effectRes.player) {
    allStats.value[playerKey] = getNewStatsAfterEffects(playerKey, effectRes.player)
  }

  await nextTick()

  if (checkEndFight(allStats.value[enemyKey].main)) {
    emitter?.setCustomOverlayComponent(null)
    emitter?.setCharacteristics(formatPlayerStatsToStore())
    emitter?.setAction(props.fightResults.success)
  } else if (checkEndFight(allStats.value[playerKey].main)) {
    emitter?.setCustomOverlayComponent(null)
    emitter?.setCharacteristics(formatPlayerStatsToStore())
    emitter?.setAction(props.fightResults.fail)
  } else {
    getNextPlayer()
  }
}

const formatPlayerStatsToStore = () => {
  const obj = Object.fromEntries(
    Object.entries(allStats.value['player'].main).map(([id, stat]) => {
      let val: unknown | undefined
      switch (stat.kind) {
        case 'number':
          val = stat.currVal
          break
        // case 'effect':
        case 'info':
          val = stat.value
          break
      }

      return [id, val]
    })
  )
  return obj
}
</script>

<style lang="scss">
@import './FightTemplate.scss';
</style>
