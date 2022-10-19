import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import toast from "react-hot-toast";
import axios from "axios";
import Marquee from "react-fast-marquee";

import LandingPage from "../components/LandingPage";

import Web3 from "web3";
import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";

const Home = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    supply: "",
    royalty: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    loadBlockchainData();
    loadNFTs();
  }, [account]);

  const ipfsClient = require("ipfs-http-client");
  const projectId = "2FdliMGfWHQCzVYTtFlGQsknZvb";
  const projectSecret = "2274a79139ff6fdb2f016d12f713dca1";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

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

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price, supply, royalty } = formInput;
    if (!name || !description || !price || !supply || !royalty || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url;
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }

  async function listNFTForSale() {
    const notification = toast.loading(
      "Make sure to confirm both transactions!"
    );

    try {
      // const web3Modal = new Web3Modal();
      // const provider = await web3Modal.connect();
      // const web3 = new Web3(provider);
      // const url = await uploadToIPFS();
      // const networkId = await web3.eth.net.getId();

      // do the code above but do not use web3Modal
      const web3 = new Web3(window.ethereum);
      const provider = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const url = await uploadToIPFS();
      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      const NFTContractAddress = NFT.networks[networkId].address;
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();
      const marketPlaceContract = new web3.eth.Contract(
        Marketplace.abi,
        Marketplace.networks[networkId].address
      );
      let listingFee = await marketPlaceContract.methods.getListingFee().call();
      listingFee = listingFee.toString();
      setLoading(true);
      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          console.log("minted");
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          marketPlaceContract.methods
            .listNft(
              NFTContractAddress,
              tokenId,
              Web3.utils.toWei(formInput.price, "ether"),
              formInput.supply,
              formInput.royalty
            )
            .send({ from: accounts[0], value: listingFee })
            .on("receipt", function () {
              console.log("listed");
              toast.success("Stem created", { id: notification });
              setLoading(false);
              // wait 2 seconds, then reload the page
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            });
        });
    } catch (error) {
      console.log(error);
      toast.error("Error creating stem", { id: notification });
    }
  }

  async function loadNFTs() {
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const marketPlaceContract = new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkId].address
    );
    const listings = await marketPlaceContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            price: i.price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            supply: i.supply,
            royalty: i.royalty,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const notification = toast.loading("Buying Stem...");

    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();
      const marketPlaceContract = new web3.eth.Contract(
        Marketplace.abi,
        Marketplace.networks[networkId].address
      );
      const accounts = await web3.eth.getAccounts();
      await marketPlaceContract.methods
        .buyNft(NFT.networks[networkId].address, nft.tokenId)
        .send({ from: accounts[0], value: nft.price });
      toast.success("Stem bought! Check it out in the 'my stems' tab ", {
        id: notification,
      });
      loadNFTs();
    } catch (err) {
      console.log(err);
      toast.error("Error buying Stem", {
        id: notification,
      });
    }
  }

  return (
    <div>
      <LandingPage Web3Handler={Web3Handler} account={account} />
    </div>
  );
};

export default Home;
