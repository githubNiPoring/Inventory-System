import stocksIn from "/meme/stocksIn.mp4";

const StocksIn = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">STOCKS IN</h1>{" "}
      <video
        controls
        autoPlay
        // muted
        playsInline
        loop
        className="w-full rounded"
      >
        <source src={stocksIn} type="video/mp4" />
      </video>
    </div>
  );
};

export default StocksIn;
