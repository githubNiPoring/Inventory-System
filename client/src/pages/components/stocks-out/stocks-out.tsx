import stocksOut from "/meme/stocksOut.mp4";

const StocksOut = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">STOCKS OUT</h1>{" "}
      <video
        controls
        autoPlay
        // muted
        playsInline
        loop
        className="w-full rounded"
      >
        <source src={stocksOut} type="video/mp4" />
      </video>
    </div>
  );
};

export default StocksOut;
