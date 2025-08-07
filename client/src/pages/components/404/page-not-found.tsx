import Cat from "/404-cat.png";
import { useNavigate } from "react-router-dom";

const Pagenotfound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };
  return (
    <div className="flex items-center w-screen h-screen p-3 bg-base">
      <div className="container flex flex-col items-center justify-center px-5 text-gray-700 md:flex-row">
        <div className="max-w-md">
          <div className="text-5xl font-bold text-accent">404</div>
          <p className="text-2xl font-light leading-normal text-accent md:text-3xl">
            Sorry we couldn't find this page.{" "}
          </p>
          <p className="mb-8 text-accent">
            But dont worry, you can find plenty of other things on our homepage.
          </p>

          <button
            className="inline px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg shadow focus:outline-none focus:shadow-outline-blue active:bg-blue-600 hover:bg-blue-700"
            onClick={handleGoHome}
          >
            back to homepage
          </button>
        </div>
        <div className="max-w-lg">
          <img src={Cat} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Pagenotfound;
