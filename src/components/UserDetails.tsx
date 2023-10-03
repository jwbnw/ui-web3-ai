import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useEffect, useState } from "react";
import { notify } from "../utils/notifications";
import bs58 from "bs58";
import {
  CreateAccount,
  SignIn,
  CreateOrUpdateLocalUserStorage,
} from "services/UserService";
import CreateAccountRequest from "models/CreateAccountRequest";
import SignInRequest from "models/SignInRequest";
import IUser from "models/IUser";

type UserDetailProps = {
  hasAccount: boolean;
  hasToken: boolean;
  user: IUser;
};

export const UserDetails: FC<UserDetailProps> = ({
  hasAccount,
  hasToken,
  user,
}) => {
  useEffect(() => {
    setUserName(user.username);
    setUserWallet(user.wallet);
    setSignedIn(hasToken);
  }, [hasToken, user]);

  const [signedIn, setSignedIn] = useState(hasToken);

  // I can/should probably combine these into a user model
  const [userWallet, setUserWallet] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const { publicKey, signMessage } = useWallet();

  const signServerChallenge = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!signMessage)
        throw new Error(
          'Wallet does not support message signing! - "See Wallet Sign Unsupported" in docs'
        );

      const message = new TextEncoder().encode("HashFromServer");
      const signedHash = await signMessage(message);

      var encodedSignedHash = bs58.encode(signedHash);

      console.log("encoded signature at signServerChallenge(): ", encodedSignedHash);
      notify({
        type: "success",
        message: "Sign message successful!",
        txid: bs58.encode(signedHash),
      });

      return encodedSignedHash;
    } catch (err: any) {
      notify({
        type: "error",
        message: `Sign Message failed!`,
        description: err?.message,
      });
      console.log("error", `Sign Message failed! ${err?.message}`);
    }
  }, [publicKey, notify, signMessage]);

  async function callCreateAccount() {
    const signedHashValue = await signServerChallenge();
    let wallet = publicKey.toString();

    const createAccountRequest: CreateAccountRequest = {
      signedHash: signedHashValue,
      publicKey: wallet,
    };

    const createAccountResult = await CreateAccount(createAccountRequest);

    if (createAccountResult.userId !== "") {
      setSignedIn(true);
      setUserWallet(createAccountResult.wallet);
      setUserName(createAccountResult.wallet);
      CreateOrUpdateLocalUserStorage(createAccountResult);
    } else {
      console.log("Did not recieve user id from backend something went wrong");
    }
  }

  async function callSignIn() {
    const signedHashValue = await signServerChallenge();
    let wallet = publicKey.toString();

    const signInRequest: SignInRequest = {
      signedHash: signedHashValue,
      publicKey: wallet,
    };

    const signInResult = await SignIn(signInRequest);

    if (signInResult.userId !== "") {
      setSignedIn(true);
      setUserWallet(signInResult.wallet);
      setUserName(signInResult.wallet);
      CreateOrUpdateLocalUserStorage(signInResult);
    } else {
      console.log("Did not recieve user id from backend something went wrong");
    }
  }

  const createAccount = () => {
    callCreateAccount();
  };

  const signIn = () => {
    callSignIn();
  };

  const ShouldShowUserDetail = () => {
    if (publicKey && signedIn) {
      return (
        <div className="text-lg text-left">
          <div className="p-4">Username: {userName} </div>
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
            {!hasAccount ? (
              <button className="btn btn-primary w-3/4" onClick={createAccount}>
                Create Account{" "}
              </button>
            ) : (
              <button className="btn btn-primary w-3/4" onClick={signIn}>
                Sign In{" "}
              </button>
            )}
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
              <div className="flex justify-center pt-4"></div>
            </div>
          </div>
          <button className="btn btn-primary w-3/4">
            Connect Wallet (make sol connect wallet btn)
          </button>
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
