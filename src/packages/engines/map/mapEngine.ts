import { InteractiveSceneBaseEngine, type TGameConfig, type TSceneEmmitter } from '@/types'
import type { TMapEngineData, TMapColors, TMapStore, TEventCells } from './types'
import { baseColors } from './constants'
import clone from 'lodash.clonedeep'
import { getKeyFromCoords } from './helpers'

class MapEngine extends InteractiveSceneBaseEngine<TMapEngineData> {
  ctx!: CanvasRenderingContext2D
  eventCells: TEventCells = new Map()
  // TODO: Replace Record to Map
  cells: Record<number, Record<number, Array<number>>> = {}
  openedSectors: Record<number, Record<number, boolean>> = {}
  baseOpenedSectors: Record<number, Record<number, boolean>> = {}
  reducedFogSectors: Record<number, Record<number, boolean>> = {}
  activeZoneX: number
  activeZoneY: number
  colors: TMapColors
  boxW = 0
  boxH = 0
  fogRange = 1
  fogConfig?: {
    fogExists?: boolean
    reducedFogExists?: boolean
    reducedRange?: number
  }

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

    this.fogConfig = data.fogConfig
    if (data?.fogConfig?.reducedRange) {
      this.fogRange = data.fogConfig.reducedRange
    }
  }

  render(canvas: HTMLCanvasElement, props: TMapStore, config: TGameConfig) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    this.ctx = ctx

    const storeData = this.emitter.getState<TMapStore>(this.data.sceneId)
    if (!storeData) {
      this.eventCells = props.eventCells

      this.emitter.setState<TMapStore>(this.data.sceneId, {
        lastX: this.activeZoneX,
        lastY: this.activeZoneY,
        openedSectors: this.openedSectors,
        eventCells: this.eventCells
      })
    } else {
      this.activeZoneX = storeData.lastX!
      this.activeZoneY = storeData.lastY!
      this.data.startCoord.x = this.activeZoneX + 1
      this.data.startCoord.y = this.activeZoneY + 1
      this.baseOpenedSectors = storeData.openedSectors!
      this.eventCells = storeData.eventCells
    }

    this.boxW = canvas.width
    this.boxH = canvas.height
    this.drawCanvas()

    canvas.addEventListener('click', ({ offsetX, offsetY }) => {
      const { lockInteractive } = this.emitter.getContext()
      if (lockInteractive) return

      const partX = Math.round((offsetX / this.boxW) * 10000) / 10000
      const partY = Math.round((offsetY / this.boxH) * 10000) / 10000
      const rectX = Math.floor(partX * this.data.grid.x)
      const rectY = Math.floor(partY * this.data.grid.y)
      this.stepToSector(rectX, rectY)
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
        const x1 = i * cellW
        const x2 = (i + 1) * cellW
        const y1 = j * cellH
        const y2 = (j + 1) * cellH
        const res = [x1, x2, y1, y2]

        if (!this.cells[i]) this.cells[i] = {}
        this.cells[i][j] = res

        if (i + 1 === this.data.startCoord.x && j + 1 === this.data.startCoord.y) {
          basePoint = [i, j, x1, y1]
        } else {
          if (this.fogConfig?.fogExists) {
            if (this.baseOpenedSectors[i]?.[j]) {
              this.showSector(i, j)
              delete this.baseOpenedSectors[i]?.[j]
            } else {
              this.drawFullFog(x1, y1, cellW, cellH)
            }
          } else {
            this.showSector(i, j)
          }
        }
      }
    }

    if (basePoint) {
      const [xGrid, yGrid, x1, y1] = basePoint
      this.drawActivePoint(x1, y1)
      if (this.fogConfig?.reducedFogExists) {
        this.drawReducedFogAroundPoint(xGrid, yGrid)
      }
    }
  }

  showSector(x: number, y: number) {
    const alreadyActive = this.activeZoneX === x && this.activeZoneY === y
    if (!this.cells[x]?.[y] || alreadyActive) return

    const [x1, , y1] = this.cells[x][y]
    this.ctx.fillStyle = this.colors.oldStepPointFill
    const [cellW, cellH] = this.getCellSizes()
    const eSector = this.eventCells.get(getKeyFromCoords(x, y))

    if (eSector) {
      switch (eSector.type) {
        case 'event': {
          if (eSector.image) {
            this.loadImage(eSector.image, (img?: HTMLImageElement) => {
              this.drawVisibilityZone(x, y, x1, y1, cellW, cellH, {
                img,
                restrictActivePoint: true
              })
            })
            return
          }
        }
      }
    }

    this.drawVisibilityZone(x, y, x1, y1, cellW, cellH, { restrictActivePoint: true })
  }

  stepToSector(x: number, y: number) {
    const alreadyActive = this.activeZoneX === x && this.activeZoneY === y
    const onFog = this.fogConfig?.reducedFogExists ? this.reducedFogSectors[x]?.[y] : true
    const onRoad = // on neighbour cell
      (this.activeZoneX === x && (this.activeZoneY === y - 1 || this.activeZoneY === y + 1)) ||
      (this.activeZoneY === y && (this.activeZoneX === x - 1 || this.activeZoneX === x + 1))

    if (!this.cells[x]?.[y] || alreadyActive || !onRoad || !onFog) return

    const [x1, , y1] = this.cells[x][y]
    this.ctx.fillStyle = this.colors.oldStepPointFill
    const [cellW, cellH] = this.getCellSizes()

    const eSector = this.eventCells.get(getKeyFromCoords(x, y))
    if (eSector) {
      // TODO: Make events appear once
      this.emitter.setAction(eSector.action)

      switch (eSector.type) {
        case 'text':
          //
          break
        case 'event': {
          if (eSector.lockInteractive) this.emitter.lockInteractive(true)

          const callback = (img?: HTMLImageElement) => {
            this.drawVisibilityZone(x, y, x1, y1, cellW, cellH, { img })

            this.emitter.setState(this.data.sceneId, {
              lastX: this.activeZoneX,
              lastY: this.activeZoneY,
              openedSectors: clone(this.openedSectors),
              eventCells: clone(this.eventCells)
            })
          }

          eSector.image ? this.loadImage(eSector.image, callback) : callback()
          return
        }
      }
    }

    this.drawVisibilityZone(x, y, x1, y1, cellW, cellH, {})
  }

  drawVisibilityZone(
    xGrid: number,
    yGrid: number,
    x1Coord: number,
    y1Coord: number,
    cellW: number,
    cellH: number,
    {
      img,
      restrictActivePoint
    }: {
      img?: HTMLImageElement
      restrictActivePoint?: boolean
    }
  ) {
    if (!img) {
      if (!restrictActivePoint) this.drawActivePoint(x1Coord, y1Coord)
    } else {
      this.ctx.drawImage(img, x1Coord, y1Coord, cellW, cellH)
    }

    if (!restrictActivePoint) {
      // Clearing last point
      const [lastX1, , lastY1] = this.cells[this.activeZoneX][this.activeZoneY]
      const eventSector = this.eventCells.get(getKeyFromCoords(this.activeZoneX, this.activeZoneY))

      if (!eventSector || !('image' in eventSector)) {
        // TODO: delete last text if not new events
        this.ctx.clearRect(lastX1, lastY1, cellW, cellH)
      }
    }

    if (!this.openedSectors[xGrid]) this.openedSectors[xGrid] = {}
    this.openedSectors[xGrid][yGrid] = true

    if (!restrictActivePoint) {
      this.activeZoneX = xGrid
      this.activeZoneY = yGrid
    }

    if (this.fogConfig?.reducedFogExists) {
      this.drawReducedFogAroundPoint(xGrid, yGrid)
    }
  }

  drawActivePoint(x1: number, y1: number) {
    const [cellW, cellH] = this.getCellSizes()
    this.ctx.fillStyle = this.colors.activePointFill
    this.ctx.clearRect(x1, y1, cellW, cellH)
    this.ctx.fillRect(x1, y1, cellW, cellH)
  }

  getCellSizes() {
    const cellW = Math.ceil(this.boxW / this.data.grid.x)
    const cellH = Math.ceil(this.boxH / this.data.grid.y)
    return [cellW, cellH]
  }

  drawReducedFogAroundPoint(x: number, y: number) {
    for (let i = -this.fogRange; i <= this.fogRange; i++) {
      for (let j = -this.fogRange; j <= this.fogRange; j++) {
        if (j === 0 && i === 0) {
          if (!this.reducedFogSectors[x]) this.reducedFogSectors[x] = {}
          this.reducedFogSectors[x][y] = true
          continue
        }
        this.drawReducedFog(x + j, y + i)
      }
    }
  }

  drawReducedFog(x: number, y: number) {
    if (!this.cells[x]?.[y] || !!this.openedSectors[x]?.[y] || !!this.reducedFogSectors[x]?.[y])
      return

    const [x1, , y1] = this.cells[x][y]
    const eventSector = this.eventCells.get(getKeyFromCoords(x, y))

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

    this.setReducedFogSectors(x, y)
  }

  setReducedFogSectors(x: number, y: number) {
    if (!this.reducedFogSectors[x]) this.reducedFogSectors[x] = {}
    this.reducedFogSectors[x][y] = true
  }

  drawFullFog(x1: number, y1: number, cellW: number, cellH: number) {
    this.ctx.fillStyle = this.colors.fullFogFill
    this.ctx.fillRect(x1, y1, cellW, cellH)
  }
}

export { MapEngine }
