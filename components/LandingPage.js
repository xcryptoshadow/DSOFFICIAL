import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import Footer from "../components/Footer";

const LandingPage = ({ Web3Handler, account }) => {
  return (
    <div>
      <div data-theme="halloween">
        <div className=" from-primary to-secondary text-primary-content -mt-[4rem] grid place-items-center items-end bg-gradient-to-br pt-20">
          <div className="hero-content col-start-1 row-start-1 w-full max-w-7xl flex-col justify-between gap-10 pb-40 lg:flex-row lg:items-end lg:gap-0 xl:gap-20">
            <div className="lg:pl-10 lg:pb-32">
              <div className="mb-2 py-4 text-center lg:py-10 lg:text-left">
                <h1 className="font-title mb-2 text-4xl font-extrabold sm:text-5xl lg:text-7xl">
                  DeStemr
                </h1>
                <h2 className="font-title text-lg font-extrabold sm:text-2xl lg:text-3xl">
                  The music industries new revolutionizing
                  <br /> way to create and get paid
                </h2>
              </div>
              <div className="flex w-full flex-col items-center space-y-10 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
                <div className="my-2 flex max-w-sm flex-col gap-2 text-left">
                  <div className="flex gap-2">
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Turn your sounds into profitable ERC721 NFTs
                  </div>
                  <div className="flex gap-2">
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Earn royalties in MATIC
                  </div>
                  <div className="flex gap-2">
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Change the producing game
                  </div>
                  <div className="flex gap-2">
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Quick and easy to use
                  </div>
                  <div className="flex gap-2">
                    <svg
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Inspire others to create
                  </div>
                </div>
                {/* <div className="mockup-code border-base-content w-full max-w-xs flex-1 border-2 border-opacity-20 bg-transparent pb-6 text-left text-current lg:mx-0">
                  <pre data-prefix="$">
                    <code>npm i daisyui</code>
                  </pre>
                </div> */}
                {/* replace the mockup code with next Image source of /musicrobot.png */}
                <div className="w-full max-w-xs flex-1 bg-transparent pb-6 text-left text-current lg:mx-0">
                  <Image
                    src="/musicrobot.png"
                    alt="Picture of the author ;)"
                    width={350}
                    height={350}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-1 justify-center space-x-2 lg:mt-6 lg:justify-start">
                <div
                  onClick={Web3Handler}
                  className="btn btn-ghost btn-active lg:btn-lg normal-case"
                >
                  <span className="hidden sm:inline">
                    Start by connecting your wallet
                  </span>{" "}
                  <span className="inline sm:hidden">
                    Start by connecting your wallet
                  </span>
                </div>{" "}
                {account ? (
                  <a href="/docs/install" className="btn lg:btn-lg normal-case">
                    Marketplace
                  </a>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
          <svg
            className="fill-secondary col-start-1 row-start-1 h-auto w-full"
            width="1600"
            height="595"
            viewBox="0 0 1600 595"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 338L53.3 349.2C106.7 360.3 213.3 382.7 320 393.8C426.7 405 533.3 405 640 359.3C746.7 313.7 853.3 222.3 960 189.2C1066.7 156 1173.3 181 1280 159.2C1386.7 137.3 1493.3 68.7 1546.7 34.3L1600 0V595H1546.7C1493.3 595 1386.7 595 1280 595C1173.3 595 1066.7 595 960 595C853.3 595 746.7 595 640 595C533.3 595 426.7 595 320 595C213.3 595 106.7 595 53.3 595H0V338Z"></path>
          </svg>
        </div>
      </div>

      <div className="pt-24 px-10 bg-white">
        <div className="hero h-128">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <Image src="/otherrobo.png" width={400} height={400} />

            <div>
              <h1 className=" text-7xl font-bold leading-[1.2] bg-gradient-to-r from-primary via-orange-500 to-secondary bg-clip-text  text-transparent">
                How DeStemr Works
              </h1>
              <p className="py-6">
                For more information on how DeStemr works and is built, please
                click on learn more below!
              </p>
              <label
                htmlFor="my-modal-6"
                className="relative inline-block text-lg group cursor-pointer"
              >
                <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border border-gray-900 rounded-lg group-hover:text-black">
                  <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                  <span className="absolute left-0 w-48 h-48 -ml-3 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12  bg-[#bef264] group-hover:-rotate-180 ease"></span>
                  <span className="relative">Learn More</span>
                </span>
                <span
                  className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-[#bef264] rounded-lg group-hover:mb-0 group-hover:mr-0 border border-black"
                  data-rounded="rounded-lg"
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* modal */}
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle border border-black">
        <div className="modal-box">
          <h3 className="font-bold text-lg">how DeStemr works</h3>
          <p className="py-4">
            DeStemr is built on the Polygon network. DeStemr is made for music
            producers who want to sell their sounds, such as drums, Serum
            Presets, etc. Any sound you can produce can be sold on DeStemr.{" "}
          </p>
          <p className="py-4">
            Once you select your file, you will be able to set a listing price,
            supply, and a royalty percentage. The royalty percentage is the
            percentage of the sale price that you will receive. For example, if
            you set the royalty percentage to 50%, and the sale price to 1
            MATIC, you will receive 0.5 MATIC for every sale.
          </p>
          <div className="modal-action">
            <label
              htmlFor="my-modal-6"
              className="relative inline-block text-lg group cursor-pointer"
            >
              <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border border-gray-900 rounded-lg group-hover:text-black">
                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                <span className="absolute left-0 w-48 h-48 -ml-3 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12  bg-[#FFD878] group-hover:-rotate-180 ease"></span>
                <span className="relative">Close</span>
              </span>
              <span
                className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-[#FFD878] rounded-lg group-hover:mb-0 group-hover:mr-0 border border-black"
                data-rounded="rounded-lg"
              ></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
