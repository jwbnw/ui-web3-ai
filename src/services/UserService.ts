import axios from "axios";
import CreateAccountRequest from "models/CreateAccountRequest";
import CreateAccountResponse from "models/CreateAccountResponse";
import HasAccountRequest from "models/HasAccountRequest";
import HasAccountResponse from "models/HasAccountResponse";
import SignInRequest from "models/SignInRequest";
import SignInResponse from "models/SignInResponse";

//if I end up implementing a bunch of similar stuff I can make this a class
// TODO: Hardcode routes into a url object or somethin similar - domain will be controlled by an env var

const customConfig = {
    headers:{
      'Content-Type': 'application/json'
    }
};


  export async function CreateAccount(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    try{
        const response = await axios.post<CreateAccountResponse>("https://localhost:7247/api/Auth/CreateAccount",JSON.stringify(request), customConfig)
        const result = response.data;
        return result;
    }
    catch(err){
        //Test this case
        console.log("Error in UserService.CreateAccount:", err);
    }
  }

  export async function SignIn(request: SignInRequest): Promise<SignInResponse> {
    try{
        const response = await axios.post<SignInResponse>("https://localhost:7247/api/Auth/SignIn",JSON.stringify(request), customConfig)
        const result = response.data;
        return result;
    }
    catch(err){
        //Test this case
        console.log("Error in UserService.SignIn:", err);
    }
  }

  export async function HasAccount(request: HasAccountRequest): Promise<HasAccountResponse> {
    try{
        const response = await axios.post<HasAccountResponse>("https://localhost:7247/api/Auth/HasAccount",JSON.stringify(request), customConfig)
        const result = response.data;
        return result;
    }
    catch(err){
        //Test this case
        console.log("Error in UserService.SignIn:", err);
    }
  }
