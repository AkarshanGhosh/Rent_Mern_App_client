import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Loder"; 
import { FaShoppingCart, FaExternalLinkAlt } from "react-icons/fa";

const ViewResources = () => {
  const { id } = useParams(); // Extract resource ID from the URL
  const location = useLocation(); // Access location state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:3000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(response.data.userData); // Store user data
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    // Fetch resource data
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/items/${id}`);
        setData(response.data); // ✅ Fix: Ensure correct API response handling
      } catch (error) {
        console.error("Error fetching resource:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchData();
  }, [id]);

  const headers = userData
    ? {
        id: userData._id, // ✅ Fix: Ensure correct user ID is passed
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
        resourceId: id,
      }
    : {};

  const handleReadLater = async () => {
    try {
      const response = await axios.put(
        "",// add to cart api
        {},
        { headers }
      );
      setNotification(response.data.message || "Added to Cart!");
    } catch (error) {
      setNotification("Failed to add to Cart.");
    }
  };

  const handleRemoveFromReadLater = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/readlater/remove-resource-from-read-later",
        {},
        { headers }
      );
      setNotification(response.data.message || "Removed from Cart!");
    } catch (error) {
      setNotification("Failed to remove from Cart.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-red-500">Failed to load resource. Please try again later.</p>
      </div>
    );
  }

  return (
    data && (
      <div className="h-full w-full bg-zinc-900 flex flex-col items-start px-8 py-8">
        {notification && (
          <div className="w-full max-w-lg mx-auto p-4 bg-red-500 text-white text-center font-bold rounded-lg mb-6">
            {notification}
          </div>
        )}

        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-zinc-800 rounded-lg p-6">
          <div className="lg:w-1/2">
            <div className="h-[88vh] bg-zinc-900 rounded flex justify-center items-center p-4">
              <img
                src={data.images || "https://via.placeholder.com/150"}
                alt={data.title}
                className="h-full max-h-[88vh] object-contain rounded"
              />
            </div>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0 lg:ml-8">
            <h1 className="text-4xl text-white font-bold">{data.title}</h1>
            <p className="text-lg text-zinc-400 mt-2"> {data.description}</p>
            <p className="text-lg text-zinc-500 mt-4">₹{data.rental_price}</p>
            <p className="text-lg text-zinc-400 font-medium mt-4">
              Category: {data.category}
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              {isLoggedIn ? (
                <>
                  {location.state?.fromReadLater ? (
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 text-lg"
                      onClick={handleRemoveFromReadLater}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 text-lg"
                      onClick={handleReadLater}
                    >
                      <FaShoppingCart size={20} />
                      Add to Cart
                    </button>
                  )}

                  {/*  New "Model" Button */}
                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 text-lg"
                    onClick={() => {
                      // Add the model link here
                      window.open("#", "_blank");
                    }}
                  >
                    <FaExternalLinkAlt size={20} />
                    Model
                  </button>
                </>
              ) : (
                <p className="text-lg text-zinc-400 font-medium">
                  Please log in to access the actions.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ViewResources;
