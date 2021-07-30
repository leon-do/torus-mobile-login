import "./App.css";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { ethers } from "ethers";

const openlogin = new OpenLogin({
  clientId:
    "BFFZOyDfs-K02CgDFpGVzX6A30EcaMCMoUoXkXwoyEbPuL7OZerAKu_2CY8EDxxefaaZaLf8rg1S7COegAyB1eM",
  network: "mainnet",
});

function App() {
  const [deepLinkHref, setDeepLinkHref] = useState("");

  useEffect(() => {
    initOpenLogin();
    // eslint-disable-next-line
  }, []);

  const initOpenLogin = async () => {
    // only popup for mobile
    // if (navigator.maxTouchPoints === 0) return;

    // get host from url
    const deepLinkHost: string = window.location.href.split("?")[1];

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

    // set deep link href
    setDeepLinkHref(
      `unitydl://${deepLinkHost}?${openlogin.privKey}?${address}`
    );
  };

  const onLogOut = async () => {
    await openlogin.logout();
  }

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
