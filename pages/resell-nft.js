import { useEffect, useState } from "react";
import Web3 from "web3";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";

import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({
    price: "",
    image: "",
    royalty: "",
  });
  const router = useRouter();
  const { id, tokenURI } = router.query;
  const { image, price, royalty } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) {
      return;
    } else {
      const meta = await axios.get(tokenURI);
      updateFormInput((state) => ({ ...state, image: meta.data.image }));
    }
  }

  async function listNFTForSale() {
    if (!price) {
      return;
    } else {
      const notification = toast.loading("Listing NFT for sale...");

      try {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const marketPlaceContract = new web3.eth.Contract(
          Marketplace.abi,
          Marketplace.networks[networkId].address
        );
        let listingFee = await marketPlaceContract.methods
          .getListingFee()
          .call();
        listingFee = listingFee.toString();
        const accounts = await web3.eth.getAccounts();
        marketPlaceContract.methods
          .resellNft(
            NFT.networks[networkId].address,
            id,
            Web3.utils.toWei(formInput.price, "ether"),
            formInput.royalty
          )
          .send({ from: accounts[0], value: listingFee })
          .on("receipt", function () {
            console.log("listed");
            toast.success("NFT listed for sale!", {
              id: notification,
            });
            router.push("/marketplace");
          });
      } catch (err) {
        console.log(err);
        toast.error("Error listing NFT for sale", {
          id: notification,
        });
      }
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input
          placeholder="Royalty"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, royalty: e.target.value })
          }
        />
        {image && <img className="rounded mt-4" width="350" src={image} />}
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-teal-400 text-white rounded p-4 shadow-lg"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
