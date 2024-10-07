import { type TGameConfig, EActionType } from '@/types/gameConfig'

console.log('Test game ruine!')

const enum ScenesIds {
  Map = 'map'
}

const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.Map]: 'map.jpg'
}

const mapGrid = 8
const [baseXCoord, baseYCoord] = [8, 4]
let ctx: CanvasRenderingContext2D | undefined | null

const draw = (boxW: number, boxH: number) => {
  if (!ctx) return

  const cellW = Math.round(boxW / mapGrid)
  const cellH = Math.round(boxH / mapGrid)
  // console.log(boxW, boxH, cellW, cellH)

  const sections: Record<number, Record<number, Array<number>>> = {}

  for (let i = 0; i < mapGrid; i++) {
    for (let j = 0; j < mapGrid; j++) {
      const x1 = j * cellW
      const x2 = (j + 1) * cellW
      const y1 = i * cellH
      const y2 = (i + 1) * cellH
      const res = [x1, x2, y1, y2]

      if (!sections[j]) sections[j] = {}
      sections[j][i] = res

      if (j + 1 !== baseXCoord || i + 1 !== baseYCoord) {
        // TODO: Разобраться с закрашиванием сетки
        ctx.fillStyle = 'black'
        ctx.fillRect(x1, y1, x2, y2)
      } else {
        console.log(j, i, 'no')
      }
    }
  }
}

const interactEngine = {
  render(canvas: HTMLCanvasElement) {
    ctx = canvas.getContext('2d')
    if (!ctx) return

    const boxW = canvas.width
    const boxH = canvas.height
    draw(boxW, boxH)
  },
  resize(boxW: number, boxH: number) {
    draw(boxW, boxH)
  }
}

const gameConfig: TGameConfig = {
  name: 'mapRuine',
  baseScene: ScenesIds.Map,
  scenes: {
    [ScenesIds.Map]: {
      baseSceneType: 'interactive',
      additional: {
        interractive: interactEngine
      },
      image: ScenesImages[ScenesIds.Map],
      textTrees: [
        {
          id: 'Начало',
          mainText: 'Ты на заброшенной ж/д станции. Видишь какого-то странного сталкера.',
          actions: []
        }
      ]
    }
  }
}

export default gameConfig
