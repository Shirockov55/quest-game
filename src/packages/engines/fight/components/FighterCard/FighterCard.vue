<template>
  <div class="fighter-card">
    <div class="fighter-card__avatar-box">
      <img :src="avatar" class="fighter-card__avatar" />
    </div>
    <div class="fighter-card__stats-box fighter-stats">
      <div class="fighter-stats__item" v-for="stat in stats">
        <p class="fighter-stats__row" :class="`fighter-stats__row_${stat.kind}`">
          <template v-if="stat.kind === 'info'">
            <span class="fighter-stats__label">{{ stat.label }}:</span>
            <span class="fighter-stats__value">{{ stat.value }}</span>
          </template>
          <template v-else-if="stat.kind === 'number'">
            <span class="fighter-stats__label">{{ stat.label }}:</span>
            <span
              class="fighter-stats__value"
              :class="
                stat.currVal !== stat.baseVal &&
                `fighter-stats__value_${stat.currVal > stat.baseVal ? 'good' : 'bad'}`
              "
              >{{ stat.currVal }}</span
            >/<span class="fighter-stats__value">{{ stat.baseVal }}</span>
          </template>
          <template v-else-if="stat.kind === 'effect'">
            {{ stat.isPositive ? '+' : '-' }}
            <span
              class="fighter-stats__value"
              :class="`fighter-stats__value_${stat.isPositive ? 'good' : 'bad'}`"
              >{{ stat.value }}</span
            >
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FighterStat } from './types'

interface FighterCardProps {
  avatar: string
  stats: FighterStat[]
}

const { avatar, stats } = defineProps<FighterCardProps>()
</script>

<style lang="scss">
.fighter-card {
  background: var(--color-background);
  &__avatar-box {
    height: 200px;
    width: calc(100% + 24px);
    margin: -12px -12px 0;
    border-bottom: 1px solid #fff;
  }
  &__avatar {
    object-fit: cover;
    object-position: 50% 0%;
    width: 100%;
    height: 100%;
    border-radius: 8px 8px 0 0;
    user-select: none;
  }
  &__stats-box {
    padding-top: 12px;
  }
}

.fighter-stats {
  &__item {
  }
  &__row {
    color: #fff;
    font-size: 16px;
  }
  &__label {
  }
  &__value {
    &_good {
      color: greenyellow;
    }
    &_bad {
      color: red;
    }
  }
}
</style>
