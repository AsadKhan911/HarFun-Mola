import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CategoryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const category = location.state?.category;

  if (!category) {
    // Handle if user accesses directly without state
    return (
      <div className="p-4">
        <p className="text-gray-600">No category selected. Go back to <span onClick={() => navigate(-1)} className="text-blue-600 underline cursor-pointer">categories</span>.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h2>
      <h4 className="font-medium text-gray-700 mb-2">Services:</h4>
      <ul className="space-y-2">
        {category.predefinedServices?.map((svc, idx) => (
          <li key={idx} className="bg-gray-50 p-2 rounded">
            <p className="font-medium">{svc.serviceName}</p>
            {svc.pricingOptions?.length > 0 && (
              <div className="mt-1">
                <span className="text-sm text-gray-600">Options: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {svc.pricingOptions.map((opt, optIdx) => (
                    <span key={optIdx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {opt.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDetails;
