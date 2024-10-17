import { InteractiveSceneBaseEngine, type TSceneEmmitter } from '@/types'
import { EActionType } from '@/constants'
import type { TMapEngineData, TMapColors } from './types'
import { baseColors } from './constants'

class MapEngine extends InteractiveSceneBaseEngine<TMapEngineData> {
  ctx!: CanvasRenderingContext2D
  // TODO: Replace Record to Map
  cells: Record<number, Record<number, Array<number>>> = {}
  openedSectors: Record<number, Record<number, boolean>> = {}
  reducedFogSectors: Record<number, Record<number, boolean>> = {}
  activeZoneX: number
  activeZoneY: number
  colors: TMapColors
  boxW = 0
  boxH = 0
  fogRange = 1

  constructor(data: TMapEngineData, emitter: TSceneEmmitter) {
    super(data, emitter)

    this.activeZoneX = this.data.startCoord.x - 1
    this.activeZoneY = this.data.startCoord.y - 1
    this.openedSectors = {
      [this.activeZoneX]: { [this.activeZoneY]: true }
    }
    this.colors = {
      ...baseColors,
      ...this.data.colors
    }
  }

  render(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    this.ctx = ctx

    const storeData = this.emitter.getState(this.data.sceneId)
    // TODO: replace base data

    this.boxW = canvas.width
    this.boxH = canvas.height
    this.drawCanvas()

    canvas.addEventListener('click', ({ offsetX, offsetY }) => {
      const partX = Math.round((offsetX / this.boxW) * 10000) / 10000
      const partY = Math.round((offsetY / this.boxH) * 10000) / 10000
      const rectX = Math.floor(partX * this.data.grid.x)
      const rectY = Math.floor(partY * this.data.grid.y)
      this.showSector(rectX, rectY)
    })
  }

  resize(_boxW: number, _boxH: number) {
    this.boxW = _boxW
    this.boxH = _boxH
    if (!this.ctx) return
    this.drawCanvas()
  }

  drawCanvas() {
    this.cells = {}
    let basePoint: [number, number, number, number] | null = null
    const [cellW, cellH] = this.getCellSizes()

    for (let i = 0; i < this.data.grid.x; i++) {
      for (let j = 0; j < this.data.grid.y; j++) {
        const x1 = j * cellW
        const x2 = (j + 1) * cellW
        const y1 = i * cellH
        const y2 = (i + 1) * cellH
        const res = [x1, x2, y1, y2]

        if (!this.cells[j]) this.cells[j] = {}
        this.cells[j][i] = res

        // FIXME: not possible to return to start coords position
        if (j + 1 !== this.data.startCoord.x || i + 1 !== this.data.startCoord.y) {
          this.ctx.fillStyle = this.colors.fullFogFill
          this.ctx.fillRect(x1, y1, cellW, cellH)
        } else {
          basePoint = [j, i, x1, y1]
        }
      }
    }

    if (basePoint) {
      const [xGrid, yGrid, x1, y1] = basePoint
      this.drawActivePoint(x1, y1)
      this.drawReducedFogAroundPoint(xGrid, yGrid)
    }
  }

  showSector(x: number, y: number) {
    const alreadyActive = this.activeZoneX === x && this.activeZoneY === y
    const onRoad =
      (this.activeZoneX === x && (this.activeZoneY === y - 1 || this.activeZoneY === y + 1)) ||
      (this.activeZoneY === y && (this.activeZoneX === x - 1 || this.activeZoneX === x + 1))
    const onFog = this.reducedFogSectors[x]?.[y]

    if (!this.cells[x]?.[y] || alreadyActive || !onRoad || !onFog) return

    const [x1, , y1] = this.cells[x][y]
    this.ctx.fillStyle = this.colors.oldStepPointFill
    const [cellW, cellH] = this.getCellSizes()

    const eSector = this.data.eventCells.get(`${x + 1}:${y + 1}`)
    if (eSector) {
      if (eSector.action.type === EActionType.GoToScene && eSector.action.withSaveState) {
        // TODO: Save scene state in store
        this.emitter.setState(this.data.sceneId, {})
      }
      // TODO: Create locked events for map click
      // TODO: Make events appear once
      this.emitter.setAction(eSector.action)

      switch (eSector.type) {
        case 'text':
          //
          break
        case 'event':
          if (eSector.image) {
            this.loadImage(eSector.image, (img) => {
              this.drawVisibilityZone(x, y, x1, y1, cellW, cellH, img)
            })
            return
          }
          break
      }
    }

    this.drawVisibilityZone(x, y, x1, y1, cellW, cellH)
  }

  drawVisibilityZone(
    xGrid: number,
    yGrid: number,
    x1Coord: number,
    y1Coord: number,
    cellW: number,
    cellH: number,
    img?: HTMLImageElement
  ) {
    if (!img) {
      this.drawActivePoint(x1Coord, y1Coord)
    } else {
      this.ctx.drawImage(img, x1Coord, y1Coord, cellW, cellH)
    }

    // Clearing last point
    const [lastX1, , lastY1] = this.cells[this.activeZoneX][this.activeZoneY]
    const eventSector = this.data.eventCells.get(`${this.activeZoneX + 1}:${this.activeZoneY + 1}`)
    if (!eventSector || !('image' in eventSector)) {
      // TODO: delete last text if not new events
      this.ctx.clearRect(lastX1, lastY1, cellW, cellH)
    }

    if (!this.openedSectors[xGrid]) this.openedSectors[xGrid] = {}
    this.openedSectors[xGrid][yGrid] = true
    this.activeZoneX = xGrid
    this.activeZoneY = yGrid

    this.drawReducedFogAroundPoint(xGrid, yGrid)
  }

  drawActivePoint(x1: number, y1: number) {
    const [cellW, cellH] = this.getCellSizes()
    this.ctx.fillStyle = this.colors.activePointFill
    this.ctx.clearRect(x1, y1, cellW, cellH)
    this.ctx.fillRect(x1, y1, cellW, cellH)
  }

  getCellSizes() {
    const cellW = Math.ceil(this.boxW / this.data.grid.y)
    const cellH = Math.ceil(this.boxH / this.data.grid.x)
    return [cellW, cellH]
  }

  drawReducedFogAroundPoint(x: number, y: number) {
    for (let i = -this.fogRange; i <= this.fogRange; i++) {
      for (let j = -this.fogRange; j <= this.fogRange; j++) {
        if (j === 0 && i == 0) continue
        this.drawReducedFog(x + j, y + i)
      }
    }
  }

  drawReducedFog(x: number, y: number) {
    if (!this.cells[x]?.[y] || !!this.openedSectors[x]?.[y] || !!this.reducedFogSectors[x]?.[y])
      return

    const [x1, , y1] = this.cells[x][y]
    const eventSector = this.data.eventCells.get(`${x + 1}:${y + 1}`)

    if (eventSector && eventSector.type === 'event' && eventSector.imageOnFog) {
      const [cellW, cellH] = this.getCellSizes()
      this.loadImage(eventSector.imageOnFog, (img) => {
        this.ctx.drawImage(img, x1, y1, cellW, cellH)
      })
    } else {
      this.ctx.fillStyle = this.colors.closeFogFill
      const cellW = Math.ceil(this.boxW / this.data.grid.y)
      const cellH = Math.ceil(this.boxH / this.data.grid.x)
      this.ctx.clearRect(x1, y1, cellW, cellH)
      this.ctx.fillRect(x1, y1, cellW, cellH)
    }

    if (!this.reducedFogSectors[x]) this.reducedFogSectors[x] = {}
    this.reducedFogSectors[x][y] = true
  }
}

export { MapEngine }
