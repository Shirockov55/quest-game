import type { TSceneEmmitter } from '@/types'
import { EActionType } from '@/constants'
import type { TBaseMapData, TEventSectors } from './types'

console.log('Test game ruine!')
let emitter: TSceneEmmitter | undefined

const [rowCount, colCount] = [8, 8]
const [baseXCoord, baseYCoord] = [8, 8]
let [activeZoneX, activeZoneY] = [baseXCoord - 1, baseYCoord - 1]
let boxW = 0
let boxH = 0
const fogRange = 1

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

let baseData: TBaseMapData | null = null

class MapEngine {
  baseData: TBaseMapData

  constructor(baseData: TBaseMapData) {
    this.baseData = baseData
  }

  render(canvas: HTMLCanvasElement, _baseData: TBaseMapData) {
    baseData = _baseData
    const storeData = emitter?.getState(baseData.sceneId)
    // TODO: replace base data
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
  }

  resize(_boxW: number, _boxH: number) {
    boxW = _boxW
    boxH = _boxH
    drawCanvas(boxW, boxH)
  }
}

const interactiveEngine = {
  render(canvas: HTMLCanvasElement, _baseData: TBaseMapData) {
    baseData = _baseData
    const storeData = emitter?.getState(baseData.sceneId)
    // TODO: replace base data
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

  const [x1, , y1, y2] = sectors[x][y]
  ctx.fillStyle = oldStepPointFillColor
  const [cellW, cellH] = getCellSizes()

  if (eventSectors[x + 1]?.[y + 1]) {
    const eSector = eventSectors[x + 1][y + 1]

    if (eSector.action.type === EActionType.GoToScene && eSector.action.withSaveState) {
      // TODO: Сохранить состояние сцены
      emitter?.setState(ScenesIds.Map, {})
    }

    emitter?.setAction(eSector.action)

    switch (eSector.type) {
      case 'text':
        //
        break
      case 'event':
        if (eSector.image) {
          loadImage(eSector.image, (img) => {
            drawVisibilityZone(x, y, x1, y1, cellW, cellH, img)
          })
          return
        }
        break
    }
  }

  drawVisibilityZone(x, y, x1, y1, cellW, cellH)
}

const drawVisibilityZone = (
  xGrid: number,
  yGrid: number,
  x1Coord: number,
  y1Coord: number,
  cellW: number,
  cellH: number,
  img?: HTMLImageElement
) => {
  if (!img) {
    drawActivePoint(x1Coord, y1Coord)
  } else {
    ctx?.drawImage(img, x1Coord, y1Coord, cellW, cellH)
  }

  // Clear last point
  const [lastX1, , lastY1] = sectors[activeZoneX][activeZoneY]
  const eventSector = eventSectors[activeZoneX + 1]?.[activeZoneY + 1]
  if (!eventSector || !('image' in eventSector)) {
    ctx?.clearRect(lastX1, lastY1, cellW, cellH)
  }

  if (!openedSectors[xGrid]) openedSectors[xGrid] = {}
  openedSectors[xGrid][yGrid] = true
  activeZoneX = xGrid
  activeZoneY = yGrid

  drawReducedFogAroundPoint(xGrid, yGrid)
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
  const eventSector = eventSectors[x + 1]?.[y + 1]

  if (eventSector && eventSector.type === 'event' && eventSector.imageOnFog) {
    const [cellW, cellH] = getCellSizes()
    loadImage(eventSector.imageOnFog, (img) => {
      ctx?.drawImage(img, x1, y1, cellW, cellH)
    })
  } else {
    ctx.fillStyle = closeFogFillColor
    const cellW = Math.ceil(boxW / colCount)
    const cellH = Math.ceil(boxH / rowCount)
    ctx.clearRect(x1, y1, cellW, cellH)
    ctx.fillRect(x1, y1, cellW, cellH)
  }

  if (!reducedFogSectors[x]) reducedFogSectors[x] = {}
  reducedFogSectors[x][y] = true
}

const loadImage = (imageName: string, callback: (img: HTMLImageElement) => void) => {
  const img = new Image()
  img.src = `/src/games/mapRuine/assets/images/${imageName}`
  img.onload = function () {
    callback(img)
  }
}

export { MapEngine }
