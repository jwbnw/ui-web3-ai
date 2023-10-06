export default interface GenerateTextToArtTransactionRequest {
  estimatedCostSol: number;
  estimatedCostUsd: number;
  paymentChoice: string;
  payerKey: string;
}
