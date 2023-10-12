import axios from "axios";
import TransactionDetail from "models/TransactionDetail";
import { TextToArtTranscationRequest } from "models/TextToArtTranscationRequest";
import { TextToArtTranscationResponse } from "models/TextToArtTranscationResponse";


//TODO: This should probably be a class
// TODO: Routes should constants and pre-defined. Domains should be in .env file.

const customConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export async function GenerateTextToArtResult(
  request: TextToArtTranscationRequest
): Promise<TextToArtTranscationResponse> {
  try {
    
      const response = await axios.post<TextToArtTranscationResponse>(
        "https://localhost:7247/api/text-to-art/create-transaction",
        JSON.stringify(request),
        customConfig
      );
      
    const result = response.data;
    console.log("Loggin Response.Data TextToArt.GenerateTextToArtTransaction:", result);
    return result;
  } catch (err) {
    console.log("Error in TextToArt.GenerateTextToArtTransaction:", err);
  }
}
