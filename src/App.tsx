import "./App.css";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { ethers } from "ethers";

const openlogin = new OpenLogin({
  clientId:
    "BFFZOyDfs-K02CgDFpGVzX6A30EcaMCMoUoXkXwoyEbPuL7OZerAKu_2CY8EDxxefaaZaLf8rg1S7COegAyB1eM",
  network: "mainnet",
  uxMode: "popup",
});

function App() {
  const [deepLinkHref, setDeepLinkHref] = useState("");

  useEffect(() => {
    initOpenLogin();
    // eslint-disable-next-line
  }, []);

  const initOpenLogin = async () => {
    // only popup for mobile
    if (navigator.maxTouchPoints === 0) return;

    // get host from url
    const deepLinkHost: string = window.location.href.split("?")[1];

    await openlogin.init();
    if (!openlogin.privKey) {
      await openlogin.login();
    }

    // sign message
    const signedMessage = await signMessage(openlogin.privKey);

    // set deep link href
    setDeepLinkHref(
      `unitydl://${deepLinkHost}?${openlogin.privKey}?${signedMessage}`
    );
  };

  const onLogOut = async () => {
    await openlogin.logout();
    window.location.reload();
  };

  const signMessage = async (privateKey: string): Promise<string> => {
    const wallet = new ethers.Wallet(privateKey, ethers.getDefaultProvider());
    const address = await wallet.getAddress();
    const expiration: number = Math.round(Date.now() / 1000 + 30);
    const message: string = `${address}-${expiration}`;
    const signature = await wallet.signMessage(message);
    return `${signature}-${message}`;
  };

  return (
    <div className="App">
      {deepLinkHref === "" ? (
        <div>Please Wait...</div>
      ) : (
        <>
          <a className="Link" href={deepLinkHref}>
            <button className="Login Button"> Continue </button>
          </a>
          <button onClick={onLogOut} className="Logout Button"> Logout </button>
        </>
      )}
    </div>
  );
}

export default App;
