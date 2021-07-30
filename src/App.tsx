import "./App.css";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { ethers } from "ethers";

function App() {
  const [deepLinkHref, setDeepLinkHref] = useState("");

  const openlogin = new OpenLogin({
    clientId: "YOUR_PROJECT_ID",
    network: "mainnet",
  });

  useEffect(() => {
    initOpenLogin();
  });

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
          <button className="App-button"> Continue to App </button>
        </a>
      )}
    </div>
  );
}

export default App;
