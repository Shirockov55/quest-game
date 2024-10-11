// TODO: Продумать вариант структуры стилизованного текста через объект или массив
export type DynamicText = string | { text: string } | (() => string)
