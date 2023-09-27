import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import axios from "axios";
import CreateAccountResponse from "models/CreateAccountResponse";
import { notify } from "../utils/notifications";
import bs58 from 'bs58';


// send props in to know account state if we have a connected wallet..
export const UserDetails: FC = () => {
  const [signedIn, setSignedIn] = useState(false);

  // I can/should probably combine these into a user model
  const [userWallet, setUserWallet] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { publicKey, signMessage } = useWallet();
  
  // These probably should be set properly.
  let isSignedIn = false; // this needs to be state
  let userToken = "";
  let signedHashForServer = "";

  const signServerChallenge = useCallback(async () => {
    try{

      if (!publicKey) throw new Error('Wallet not  connected');
      if (!signMessage) throw new Error('Wallet does not support message signing! - "See Wallet Sign Unsupported" in docs');
      
      const message = new TextEncoder().encode('Hello, world!');
      const signedHash = await signMessage(message);

      var encodedSignedHash = bs58.encode(signedHash);

      //Testing (considere if we need notify.)
      console.log("signature at signServerChallenge(): ", encodedSignedHash)
      notify({ type: 'success', message: 'Sign message successful!', txid: bs58.encode(signedHash) });


      return encodedSignedHash;
    } catch (err: any) {
      notify({ type: 'error', message: `Sign Message failed!`, description: err?.message });
      console.log('error', `Sign Message failed! ${err?.message}`);
    }
  }, [publicKey, notify, signMessage])

  // yeah we can hard code these here at first but let's abstract this all into
  // in api/routes file as we'll need to make the domanin dynamic an all that.
  async function callCreateAccount(){

    const signedHashValue = await signServerChallenge();
    
    let createAccountResponse: CreateAccountResponse; 
    let wallet = publicKey.toString();

    console.log(wallet, "wallet in callCreateAccount");
    //TODO: Make this a post, do create account flow. Then move api stuff to it's own module and figure out how to 
    // pass/ keep the auth token around.

    const data = JSON.stringify({signedHash: signedHashValue, publicKey: wallet})
    const customConfig = {
      headers:{
        'Content-Type': 'application/json'
      }
    };

    
    await axios
        .post<CreateAccountResponse>("https://localhost:7247/api/Auth/CreateAccount",data, customConfig)
        .then((res) => {
          createAccountResponse = res.data;
          setSignedIn(true);
          setUserWallet(createAccountResponse.wallet);
          setUserName(createAccountResponse.wallet);

          // Save token to local storage under user auth.
          // Once above is done create routes or api file
          // and port this call over. See work stuff as example/
          // then built out sign in route
          // then built out call in parent view to check
          // for local toke and if not call get 
          // user exists from backend to display 
          // sign in or create account. (we can deal with
          // token refresh logic at a leter date.)

        })
        .catch(err => {
            console.log(err);
        })

        console.log("create account response: ", createAccountResponse)
        
        //if 200
  }

  const createAccount = () => {
    callCreateAccount();
  }

  const ShouldShowUserDetail = () => {
    if (publicKey && signedIn) {
      return (
        <div className="text-lg text-left">
        <div className="p-4">Username: {userWallet} </div>
        <div className="p-4">Wallet: {userWallet} </div>
        <div className="p-4">Email: (Coming Soon)</div>
        <div className="p-4">Phone: (Coming Soon)</div>
        <div className="flex justify-center pt-4">
          <button className="btn btn-primary w-3/4">Edit</button>
        </div>
      </div>
      );
    } else if (publicKey) {
      return (
        <div>
          <div className="blur-lg">
            <div className="text-lg text-left">
              <div className="p-4">Username:</div>
              <div className="p-4">Wallet:</div>
              <div className="p-4">Email: (Coming Soon)</div>
              <div className="p-4">Phone: (Coming Soon)</div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <button className="btn btn-primary w-3/4"
                    onClick={createAccount}
            >
                Create Account
                </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="blur-lg">
            <div className="text-lg text-left">
              <div className="p-4">Username:</div>
              <div className="p-4">Wallet:</div>
              <div className="p-4">Email: (Coming Soon)</div>
              <div className="p-4">Phone: (Coming Soon)</div>
              <div className="flex justify-center pt-4">
              </div>
            </div>
          </div>
          <button className="btn btn-primary w-3/4">Connect Wallet (make sol connect wallet btn)</button>
        </div>
      );
    }
  };

  return (
    <div className="rounded-lg border border-indigo-500/25 p-12">
      <ShouldShowUserDetail />
    </div>
  );
};
