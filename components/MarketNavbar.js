import { useEffect, useState } from "react";
import Web3 from "web3";
import toast from "react-hot-toast";

const MarketNavbar = () => {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  useEffect(() => {
    loadBlockchainData();
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 0) {
        navbar.setAttribute("data-theme", "light");
        navbar.style.transition = "all 0.2s ease";
      } else {
        navbar.removeAttribute("data-theme");
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
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
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div id="navbar" className="navbar sticky top-0 z-50 text-black bg-white">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li tabIndex={0}>
              <a className="justify-between">
                Parent
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex ">
        <ul className="menu menu-horizontal p-0">
          <li>
            <a href="/marketplace" className="btn btn-ghost">
              Marketplace
            </a>
          </li>
          <li>
            <a href="/my-listed-nfts" className="btn btn-ghost">
              My Listed Stems
            </a>
          </li>
          <li>
            <a href="my-nfts" className="btn btn-ghost">
              My Owned Stems
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {account ? (
          <button className="btn ">
            {account.slice(0, 5)}...{account.slice(-4)}
          </button>
        ) : (
          <button className="btn" onClick={Web3Handler}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketNavbar;
