import reports from "/meme/reports.mp4";

const Reports = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold">REPORTS</h1>{" "}
      <video
        controls
        autoPlay
        // muted
        playsInline
        loop
        className="w-full rounded"
      >
        <source src={reports} type="video/mp4" />
      </video>
    </div>
  );
};

export default Reports;
