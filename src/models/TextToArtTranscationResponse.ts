import TransactionDetail from 'models/TransactionDetail'

export interface TextToArtTranscationResponse {

  textToArtResponse: TextToArtResponse[];
}

export interface TextToArtResponse {
  Base64: string;
  FinishReason: string;
  Seed: number;
}
