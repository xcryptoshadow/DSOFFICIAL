<div>
  <Head>
    <title>Create Next App</title>
    <link rel="icon" href="/favicon.ico" />
  </Head>

  <button onClick={Web3Handler}>Connect</button>
  {account && <h1>{account}</h1>}

  <div className="form-control">
    <label className="label">
      <span className="label-text">stem name</span>
    </label>
    <input
      type="text"
      placeholder="name"
      className="input input-bordered"
      onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
      required
    />
  </div>
  <div>
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
  <div className="grid grid-cols-2 gap-4  py-5 px-5">
    {/* example card */}
    {nfts.map((nft, i) => (
      <div onContextMenu={(e) => e.preventDefault()} key={i}>
        <div>
          <h2 className="card-title"></h2>
          <figure>
            <audio controls controlsList="nodownload">
              <source src={nft.image} type="audio/mpeg" />
            </audio>
          </figure>
          <p className="card-text">
            <strong>Title:</strong> {nft.name}
          </p>
          <p className="card-text">
            <strong>Description: </strong>
            {nft.description}
          </p>
          <p className="card-text">
            <strong>Stemr:</strong> {nft.seller.slice(0, 5)}...
            {nft.seller.slice(-4)}
          </p>

          <div>
            <div>
              <div>Price</div>
              <div>{Web3.utils.fromWei(nft.price, "ether")}</div>
              <div>MATIC</div>
            </div>
            <div>
              <div>Supply</div>
              <div>{nft.supply === "0" ? "∞" : nft.supply}</div>
              <div className="stat-desc font-bold">MATIC/song</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Royalty</div>
              <div className="stat-value">{nft.royalty}</div>
              <div className="stat-desc font-bold">percent</div>
            </div>
          </div>

          <div className="card-actions ">
            <div
              onClick={() => buyNft(nft)}
              className="relative inline-block px-4 py-2 font-medium group cursor-pointer w-full"
            >
              <span className="rounded-xl absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-[#77DD77] group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="rounded-xl absolute inset-0 w-full h-full bg-white border border-black group-hover:bg-[#77DD77]"></span>
              <span className="relative text-black group-hover:text-black text-center items-center flex flex-col">
                buy
              </span>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>;
