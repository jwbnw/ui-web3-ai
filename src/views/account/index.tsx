import { FC, useEffect, useState } from "react";
import { UserDetails } from "../../components/UserDetails";
import { HasAccount } from "services/UserService";
import HasAccountRequest from "models/HasAccountRequest";
import { useWallet } from "@solana/wallet-adapter-react";
import { GetLocalUserStorage } from "services/UserService";
import IUser from "models/IUser";

export const AccountView: FC = ({}) => {
  const [incomingUser, setIncomingUser] = useState<IUser>({
    wallet: "",
    phoneNumber: "",
    email: "",
    username: "",
  });
  const [tokenExists, setTokenExists] = useState(false);
  const [hasKnownAccount, setHasKnownAccount] = useState(false);
  const { publicKey, signMessage } = useWallet();

  useEffect(() => {
    let tokenInStorage = localStorage.getItem("X-User-Token");

    if (tokenInStorage !== null) {
      handleTokenExists();
      handleUserCheck();
    } else if (publicKey) {
      callHasKnownAccount();
    }
  }, [tokenExists, hasKnownAccount]);

  async function callHasKnownAccount() {
    console.log("calling has known account");
    const hasAccountRequest: HasAccountRequest = {
      publicKey: publicKey.toString(),
    };

    let accountCheck = await HasAccount(hasAccountRequest);
    setHasKnownAccount(accountCheck.hasAccount);
  }

  function handleUserCheck() {
    var test = GetLocalUserStorage();
    setIncomingUser(GetLocalUserStorage());
  }

  function handleTokenExists() {
    setTokenExists(true);
    setHasKnownAccount(true); // need to figure out a better way to do auth. Not sure about using local storage in general.
  }

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          My Account
        </h1>
        <div>
          <UserDetails
            hasAccount={hasKnownAccount}
            hasToken={tokenExists}
            user={incomingUser}
          />
        </div>
      </div>
    </div>
  );
};
