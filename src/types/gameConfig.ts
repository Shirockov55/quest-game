export const enum ActionType {
  GoTo = 'GO_TO'
}

export interface RouteAction {
  nextId: string
  type: ActionType.GoTo
}

export type Action = RouteAction

export interface ActionBtn {
  text: string
  action: Action
}

export interface Scene {
  image: string
  mainText: {
    text: string
  }
  buttons?: ActionBtn[]
  animation?: {
    appear: string
    dissapear: string
  }
}

export interface GameConfig {
  name: string
  baseScene: string
  scenes: Record<string, Scene>
}
