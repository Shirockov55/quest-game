// import { appDataDir, join } from '@tauri-apps/api/path'
// import { convertFileSrc } from '@tauri-apps/api/core'

export const getImageUrl = (gameId: string, name: string) => {
  // TODO: Разобраться с соурсами для tauri

  // const appDataDirPath = await appDataDir()
  // const baseUrl = `/src/games/${gameId}/assets/images/${data.image}`
  // const filePath = await join(appDataDirPath, baseUrl)
  // const assetUrl = convertFileSrc(filePath)
  // console.log(assetUrl)
  // return assetUrl

  const baseUrl = `/src/games/${gameId}/assets/images/${name}`
  const url = new URL(baseUrl, import.meta.url).href
  return url
}
