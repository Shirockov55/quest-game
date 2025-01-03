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
          @click="clickOnAction(action, 'player', 'enemy')"
          v-for="action in playerActions"
          class="fight-actions-list__item"
          :aria-disabled="action.disabled?.(allStats['player'], allStats['enemy']) || false"
        >
          {{ action.label }}
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
          @click="clickOnAction(action, 'enemy', 'player')"
          v-for="action in enemyActions"
          class="fight-actions-list__item"
          :aria-disabled="action.disabled?.(allStats['enemy'], allStats['player']) || false"
        >
          {{ action.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, nextTick } from 'vue'
import {
  FighterCard,
  type FightAction,
  type FighterNumberStat,
  type FighterStat
} from '../FighterCard'

import { getImageUrl } from '@/helpers'
import { watch } from 'vue'
import { EActionType, PROVIDE_EMITTER, PROVIDE_SCENES } from '@/constants'

defineProps<{ gameId: string }>()

const emitter = inject(PROVIDE_EMITTER)
const scenes = inject(PROVIDE_SCENES)

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

const randCub = () => {
  const res = Math.ceil(Math.random() * 6)
  console.log('rand cub with:', res)
  return res
}

const allStats = ref<Record<'player' | 'enemy', FighterStat[]>>({
  player: [
    {
      id: 'name',
      kind: 'info',
      label: 'Имя',
      value: 'Hero'
    },
    {
      id: 'attack',
      kind: 'number',
      typeView: 'single',
      label: 'Атака',
      baseVal: 5,
      currVal: 5
    },
    {
      id: 'defence',
      kind: 'number',
      typeView: 'single',
      label: 'Защита',
      baseVal: 3,
      currVal: 3
    },
    {
      id: 'health',
      kind: 'number',
      typeView: 'range',
      label: 'Здоровье',
      baseVal: 30,
      currVal: 28
    },
    {
      id: 'mana',
      kind: 'number',
      typeView: 'range',
      label: 'Мана',
      baseVal: 20,
      currVal: 25
    },
    {
      id: 'fresh',
      kind: 'effect',
      value: 'Отдохнувший',
      isPositive: true
    },
    {
      id: 'tripper',
      kind: 'effect',
      value: 'Подцепил трипер',
      isPositive: false
    }
  ],
  enemy: [
    {
      id: 'name',
      kind: 'info',
      label: 'Монстро',
      value: 'Hero'
    },
    {
      id: 'attack',
      kind: 'number',
      typeView: 'single',
      label: 'Атака',
      baseVal: 3,
      currVal: 30
      // currVal: 3
    },
    {
      id: 'defence',
      kind: 'number',
      typeView: 'single',
      label: 'Защита',
      baseVal: 5,
      currVal: 5
    },
    {
      id: 'health',
      kind: 'number',
      typeView: 'range',
      label: 'Здоровье',
      baseVal: 100,
      currVal: 100
    },
    {
      id: 'mana',
      kind: 'number',
      typeView: 'range',
      label: 'Мана',
      baseVal: 20,
      currVal: 0
    }
  ]
})

const playerActions: FightAction[] = [
  {
    id: 'pistol',
    label: 'Выстрелить из пистолета',
    effect: (ownStats: FighterStat[], enemyStats: FighterStat[]) => {
      const attackStat =
        (ownStats.find((stat) => stat.id === 'attack') as FighterNumberStat)?.currVal || 0
      const attackRes = attackStat + randCub()

      const defenceStat =
        (enemyStats.find((stat) => stat.id === 'defence') as FighterNumberStat)?.currVal || 0
      const defenceRes = defenceStat + randCub()

      const attackDiff = Math.max(attackRes - defenceRes, 0)

      return {
        enemy: [
          {
            id: 'health',
            diff: -attackDiff
          }
        ]
      }
    }
  },
  {
    id: 'mental',
    label: 'Ментальный удар',
    disabled: (statsPlayer: FighterStat[], statsEnemy: FighterStat[]) => {
      const manaStat =
        (statsPlayer.find((stat) => stat.id === 'mana') as FighterNumberStat)?.currVal || 0

      return manaStat < 5
    },
    effect: (statsPlayer: FighterStat[], statsEnemy: FighterStat[]) => {
      const attackRes = 6 + randCub()

      const defenceStat =
        (statsEnemy.find((stat) => stat.id === 'resistance') as FighterNumberStat)?.currVal || 0
      const defenceRes = defenceStat + randCub()

      const attackDiff = Math.max(attackRes - defenceRes, 0)

      return {
        player: [
          {
            id: 'mana',
            diff: -5
          }
        ],
        enemy: [
          {
            id: 'health',
            diff: -attackDiff
          }
        ]
      }
    }
  },
  {
    id: 'acid',
    label: 'Кислота',
    effect: (statsPlayer: FighterStat[], statsEnemy: FighterStat[]) => {
      return {
        enemy: [
          {
            id: 'defence',
            diff: -1
          }
        ]
      }
    }
  }
]

const enemyActions: FightAction[] = [
  {
    id: 'blow',
    label: 'Удар',
    effect: (ownStats: FighterStat[], enemyStats: FighterStat[]) => {
      const attackStat =
        (ownStats.find((stat) => stat.id === 'attack') as FighterNumberStat)?.currVal || 0
      const attackRes = attackStat + randCub()

      const defenceStat =
        (enemyStats.find((stat) => stat.id === 'defence') as FighterNumberStat)?.currVal || 0
      const defenceRes = defenceStat + randCub()

      const attackDiff = Math.max(attackRes - defenceRes, 0)

      return {
        enemy: [
          {
            id: 'health',
            diff: -attackDiff
          }
        ]
      }
    }
  }
]

const allActions = {
  player: playerActions,
  enemy: enemyActions
}

const getNextPlayer = () => {
  isPlayerStep.value = !isPlayerStep.value
}

watch(isPlayerStep, async (val) => {
  if (!val) {
    clickOnAction(allActions.enemy[0], 'enemy', 'player')
  }
})

const getNewStatsAfterEffects = (
  targetKey: 'player' | 'enemy',
  effectRes: Array<{
    id: string
    diff: number | boolean
  }>
) => {
  const newStatsEnemy: FighterStat[] = JSON.parse(JSON.stringify(allStats.value[targetKey]))

  for (const effect of effectRes) {
    const findedStat = newStatsEnemy.find((stat) => stat.id === effect.id)
    if (!findedStat || findedStat.kind === 'info') continue

    if (typeof effect.diff === 'number' && findedStat.kind === 'number') {
      const newVal = findedStat.currVal + effect.diff
      findedStat.currVal = Math.max(newVal, 0)
    } else if (typeof effect.diff === 'boolean' && findedStat.kind === 'effect') {
      findedStat.isPositive = effect.diff
    }
    console.log(`Эффект на ${targetKey}`, findedStat.label, effect.diff)
  }

  return newStatsEnemy
}

const checkEndFight = (newStats: FighterStat[]) => {
  const healthStat = newStats.find((stat) => stat.id === 'health' && stat.kind === 'number') as
    | FighterNumberStat
    | undefined
  if (!healthStat) return null

  return healthStat.currVal <= 0
}

const clickOnAction = async (
  action: FightAction,
  playerKey: 'player' | 'enemy',
  enemyKey: 'player' | 'enemy'
) => {
  const findedAction = allActions[playerKey].find((a) => a.id === action.id)
  if (!findedAction) return

  await shakeElement(enemyKey)

  const effectRes = findedAction.effect(allStats.value[playerKey], allStats.value[enemyKey])

  allStats.value[enemyKey] = getNewStatsAfterEffects(enemyKey, effectRes.enemy)

  if (effectRes.player) {
    allStats.value[playerKey] = getNewStatsAfterEffects(playerKey, effectRes.player)
  }

  await nextTick()

  if (checkEndFight(allStats.value[enemyKey])) {
    emitter?.setCustomOverlayComponent(null)
    emitter?.setCharacteristics(allStats.value[playerKey])
    emitter?.setAction({
      type: EActionType.GoToScene,
      nextId: 'rip'
    })
  } else if (checkEndFight(allStats.value[playerKey])) {
    emitter?.setCustomOverlayComponent(null)
    emitter?.setCharacteristics(allStats.value[playerKey])
    emitter?.setAction({
      type: EActionType.GoToScene,
      nextId: 'rip'
    })
  } else {
    getNextPlayer()
  }
}
</script>

<style lang="scss">
@import './FightTemplate.scss';
</style>
