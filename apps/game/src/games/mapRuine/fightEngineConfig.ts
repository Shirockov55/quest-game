import { randCub, type TFightEngineData } from '@/packages/engines/fight'

import { GAME_ID, ScenesIds } from './constants'
import type { TFightStats } from './types'

import type { FighterCharsCfg, TFightWeapon } from '@/packages/engines/fight'
import type { TWeaponInventory } from '@/types'

export const charsSchema = {
  main: {
    name: {
      kind: 'info',
      label: 'Имя'
    },
    attack: {
      kind: 'number',
      typeView: 'single',
      label: 'Атака'
    },
    defence: {
      kind: 'number',
      typeView: 'single',
      label: 'Защита'
    },
    resistance: {
      kind: 'number',
      typeView: 'single',
      label: 'Сопротивление'
    },
    health: {
      kind: 'number',
      typeView: 'range',
      label: 'Здоровье'
    },
    mana: {
      kind: 'number',
      typeView: 'range',
      label: 'Мана'
    }
  },
  effects: {
    fresh: {
      kind: 'effect',
      label: 'Отдохнувший',
      isPositive: true
    },
    tripper: {
      kind: 'effect',
      label: 'Подцепил трипер',
      isPositive: false
    }
  }
} satisfies FighterCharsCfg<TFightStats>

export const weapons: Record<string, TFightWeapon<TFightStats>> = {
  blow: {
    effect: (ownStats, enemyStats) => {
      const attackStat = ownStats.main.attack.currVal || 0
      const attackRes = attackStat + randCub()

      const defenceStat = enemyStats.main.defence.currVal || 0
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
  pistol: {
    effect: (ownStats, enemyStats) => {
      const attackStat = ownStats.main.attack.currVal || 0
      const attackRes = attackStat + (4 * randCub() + 4)

      const defenceStat = enemyStats.main.defence.currVal || 0
      const defenceRes = defenceStat * randCub()

      const attackDiff = Math.max(attackRes - defenceRes, 0)
      console.log(attackDiff)
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
  mental: {
    disabled: (statsPlayer) => {
      const manaStat = statsPlayer.main.mana.currVal || 0
      return manaStat < 5
    },
    effect: (_, statsEnemy) => {
      const attackRes = 6 + randCub()

      const defenceStat = statsEnemy.main.resistance.currVal || 0
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
  acid: {
    effect: () => {
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
}

export const playerChars: TFightStats = {
  name: 'Hero',
  attack: 500,
  defence: 3,
  resistance: 4,
  health: [25, 30],
  mana: [20, 25]
}

export const playerInventory: TWeaponInventory<TFightStats>[] = [
  {
    id: 'blow',
    type: 'weapon',
    label: 'Удар',
    props: weapons.blow
  },
  {
    id: 'pistol',
    type: 'weapon',
    label: 'Выстрел из пистолета',
    props: weapons.pistol
  },
  {
    id: 'mental',
    type: 'weapon',
    label: 'Ментальный удар',
    props: weapons.mental
  },
  {
    id: 'acid',
    type: 'weapon',
    label: 'Кислота',
    props: weapons.acid
  }
]

export const enemies: Record<string, TFightStats> = {
  monstr1: {
    name: 'Монстро',
    attack: 3,
    defence: 5,
    resistance: 2,
    health: [100, 100],
    mana: [0, 0]
  }
}

export const fightBaseData: TFightEngineData = {
  gameId: GAME_ID,
  sceneId: ScenesIds.Monster
}
