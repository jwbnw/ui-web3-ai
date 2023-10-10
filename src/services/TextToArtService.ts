import axios from "axios";
import TransactionDetail from "models/TransactionDetail";
import { TextToArtTranscationRequest } from "models/TextToArtTranscationRequest";

//TODO: This should probably be a class
// TODO: Routes should constants and pre-defined. Domains should be in .env file.

const customConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export async function GenerateTextToArtTransaction(
  request: TextToArtTranscationRequest
): Promise<any> {
  //still need to make response obj
  try {
    
      const response = await axios.post<any>(
        "https://localhost:7247/api/text-to-art/create-transaction",
        JSON.stringify(request),
        customConfig
      );
      
    const result = response.data;
    return result;
  } catch (err) {
    console.log("Error in TextToArt.GenerateTextToArtTransaction:", err);
  }
}
