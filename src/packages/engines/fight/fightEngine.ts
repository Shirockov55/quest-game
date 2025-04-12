import { InteractiveSceneBaseEngine, type TGameConfig, type TSceneEmmitter } from '@/types'

import type {
  FighterChars,
  FighterNumberStat,
  FighterStringStat,
  FightTemplateProps,
  TFightEngineConfig,
  TFightEngineData
} from './types'

const nextPlayer = (lastPlayerId: string) => {
  //
}

import { FightTemplate } from './components/FightTemplate'

interface TСharacterCharacteristics {
  attack: number
  defence: number
  health: number
}

interface TСharacter {
  name: string
  сharacteristics: TСharacterCharacteristics
  isHuman?: boolean
}

const hero: TСharacter = {
  name: 'Hero 1',
  isHuman: true,
  сharacteristics: {
    attack: 5,
    defence: 3,
    health: 30
  }
}

const monster: TСharacter = {
  name: 'Monstro',
  сharacteristics: {
    attack: 3,
    defence: 5,
    health: 10
  }
}

const characters = [hero, monster]

class PlayingArea {
  players: TСharacter[]
  onEndFn: ((isWin: boolean) => void) | null = null

  constructor(players: TСharacter[]) {
    this.players = players
  }

  start() {}

  end(isWin: boolean) {
    // redirect win or fail
    this.onEndFn?.(isWin)
  }

  onEnd(callback: (isWin: boolean) => void) {
    this.onEndFn = callback
  }

  addPlayer(player: TСharacter) {
    this.players.push(player)
  }
}

const round = (player: TСharacter) => {
  if (player.isHuman) {
    //
  } else {
    //
  }
}

class FightEngine<
  T = Record<string, unknown>
> extends InteractiveSceneBaseEngine<TFightEngineData> {
  ctx!: CanvasRenderingContext2D
  boxW = 0
  boxH = 0

  constructor(data: TFightEngineData, emitter: TSceneEmmitter) {
    super(data, emitter)
  }

  render(canvas: HTMLCanvasElement, props: TFightEngineConfig['baseData'], config: TGameConfig) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    this.ctx = ctx

    this.boxW = canvas.width
    this.boxH = canvas.height

    const schema = config?.charsSchema
    if (!schema) return
    const playerStats = this.emitter.getCharacteristics()
    const playerChars: FighterChars = {
      main: {},
      effects: schema.effects
    }
    const enemyChars: FighterChars[] = []

    for (const key in playerStats) {
      const item = schema.main[key]
      const value = playerStats[key]
      if (item.kind === 'info' && typeof value === 'string') {
        const obj: FighterStringStat = {
          ...item,
          value
        }
        playerChars.main[key] = obj
      } else if (item.kind === 'number') {
        const obj: FighterNumberStat = {
          ...item,
          ...(item.typeView === 'range' && Array.isArray(value)
            ? {
                baseVal: value[0],
                currVal: value[1]
              }
            : {
                baseVal: value,
                currVal: value
              })
        }
        playerChars.main[key] = obj
      }
    }

    for (const enemy of props.enemies) {
      const enemyChar: FighterChars = {
        main: {},
        effects: enemy.effects
      }

      for (const key in enemy.chars) {
        const item = schema.main[key]
        const value = enemy.chars[key]
        if (item.kind === 'info' && typeof value === 'string') {
          const obj: FighterStringStat = {
            ...item,
            value
          }
          enemyChar.main[key] = obj
        } else if (item.kind === 'number') {
          const obj: FighterNumberStat = {
            ...item,
            ...(item.typeView === 'range' && Array.isArray(value)
              ? {
                  baseVal: value[0],
                  currVal: value[1]
                }
              : {
                  baseVal: value,
                  currVal: value
                })
          }
          enemyChar.main[key] = obj
        }
      }

      enemyChars.push(enemyChar)
    }
    // TODO: сделать массив для нескольких бойцов
    const fProps = {
      gameId: config.name,
      playerChars,
      enemyChars,
      schema,
      weapons: config.inventory?.filter((f) => f.type === 'weapon') || [],
      enemyWeapons: props.enemies[0].weapons,
      fightResults: props.fightResults
    } satisfies FightTemplateProps
    // stats
    // timer for tempMode
    this.emitter.setCustomOverlayComponent(FightTemplate, fProps)

    const playingArea = new PlayingArea(characters)
    playingArea.start()
    playingArea.onEnd((isWin) => {
      // fightResults
    })
  }

  resize(_boxW: number, _boxH: number) {
    this.boxW = _boxW
    this.boxH = _boxH
    if (!this.ctx) return
  }

  // TODO: Realize
}

export { FightEngine }
