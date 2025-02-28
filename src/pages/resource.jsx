import { useState, useEffect } from "react";
import Loader from "../components/Loder";
import ResourceCard from "../components/ResourceCard/ResourceCard";
import axios from "axios";
import { TbCategory } from "react-icons/tb";

const Resource = () => {
  const [data, setData] = useState([]); // Store all items
  const [filteredData, setFilteredData] = useState([]); // Store filtered items
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Appliance", "Furniture", "Vehicle", "Gadget", "Other"];

  // **Fetch all items initially**
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/items/allitems"); // ✅ Fixed API URL
        setData(response.data); // ✅ Ensure data is stored correctly
        setFilteredData(response.data); // ✅ Set initial filtered data
        console.log("Fetched All Data:", response.data);
      } catch (error) {
        console.error("Error fetching all resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // **Fetch resources by category**
  const fetchResourcesByCategory = async (category) => {
    try {
      setLoading(true);

      if (category === "All") {
        setFilteredData(data); // Show all items if "All" is selected
      } else {
        const filtered = data.filter((item) => item.category === category);
        setFilteredData(filtered);
      }

      console.log(`Resources for category ${category}:`, filteredData);
    } catch (error) {
      console.error(`Error filtering resources by category ${category}:`, error.message);
      setFilteredData([]); // Show empty if no items found
    } finally {
      setLoading(false);
    }
  };

  // **Handle category selection**
  const handleCategoryClick = (category) => {
    console.log(`User clicked category: ${category}`);
    setSelectedCategory(category);
    fetchResourcesByCategory(category);
  };

  // **Handle search input**
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // **Filter data based on search term**
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerSearchTerm) ||
        (item.author && item.author.toLowerCase().includes(lowerSearchTerm))
    );

    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <div className="bg-zinc-900 text-white px-12 py-8 min-h-screen h-auto">
      <h4 className="text-3xl text-yellow-200">Available Products</h4>

      {/* Search Bar */}
      <div className="my-4">
        <input
          type="text"
          placeholder="Search by product name..."
          className="w-full p-2 rounded-md text-black"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 my-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              selectedCategory === category
                ? "bg-yellow-400 text-black font-bold"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <TbCategory className="mr-2" />
            {category}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Display Filtered Data */}
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => <ResourceCard key={i} data={item} />)
          ) : (
            <p className="text-yellow-400">No products found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Resource;
