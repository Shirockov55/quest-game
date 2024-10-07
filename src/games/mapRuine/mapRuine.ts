import { type TGameConfig, EActionType } from '@/types/gameConfig'

console.log('Test game ruine!')

const enum ScenesIds {
  Map = 'map'
}

const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.Map]: 'map.jpg'
}

const [rowCount, colCount] = [8, 8]
const [baseXCoord, baseYCoord] = [8, 8]
let [activeZoneX, activeZoneY] = [baseXCoord - 1, baseYCoord - 1]
let ctx: CanvasRenderingContext2D | undefined | null
let sectors: Record<number, Record<number, Array<number>>> = {}
let openedSectors: Record<number, Record<number, boolean>> = {
  [activeZoneX]: { [activeZoneY]: true }
}
let reducedFogSectors: Record<number, Record<number, boolean>> = {}
let boxW = 0
let boxH = 0

const fogRange = 1

const draw = (boxW: number, boxH: number) => {
  if (!ctx) return

  sectors = {}
  const cellW = Math.ceil(boxW / colCount)
  const cellH = Math.ceil(boxH / rowCount)
  console.log(boxW, boxH, cellW, cellH)

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
        ctx.fillStyle = 'black'
        ctx.fillRect(x1, y1, cellW, cellH)
      } else {
        ctx.fillStyle = 'rgba(0, 0, 255, .4)'
        ctx.fillRect(x1, y1, cellW, cellH)
        reduceFogAroundPoint(j, i)
      }
    }
  }
}

const reduceFogAroundPoint = (x: number, y: number) => {
  for (let i = -fogRange; i <= fogRange; i++) {
    for (let j = -fogRange; j <= fogRange; j++) {
      if (j === 0 && i == 0) continue
      reduceFog(x + j, y + i)
    }
  }
}

const showSector = (x: number, y: number) => {
  const alreadyActive = activeZoneX === x && activeZoneY === y
  const onRoad = activeZoneX === x || activeZoneY === y
  const onFog = reducedFogSectors[x]?.[y]

  if (!ctx || !sectors[x]?.[y] || alreadyActive || !onRoad || !onFog) return

  const [x1, x2, y1, y2] = sectors[x][y]
  ctx.fillStyle = 'transparent'
  const cellW = Math.ceil(boxW / colCount)
  const cellH = Math.ceil(boxH / rowCount)

  // Draw active point
  ctx.fillStyle = 'rgba(0, 0, 255, .4)'
  ctx.clearRect(x1, y1, cellW, cellH)
  ctx.fillRect(x1, y1, cellW, cellH)

  // Clear last point
  const [lastX1, , lastY1] = sectors[activeZoneX][activeZoneY]
  ctx.clearRect(lastX1, lastY1, cellW, cellH)

  if (!openedSectors[x]) openedSectors[x] = {}
  openedSectors[x][y] = true
  activeZoneX = x
  activeZoneY = y

  reduceFogAroundPoint(x, y)
}

const reduceFog = (x: number, y: number) => {
  if (!ctx || !sectors[x]?.[y] || !!openedSectors[x]?.[y] || !!reducedFogSectors[x]?.[y]) return

  const [x1, x2, y1, y2] = sectors[x][y]
  ctx.fillStyle = 'rgba(0,0,0,.8)'
  const cellW = Math.ceil(boxW / colCount)
  const cellH = Math.ceil(boxH / rowCount)
  ctx.clearRect(x1, y1, cellW, cellH)
  ctx.fillRect(x1, y1, cellW, cellH)

  if (!reducedFogSectors[x]) reducedFogSectors[x] = {}
  reducedFogSectors[x][y] = true
}

const interactEngine = {
  render(canvas: HTMLCanvasElement) {
    ctx = canvas.getContext('2d')
    if (!ctx) return

    boxW = canvas.width
    boxH = canvas.height
    draw(boxW, boxH)

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
