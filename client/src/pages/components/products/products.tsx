import products from "/meme/products.mp4";

const Products = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">PRODUCTS</h1>{" "}
      <video
        controls
        autoPlay
        // muted
        playsInline
        loop
        className="w-full rounded"
      >
        <source src={products} type="video/mp4" />
      </video>
    </div>
  );
};

export default Products;
