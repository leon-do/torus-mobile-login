import "./App.css";
import { useState, useEffect } from "react";
import OpenLogin from "@toruslabs/openlogin";

const openlogin = new OpenLogin({
  clientId:
    "BFFZOyDfs-K02CgDFpGVzX6A30EcaMCMoUoXkXwoyEbPuL7OZerAKu_2CY8EDxxefaaZaLf8rg1S7COegAyB1eM",
  network: "mainnet",
  uxMode: "popup",
});

function App() {
  const [deepLinkHref, setDeepLinkHref] = useState("");
  const [status, setStatus] = useState("Please Wait...");

  useEffect(() => {
    initOpenLogin();
    // eslint-disable-next-line
  }, []);

  const initOpenLogin = async () => {
    // only popup for mobile
    if (navigator.maxTouchPoints === 0) {
      setStatus("Connect with Mobile");
      return;
    }

    await openlogin.init();
    if (!openlogin.privKey) {
      await openlogin.login();
    }

    // set deep link href
    setDeepLinkHref(
      `unitydl://unity?${openlogin.privKey}`
    );
  };

  const onLogOut = async () => {
    await openlogin.logout();
    window.location.reload();
  };

  return (
    <div className="App">
      {deepLinkHref === "" ? (
        <div>{status}</div>
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
