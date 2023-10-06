import GenerateTextToArtTransactionRequest from 'models/GenerateTextToArtTransactionRequest'

export interface TextToArtRequest {
  steps: number;
  width: number; //remove - add in backend proxy
  height: number; //remove - add in backend proxy
  seed: number; //remove - add in backend proxy
  cfg_scale: number;
  style_preset: string;
  samples: number; //remove - add in backend proxy
  text_prompts: Text_Prompt[];
  transaction_request: GenerateTextToArtTransactionRequest;
}

export interface Text_Prompt {
  text: string;
  weight: number;
}

