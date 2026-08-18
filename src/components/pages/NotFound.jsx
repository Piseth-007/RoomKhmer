import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-[120px] md:text-[160px] font-extrabold leading-none text-blue-600">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4 text-lg">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2
                       px-6 py-3 rounded-xl
                       bg-blue-600 text-white font-semibold
                       hover:bg-blue-700 transition"
          >
            <Home size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2
                       px-6 py-3 rounded-xl
                       border border-gray-300 bg-white
                       text-gray-700 font-semibold
                       hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
