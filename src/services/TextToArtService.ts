import axios from "axios";
import GenerateTextToArtTransactionRequest from "models/GenerateTextToArtTransactionRequest";
import { TextToArtRequest } from "models/TextToArtRequest";

//TODO: This should probably be a class
// TODO: Routes should constants and pre-defined. Domains should be in .env file.

const customConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export async function GenerateStablityTextToArt(
  request: TextToArtRequest
): Promise<any> {
  //still need to make response obj
  try {
    /*
    const response = await axios.post<any>(
      "https://localhost:7247/api/proxy/text-to-art/generate-stablity",
      JSON.stringify(request),
      customConfig
    );
    */
    console.log(
      "Spoofing the TextToArt.GenerateStablityTextToArt api call: ",
      request
    );
    const result = true; //response.data;
    return result;
  } catch (err) {
    console.log("Error in TextToArt.GenerateStablityTextToArt:", err);
  }
}

export async function GenerateTextToArtTransaction(
  request: TextToArtRequest
): Promise<any> {
  //still need to make response obj
  try {
    /*
      const response = await axios.post<any>(
        "https://localhost:7247/api/proxy/text-to-art/generate-stablity",
        JSON.stringify(request),
        customConfig
      );
      */
    console.log(
      "Spoofing the TextToArt.GenerateTextToArtTransaction api call: ",
      request
    );
    const result = true; //response.data;
    return result;
  } catch (err) {
    console.log("Error in TextToArt.GenerateTextToArtTransaction:", err);
  }
}
