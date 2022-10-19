import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Web3 from "web3";

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  const Web3Handler = async () => {
    const notification = toast.loading("Connecting account...");
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const web3 = new Web3(window.ethereum);
      setAccount(account[0]);
      setWeb3(web3);
      toast.success("Account connected", {
        id: notification,
      });
      // wait 2 seconds and reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Account not connected", {
        id: notification,
      });
    }
  };

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      window.ethereum.on("accountsChanged", function (accounts) {
        window.location.reload();
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Navbar Web3Handler={Web3Handler} account={account} />
      <Component {...pageProps} />
      <Toaster />
    </div>
  );
}

export default MyApp;
