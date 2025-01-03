import { getImageUrl } from '@/helpers'
import type { TAction } from './sceneAction'

export interface TSceneEmmitter {
  setAction(action: TAction): void
  getState(sceneId: string): Record<string, unknown>
  setState(sceneId: string, state: Record<string, unknown>): void
  getCharacteristics(): Record<string, unknown>[]
  setCharacteristics(state: Record<string, unknown>[]): void
  setCustomOverlayComponent(component: InstanceType<any> | null): void
  setCustomTextComponent(component: InstanceType<any> | null): void
}

export interface TBaseInterractiveData {
  gameId: string
  sceneId: string
}

export abstract class InteractiveSceneBaseEngine<T extends TBaseInterractiveData> {
  protected data: T
  protected emitter: TSceneEmmitter

  constructor(data: T, emitter: TSceneEmmitter) {
    this.data = data
    this.emitter = emitter
  }

  abstract render(canvas: HTMLCanvasElement): void
  abstract resize(boxW: number, boxH: number): void

  loadImage(imageName: string, callback: (img: HTMLImageElement) => void) {
    const img = new Image()
    img.src = getImageUrl(this.data.gameId, imageName)
    img.onload = function () {
      callback(img)
    }
  }
}
