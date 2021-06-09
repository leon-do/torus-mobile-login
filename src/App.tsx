import { useEffect } from "react";
import Torus from "@toruslabs/torus-embed";
import Web3 from "web3";

function App() {
  useEffect(() => {
    initTorus();
  });

  const initTorus = async () => {
    const torus: Torus = new Torus({});
    try {
      await torus.init({});
      await torus.login({});
      const web3: Web3 = new Web3(torus.provider);
      const signedMessage: string = await signMessage(web3);
      console.log(signedMessage);
    } catch (err) {
      console.error(err);
      await torus.cleanUp();
      initTorus();
    }
  };

  const signMessage = async (web3: Web3): Promise<string> => {
    const from: string = (await web3.eth.getAccounts())[0];
    const expiration: number = Math.round(Date.now() / 1000 + 30);
    const message: string = `${from}-${expiration}`;
    const signature: string = await web3.eth.personal.sign(message, from, "");
    return `${signature}-${message}`;
  };

  return <div className="App"></div>;
}

export default App;
