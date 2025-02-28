import { useState, useEffect } from "react";
import ResourceCard from "../ResourceCard/ResourceCard";
import axios from "axios";
import Loader from "../Loder";

const RecentlyAdded = () => {
  const [data, setData] = useState([]); // Ensure data is always an array
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/items/allitems");

        // ✅ Ensure response structure is correct
        if (response.data && response.data.data) {
          setData(response.data.data.slice(0, 4)); // ✅ Limit results to first 4 items
        } else {
          setData([]); // ✅ Set empty array if response is incorrect
        }
      } catch (error) {
        console.error("Error fetching recently added resources:", error);
        setData([]); // ✅ Prevents `undefined` errors
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-200">Recently Added Resources</h4>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* ✅ Ensure data is always an array before calling `.length` */}
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, i) => <ResourceCard key={i} data={item} />)
          ) : (
            <p className="text-yellow-400">No resources found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
