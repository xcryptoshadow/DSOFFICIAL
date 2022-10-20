import Web3 from "web3";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import MarketNavbar from "../components/MarketNavbar";
import Marketplace from "../backend/build/contracts/Marketplace.json";
import NFT from "../backend/build/contracts/NFT.json";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const marketPlaceContract = new web3.eth.Contract(
      Marketplace.abi,
      Marketplace.networks[networkId].address
    );
    const NFTContractAddress = NFT.networks[networkId].address;
    const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
    const accounts = await web3.eth.getAccounts();
    const data = await marketPlaceContract.methods
      .getMyNfts()
      .call({ from: accounts[0] });

    const nfts = await Promise.all(
      data.map(async (i) => {
        try {
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          let nft = {
            price: i.price,
            supply: i.supply,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,

            tokenURI: tokenURI,
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

  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
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
              My Owned Stems
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
                        onClick={() => listNFT(nft)}
                      >
                        Resell Stem
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
                <a
                  href="/marketplace"
                  htmlFor="my-modal-3"
                  className="btn btn-primary modal-button "
                >
                  Create Stem
                </a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
