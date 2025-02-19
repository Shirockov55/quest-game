export type ValueOf<T> = T[keyof T]

export type TSceneTransition =
  | string
  | {
      appear: string
      dissapear: string
    }
