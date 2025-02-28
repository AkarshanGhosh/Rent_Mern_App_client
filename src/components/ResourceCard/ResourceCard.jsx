import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ResourceCard = ({ data }) => {
  const resourceUrl = data?.url || "#";

  console.log("Resource Link:", resourceUrl);

  return (
    <Link to={`/view-resource-details/${data._id}`}>
      <div className="bg-yellow-100 rounded-lg p-4 flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="bg-white rounded-lg flex items-center justify-center">
          <img
            src={data.image || "https://via.placeholder.com/150"}
            alt={data.title || "Resource"}
            className="w-full h-[25vh] object-cover rounded-lg"
          />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">{data.title}</h2>
        <p className="mt-2 text-gray-500 font-semibold">by {data.description || "Unknown"}</p>
        <p className="mt-2 text-yellow-600 font-semibold">Category: {data.category}</p>
        <p className="mt-2 text-yellow-600 font-semibold">Price: {data.rental_price}</p>
      </div>
    </Link>
  );
};

ResourceCard.propTypes = {
  data: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string, // Changed from author
    image: PropTypes.string,
    category: PropTypes.string,
    rental_price: PropTypes.number, // Added rental_price
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ResourceCard;
