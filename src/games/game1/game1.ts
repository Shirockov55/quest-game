import { type TGameConfig, EActionType } from '@/types/gameConfig'

console.log('Test game1!')

const enum ScenesIds {
  RailStation = 'RailStation',
  RailStation2 = 'RailStation2',
  Stalker = 'Stalker',
  StalkerMonster = 'StalkerMonster',
  RIP = 'RIP'
}

const ScenesImages: Record<ScenesIds, string> = {
  [ScenesIds.RailStation]: 'rail-station.jpg',
  [ScenesIds.RailStation2]: 'rail-station2.jpg',
  [ScenesIds.Stalker]: 'stalker1.jpg',
  [ScenesIds.StalkerMonster]: 'stalkerMonster.jpg',
  [ScenesIds.RIP]: 'rip.jpg'
}

const gameConfig: TGameConfig = {
  name: 'game1',
  baseScene: ScenesIds.RailStation,
  scenes: {
    [ScenesIds.RailStation]: {
      image: ScenesImages[ScenesIds.RailStation],
      textTrees: [
        {
          id: 'Начало',
          mainText: 'Ты на заброшенной ж/д станции. Видишь какого-то странного сталкера.',
          actions: [
            {
              text: 'Подойти',
              action: {
                type: EActionType.GoToScene,
                nextId: ScenesIds.Stalker
              }
            },
            {
              text: 'Пройти мимо',
              action: {
                type: EActionType.GoToScene,
                nextId: ScenesIds.RailStation2
              }
            }
          ]
        }
      ]
    },
    [ScenesIds.RailStation2]: {
      image: ScenesImages[ScenesIds.RailStation2],
      textTrees: [
        {
          id: 'Конец',
          mainText: 'Ты попадаешь к выходу из железной станции.',
          actions: []
        }
      ]
    },
    [ScenesIds.Stalker]: {
      image: ScenesImages[ScenesIds.Stalker],
      audio: '1994_Doom_II_OST_The_Dave_D_Taylor.mp3',
      textTrees: [
        {
          id: 'Начало диалога',
          mainText: 'Странный сталкер выглядит странно, похрюкивает. Но не понятно что с ним.',
          companion: {
            name: 'Мутный сталкер',
            speech: 'Привет, путник, кхе, кхе',
            answers: [
              {
                text: 'Шалом, Сталкер. Ты давно тут?',
                action: {
                  type: EActionType.GoToDialogTree,
                  nextId: 'Продолжение диалога'
                }
              },
              {
                text: 'Съеби с дороги, тифозный!!!',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.StalkerMonster
                }
              }
            ]
          }
        },
        {
          id: 'Продолжение диалога',
          companion: {
            name: 'Мутный сталкер',
            speech:
              'Да, недавно нас закинули на этот объект. Но тут творятся странные дела... Хрм... Лучше иди, добрый человек',
            answers: [
              {
                text: 'Спасибо, я пойду',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.RailStation2
                }
              },
              {
                text: 'Съеби с дороги, тифозный!!!',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.StalkerMonster
                }
              }
            ]
          }
        }
      ]
    },
    [ScenesIds.StalkerMonster]: {
      image: ScenesImages[ScenesIds.StalkerMonster],
      audio: 'Bobby_Prince_At_Doom_Gate.mp3',
      textTrees: [
        {
          id: 'pizda riadom',
          companion: {
            name: 'СУПЕР МУТАНТ сталкер',
            speech: 'Тебе пизда за такие слова!',
            answers: [
              {
                text: 'Изззззз-ззз-ззвините. (Съебнуть в ужасе)',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.RailStation2
                }
              },
              {
                text: 'И что ты мне сделаешь?',
                action: {
                  type: EActionType.GoToScene,
                  nextId: ScenesIds.RIP
                }
              }
            ]
          }
        }
      ]
    },
    [ScenesIds.RIP]: {
      image: ScenesImages[ScenesIds.RIP],
      textTrees: [
        {
          id: 'pizda',
          mainText: 'Ну и нахуя я ему загрубил?',
          actions: []
        }
      ]
    }
  }
}

export default gameConfig
