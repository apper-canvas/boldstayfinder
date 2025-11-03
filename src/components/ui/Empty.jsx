import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No properties found", 
  description = "Try adjusting your search criteria or explore different locations.",
  actionText = "Clear filters",
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="MapPin" size={40} className="text-primary" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{description}</p>
      <div className="space-y-3">
        {onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-3 rounded-lg hover:from-primary/90 hover:to-primary transition-all transform hover:-translate-y-1 shadow-lg"
          >
            {actionText}
          </button>
        )}
        <p className="text-sm text-gray-500">
          Or try searching for popular destinations like Paris, Tokyo, or New York
        </p>
      </div>
    </div>
  );
};

export default Empty;