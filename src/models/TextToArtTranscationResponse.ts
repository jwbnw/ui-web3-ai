import TransactionDetail from 'models/TransactionDetail'

export interface TextToArtTranscationResponse {

  stablityTextToArtImages: TextToArtResponse[];
}

export interface TextToArtResponse {
  base64: string;
  finishReason: string;
  seed: number;
}
