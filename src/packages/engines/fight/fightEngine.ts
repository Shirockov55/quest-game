import { InteractiveSceneBaseEngine, type TAction, type TSceneEmmitter } from '@/types'

import type { TFightEngineData } from './types'

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

interface TFightResults {
  success: TAction
  fail: TAction
}

const fightResults = {}

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

  start() {
    // debugger
  }

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

class FightEngine extends InteractiveSceneBaseEngine<TFightEngineData> {
  ctx!: CanvasRenderingContext2D
  boxW = 0
  boxH = 0

  constructor(data: TFightEngineData, emitter: TSceneEmmitter) {
    super(data, emitter)
  }

  render(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    this.ctx = ctx

    this.boxW = canvas.width
    this.boxH = canvas.height

    // stats
    // timer for tempMode
    this.emitter.setCustomTextComponent(FightTemplate)

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
