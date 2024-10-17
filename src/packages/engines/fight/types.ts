import type { InteractiveSceneBaseEngine, TBaseInterractiveData } from '@/types'

export interface TFightEngineData extends TBaseInterractiveData {}

export interface TFightEngineConfig {
  type: 'fight'
  engine: InteractiveSceneBaseEngine<TFightEngineData>
}
