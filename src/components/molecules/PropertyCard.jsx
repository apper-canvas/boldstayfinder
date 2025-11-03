import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { toast } from "react-toastify";

const PropertyCard = ({ property, onWishlistToggle }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlistToggle(property.Id, !isWishlisted);
    
    if (!isWishlisted) {
      toast.success("Added to wishlist");
    } else {
      toast.info("Removed from wishlist");
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    if (direction === "next") {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <Card onClick={handleCardClick} className="overflow-hidden">
      <div className="relative aspect-[4/3] group">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Wishlist Button */}
<div className="relative group">
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 p-2 rounded-full heart-animation ${
              isWishlisted ? "bg-white/90 text-primary" : "bg-white/70 text-gray-700"
            } hover:bg-white/90 transition-all`}
          >
            <ApperIcon 
              name={isWishlisted ? "Heart" : "Heart"} 
              size={16} 
              className={isWishlisted ? "fill-current" : ""}
            />
          </button>
          
          {/* Login tooltip for guests */}
          <div className="absolute top-14 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            <div className="relative">
              Log in to save favorites permanently
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => handleImageNavigation(e, "prev")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={(e) => handleImageNavigation(e, "next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <ApperIcon name="Star" size={14} className="text-accent fill-current" />
            <span className="text-sm font-medium">{property.rating}</span>
            <span className="text-sm text-gray-500">({property.reviewCount})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          {property.location.city}, {property.location.country}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {property.capacity.guests} guest{property.capacity.guests > 1 ? "s" : ""} • {property.capacity.bedrooms} bedroom{property.capacity.bedrooms > 1 ? "s" : ""}
          </div>
          <div className="text-right">
            <span className="font-semibold text-gray-900">
              ${property.pricing.nightlyRate}
            </span>
            <span className="text-gray-600 text-sm"> night</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;