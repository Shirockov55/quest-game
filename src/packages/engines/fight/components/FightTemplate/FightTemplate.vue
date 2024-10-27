<template>
  <div class="fight-template">
    <div class="fight-template__left-col">
      <FighterCard
        class="fight-frame"
        :avatar="getImageUrl('mapRuine', 'hero.jpg')"
        :stats="statsPlayer"
      />
      <div class="fight-template__actions fight-frame fight-actions-list">
        <div
          @click="clickOnAction(action)"
          v-for="action in actions"
          class="fight-actions-list__item"
        >
          {{ action.label }}
        </div>
      </div>
    </div>
    <div class="fight-template__right-col">
      <FighterCard
        class="fight-frame"
        :class="{ shake: isShaking }"
        :avatar="getImageUrl('mapRuine', 'enemy1.jpg')"
        :stats="statsEnemy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  FighterCard,
  type FightAction,
  type FighterNumberStat,
  type FighterStat
} from '../FighterCard'

const isShaking = ref(false)

const shakeElement = () => {
  isShaking.value = true

  // Убираем класс shake после завершения анимации
  setTimeout(() => {
    isShaking.value = false
  }, 500) // Должно соответствовать времени анимации в CSS
}

const getImageUrl = (gameId: string, name: string) => {
  const baseUrl = `/src/games/${gameId}/assets/images/${name}`
  const url = new URL(baseUrl, import.meta.url).href
  return url
}

const randCub = () => {
  const res = Math.round(Math.random() * 6)
  console.log('rand cub with:', res)
  return res
}

const statsPlayer = ref<FighterStat[]>([
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
])
const statsEnemy = ref<FighterStat[]>([
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
    currVal: 3
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
])

const actions2: FightAction[] = []
const actions: FightAction[] = [
  {
    id: 'pistol',
    label: 'Выстрелить из пистолета',
    effect: (ownStats: FighterStat[], enemyStats: FighterStat[]) => {
      const attackStat =
        (ownStats.find((stat) => stat.id === 'attack') as FighterNumberStat)?.currVal || 0
      const attackRes = attackStat + randCub()

      const defenceStat =
        (enemyStats.find((stat) => stat.id === 'defence') as FighterNumberStat)?.currVal || 0
      const healthStat =
        (enemyStats.find((stat) => stat.id === 'health') as FighterNumberStat)?.currVal || 0
      const defenceRes = defenceStat + randCub()

      const attackDiff = Math.max(attackRes - defenceRes, 0)

      const health = healthStat - attackDiff

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
    effect: (statsPlayer: FighterStat[], statsEnemy: FighterStat[]) => {
      const attackRes = 6 + randCub()
      const manaStat =
        (statsPlayer.find((stat) => stat.id === 'mana') as FighterNumberStat)?.currVal || 0

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
  }
]

const clickOnAction = (action: FightAction) => {
  const findedAction = actions.find((a) => a.id === action.id)
  if (!findedAction) return

  shakeElement()

  const effectRes = findedAction.effect(statsPlayer.value, statsEnemy.value)
  const newStatsEnemy: FighterStat[] = JSON.parse(JSON.stringify(statsEnemy.value))
  for (const effect of effectRes.enemy) {
    const findedStat = newStatsEnemy.find((stat) => stat.id === effect.id)
    if (!findedStat) continue

    console.log('Эффект на противнике', findedStat.label, effect.diff)
    ;(findedStat as FighterNumberStat).currVal += effect.diff
  }
  statsEnemy.value = newStatsEnemy

  if (effectRes.player) {
    const newStatsPlayer: FighterStat[] = JSON.parse(JSON.stringify(statsPlayer.value))
    for (const effect of effectRes.player) {
      const findedStat = newStatsPlayer.find((stat) => stat.id === effect.id)
      if (!findedStat) continue

      console.log('Эффект на себе', findedStat.label, effect.diff)
      ;(findedStat as FighterNumberStat).currVal += effect.diff
    }
    statsPlayer.value = newStatsPlayer
  }
}
</script>

<style lang="scss">
.fight-template {
  position: absolute;
  z-index: 100;
  inset: 12px;
  &__left-col {
    position: absolute;
    left: 0;
    width: 300px;
  }
  &__right-col {
    position: absolute;
    right: 0;
    width: 300px;
  }
  &__actions {
    position: absolute;
    left: calc(100% + 12px);
    top: 0;
    color: #fff;
    background-color: black;
    width: 250px;
  }
}

.fight-frame {
  padding: 12px;
  border: 1px solid #fff;
  border-radius: 8px;
}

.fight-actions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__item {
    cursor: pointer;
    &:hover {
      color: yellowgreen;
    }
  }
}

@mixin shakeAnimation($size) {
  @keyframes shake {
    0% {
      transform: translate($size, 0);
    }
    25% {
      transform: translate(-$size, 0);
    }
    50% {
      transform: translate($size, 0);
    }
    75% {
      transform: translate(-$size, 0);
    }
    100% {
      transform: translate($size, 0);
    }
  }
}

@include shakeAnimation(10px);

.shake {
  animation: shake 0.3s;
}
</style>
