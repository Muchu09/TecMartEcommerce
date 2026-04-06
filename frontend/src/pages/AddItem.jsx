import { useState } from "react";

export default function AddItem() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "For Sale",
    image: null,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Item
        </h2>

        <form className="space-y-5">
          
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Item Name
            </label>
            <input
              type="text"
              placeholder="Enter item name"
              className="px-4 py-3"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Write a short description..."
              className="px-4 py-3 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Item Type
            </label>
            <select
              className="px-4 py-3"
            >
              <option>For Sale</option>
              <option>For Rent</option>
              <option>Free</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Upload Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer" style={{ 'transition': 'all 0.3s' }}>
                <span className="text-gray-500 text-sm">
                  Click to upload or drag and drop
                </span>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
