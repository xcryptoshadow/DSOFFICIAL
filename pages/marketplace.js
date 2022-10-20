import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import toast from "react-hot-toast";
import axios from "axios";

import MarketNavbar from "../components/MarketNavbar";

import Web3 from "web3";
import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";
import Link from "next/link";

const MarketplaceComponent = () => {
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
    <div data-theme="emerald">
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <MarketNavbar />
          <div className="px-2">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden w-full"
            >
              Open menu
            </label>
            <h1 className="py-5 text-3xl flex flex-col text-center">
              Marketplace
            </h1>
          </div>
          {/* <div className="grid grid-cols-2  gap-4  px-4 py-2"> */}
          {/* do the same grid as above, but when the screen is small, put only 1 card per row */}
          <div className=" col-span-2 lg:col-span-1 px-8 py-2 space-y-3">
            {nfts.map((nft, i) => (
              <div
                className="flex flex-col justify-center text-center "
                key={i}
              >
                <div className="rounded-2xl bg-primary p-1 shadow-xl hover:scale-[1.03]">
                  <div className="block rounded-xl bg-white p-6 sm:p-8">
                    <figure className="flex items-center justify-center mx-auto rounded-full overflow-hidden">
                      <audio controls controlsList="nodownload">
                        <source src={nft.image} type="audio/mpeg" />
                      </audio>
                    </figure>

                    <div className="mt-4">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {nft.name}
                      </h2>
                      <p className="text-gray-600 text-sm">{nft.description}</p>
                      <p className="text-gray-600 text-sm">
                        Uploaded by:{" "}
                        {/* nft.seller but slice first 5 and last 4 */}
                        <a href={`/profile/${nft.seller}`}>
                          {nft.seller.slice(0, 5) +
                            "..." +
                            nft.seller.slice(-4)}
                        </a>
                      </p>
                    </div>

                    <div className="stats stats-vertical lg:stats-horizontal shadow">
                      <div className="stat">
                        <div className="stat-title text-xl font-bold text-black">
                          PRICE
                        </div>
                        <div className="stat-value">
                          {Web3.utils.fromWei(nft.price, "ether")}
                        </div>
                        <div className="stat-desc text-xl font-bold text-black">
                          MATIC
                        </div>
                      </div>

                      <div className="stat">
                        <div className="stat-title text-xl font-bold text-black">
                          SUPPLY
                        </div>
                        <div className="stat-value">{nft.supply}</div>
                        <div className="stat-desc text-xl font-bold text-black">
                          LEFT
                        </div>
                      </div>

                      <div className="stat">
                        <div className="stat-title text-xl font-bold text-black">
                          ROYALTY
                        </div>
                        <div className="stat-value">{nft.royalty}%</div>
                        <div className="stat-desc text-xl font-bold text-black">
                          PER SALE
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => buyNft(nft)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="drawer-side border-r border-black">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

          <ul className="menu p-2 overflow-y-auto w-80 bg-base-100 text-base-content space-y-4">
            <li>
              <div className="btn btn-ghost w-1/2">DeStemr🌿</div>
            </li>
            <div className="space-y-4 px-2">
              <li>
                <label
                  htmlFor="my-modal-3"
                  className="btn btn-primary modal-button "
                >
                  Create Stem
                </label>
              </li>
            </div>
          </ul>
        </div>
      </div>

      {/* upload modal */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg">Upload stem to DeStemr!</h3>

          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">stem name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered"
                onChange={(e) =>
                  updateFormInput({ ...formInput, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">stem description</span>
              </label>
              <input
                type="text"
                placeholder="description"
                className="input input-bordered"
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">price in MATIC</span>
              </label>
              <input
                type="number"
                placeholder="price in MATIC"
                className="input input-bordered"
                min={0}
                onChange={(e) =>
                  updateFormInput({ ...formInput, price: e.target.value })
                }
                required
              />
              <label className="label">
                <span className="label-text">supply</span>
              </label>
              <input
                type="number"
                placeholder="Supply"
                className="input input-bordered"
                min={0}
                onChange={(e) =>
                  updateFormInput({ ...formInput, supply: e.target.value })
                }
                required
              />
              <label className="label">
                <span className="label-text">royalty %</span>
              </label>
              <input
                type="number"
                placeholder="royalty split"
                className="input input-bordered"
                min={0}
                onChange={(e) =>
                  updateFormInput({ ...formInput, royalty: e.target.value })
                }
                required
              />
            </div>

            <label className="label">
              <span className="label-text">upload file</span>
            </label>
            <input
              className="input input-bordered "
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={onChange}
              required
            />
            <p className="mt-1 text-sm" id="file_input_help">
              MP3 ONLY SUPPORTED
            </p>

            {fileUrl && (
              <audio
                controls
                controlsList="nodownload"
                className="w-full rounded-xl object-cover object-center border border-black"
              >
                <source src={fileUrl} type="audio/mpeg" />
              </audio>
            )}

            <div className="form-control mt-6">
              <span className="flex flex-col items-center text-center mb-2">
                {loading && <progress className="progress w-56">yo</progress>}
              </span>
              <div
                onClick={listNFTForSale}
                className="relative inline-block px-4 py-2 font-medium group cursor-pointer"
              >
                <span className="rounded-xl absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#77DD77] group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="rounded-xl absolute inset-0 w-full h-full bg-white border border-black group-hover:bg-[#77DD77]"></span>
                <span className="relative text-black group-hover:text-black">
                  create stem
                </span>
              </div>
            </div>
          </div>
          {/* <div className="modal-action">
            <label htmlFor="my-modal" className="btn">
              Yay!
            </label>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComponent;
