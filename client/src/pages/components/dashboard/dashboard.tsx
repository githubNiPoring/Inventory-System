import dashboard from "/meme/dashboard.mp4";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">DASHBOARD</h1>{" "}
      <video
        controls
        autoPlay
        // muted
        playsInline
        loop
        className="w-full rounded"
      >
        <source src={dashboard} type="video/mp4" />
      </video>
    </div>
  );
};

export default Dashboard;
