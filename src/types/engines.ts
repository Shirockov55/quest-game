import { getImageUrl } from '@/helpers'
import type { TAction } from './sceneAction'
import type { TGameConfig } from './gameConfig'

export interface TSceneEmmitter {
  setAction(action: TAction): void
  getContext(): TSceneEmmitterContext
  lockInteractive(val: boolean): void
  getState<T = unknown>(sceneId: string): T | null
  setState<T = unknown>(sceneId: string, state: T): void
  getCharacteristics(): Record<string, unknown>
  setCharacteristics<T = unknown>(state: Record<string, T>): void
  setCustomOverlayComponent(
    component: InstanceType<any> | null,
    props?: Record<string, unknown> | null
  ): void
  setCustomTextComponent(component: InstanceType<any> | null): void
}

export interface TSceneEmmitterContext {
  currentSceneId: string
  prevSceneId: string | null
  lockInteractive: boolean
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

  abstract render(canvas: HTMLCanvasElement, props: unknown, config: TGameConfig): void
  abstract resize(boxW: number, boxH: number): void

  loadImage(imageName: string, callback?: (img: HTMLImageElement) => void) {
    const img = new Image()
    img.src = getImageUrl(this.data.gameId, imageName)
    if (callback)
      img.onload = function () {
        callback(img)
      }
  }
}
