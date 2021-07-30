import "./App.css";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { ethers } from "ethers";

function App() {
  const [deepLinkHref, setDeepLinkHref] = useState("");

  const openlogin = new OpenLogin({
    clientId: "BFFZOyDfs-K02CgDFpGVzX6A30EcaMCMoUoXkXwoyEbPuL7OZerAKu_2CY8EDxxefaaZaLf8rg1S7COegAyB1eM",
    network: "mainnet",
    redirectUrl: `${window.origin}`,
  });

  useEffect(() => {
    initOpenLogin();
    // eslint-disable-next-line
  }, []);

  const initOpenLogin = async () => {
    // only popup for mobile
    // if (navigator.maxTouchPoints === 0) return;
    await openlogin.init();
    if (!openlogin.privKey) {
      await openlogin.login();
    }
    // get address
    const wallet = new ethers.Wallet(
      openlogin.privKey,
      ethers.getDefaultProvider()
    );
    const address = await wallet.getAddress();
    // set href
    const deepLinkHost: string = window.location.href.split("?")[1];
    setDeepLinkHref(
      `unitydl://${deepLinkHost}?${openlogin.privKey}?${address}`
    );
  };

  return (
    <div className="App">
      {deepLinkHref === "" ? (
        <div></div>
      ) : (
        <a href={deepLinkHref}>
          <button className="App-button"> Continue </button>
        </a>
      )}
    </div>
  );
}

export default App;
