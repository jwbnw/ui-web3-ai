import TransactionDetail from 'models/TransactionDetail'

export interface TextToArtTranscationRequest {
  steps: number;
  width: number; //remove - add in backend proxy
  height: number; //remove - add in backend proxy
  seed: number; //remove - add in backend proxy
  cfgScale: number;
  stylePreset: string;
  samples: number; //remove - add in backend proxy
  textPrompts: Text_Prompt[];
  transactionRequest: TransactionDetail;
}

export interface Text_Prompt {
  text: string;
  weight: number;
}

