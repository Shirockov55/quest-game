import type { TGameConfig, TSceneEmmitter } from '@/types'
import { EActionType } from '@/constants'
import type { TEventSectors } from './types'

console.log('Test game ruine!')
let emitter: TSceneEmmitter | undefined

const enum ScenesIds {
  Map = 'map'
}

const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.Map]: 'map.jpg'
}

const [rowCount, colCount] = [8, 8]
const [baseXCoord, baseYCoord] = [8, 8]
let [activeZoneX, activeZoneY] = [baseXCoord - 1, baseYCoord - 1]
let boxW = 0
let boxH = 0
const fogRange = 1

const eventSectors: TEventSectors = {
  7: {
    8: {
      type: 'text',
      text: 'Пахнет какашками!'
    }
  }
}

let ctx: CanvasRenderingContext2D | undefined | null
let sectors: Record<number, Record<number, Array<number>>> = {}
let reducedFogSectors: Record<number, Record<number, boolean>> = {}
let openedSectors: Record<number, Record<number, boolean>> = {
  [activeZoneX]: { [activeZoneY]: true }
}

const activePointFillColor = 'rgba(0, 0, 255, 0.4)'
const fullFogFillColor = 'black'
const closeFogFillColor = 'rgba(0, 0, 0, 0.8)'
const oldStepPointFillColor = 'transparent'

const interactiveEngine = {
  render(canvas: HTMLCanvasElement) {
    ctx = canvas.getContext('2d')
    if (!ctx) return

    boxW = canvas.width
    boxH = canvas.height
    drawCanvas(boxW, boxH)

    canvas.addEventListener('click', ({ offsetX, offsetY }) => {
      const partX = Math.round((offsetX / boxW) * 10000) / 10000
      const partY = Math.round((offsetY / boxH) * 10000) / 10000
      const rectX = Math.floor(partX * rowCount)
      const rectY = Math.floor(partY * colCount)
      showSector(rectX, rectY)
    })
  },
  resize(_boxW: number, _boxH: number) {
    boxW = _boxW
    boxH = _boxH
    drawCanvas(boxW, boxH)
  }
}

const drawCanvas = (boxW: number, boxH: number) => {
  if (!ctx) return

  sectors = {}
  let basePoint: [number, number, number, number] | null = null
  const [cellW, cellH] = getCellSizes()
  // console.log(boxW, boxH, cellW, cellH)

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < colCount; j++) {
      const x1 = j * cellW
      const x2 = (j + 1) * cellW
      const y1 = i * cellH
      const y2 = (i + 1) * cellH
      const res = [x1, x2, y1, y2]

      if (!sectors[j]) sectors[j] = {}
      sectors[j][i] = res

      if (j + 1 !== baseXCoord || i + 1 !== baseYCoord) {
        ctx.fillStyle = fullFogFillColor
        ctx.fillRect(x1, y1, cellW, cellH)
      } else {
        basePoint = [j, i, x1, y1]
      }
    }
  }

  if (basePoint) {
    const [xGrid, yGrid, x1, y1] = basePoint
    drawActivePoint(x1, y1)
    drawReducedFogAroundPoint(xGrid, yGrid)
  }
}

const showSector = (x: number, y: number) => {
  const alreadyActive = activeZoneX === x && activeZoneY === y
  const onRoad =
    (activeZoneX === x && (activeZoneY === y - 1 || activeZoneY === y + 1)) ||
    (activeZoneY === y && (activeZoneX === x - 1 || activeZoneX === x + 1))
  const onFog = reducedFogSectors[x]?.[y]

  if (!ctx || !sectors[x]?.[y] || alreadyActive || !onRoad || !onFog) return

  const [x1, , y1] = sectors[x][y]
  ctx.fillStyle = oldStepPointFillColor
  const [cellW, cellH] = getCellSizes()

  if (eventSectors[x + 1]?.[y + 1]) {
    const eSector = eventSectors[x + 1][y + 1]
    switch (eSector.type) {
      case 'text':
        emitter?.setText(eSector.text)
        break
    }
  }

  drawActivePoint(x1, y1)

  // Clear last point
  const [lastX1, , lastY1] = sectors[activeZoneX][activeZoneY]
  ctx.clearRect(lastX1, lastY1, cellW, cellH)

  if (!openedSectors[x]) openedSectors[x] = {}
  openedSectors[x][y] = true
  activeZoneX = x
  activeZoneY = y

  drawReducedFogAroundPoint(x, y)
}

const drawActivePoint = (x1: number, y1: number) => {
  if (!ctx) return
  const [cellW, cellH] = getCellSizes()
  ctx.fillStyle = activePointFillColor
  ctx.clearRect(x1, y1, cellW, cellH)
  ctx.fillRect(x1, y1, cellW, cellH)
}

const getCellSizes = () => {
  const cellW = Math.ceil(boxW / colCount)
  const cellH = Math.ceil(boxH / rowCount)
  return [cellW, cellH]
}

const drawReducedFogAroundPoint = (x: number, y: number) => {
  for (let i = -fogRange; i <= fogRange; i++) {
    for (let j = -fogRange; j <= fogRange; j++) {
      if (j === 0 && i == 0) continue
      drawReducedFog(x + j, y + i)
    }
  }
}

const drawReducedFog = (x: number, y: number) => {
  if (!ctx || !sectors[x]?.[y] || !!openedSectors[x]?.[y] || !!reducedFogSectors[x]?.[y]) return

  const [x1, , y1] = sectors[x][y]
  ctx.fillStyle = closeFogFillColor
  const cellW = Math.ceil(boxW / colCount)
  const cellH = Math.ceil(boxH / rowCount)
  ctx.clearRect(x1, y1, cellW, cellH)
  ctx.fillRect(x1, y1, cellW, cellH)

  if (!reducedFogSectors[x]) reducedFogSectors[x] = {}
  reducedFogSectors[x][y] = true
}

const gameConfig: TGameConfig = {
  name: 'mapRuine',
  baseScene: ScenesIds.Map,
  scenes: {
    [ScenesIds.Map]: {
      baseSceneType: 'interactive',
      additional: {
        interractive: interactiveEngine
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

const useGameConfig = (_emitter: TSceneEmmitter) => {
  emitter = _emitter
  return gameConfig
}

export default useGameConfig
