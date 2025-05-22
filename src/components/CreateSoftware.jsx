import React, { useState } from "react";
import { createSoftware } from "../utils/software";
import { useNavigate } from "react-router-dom";

const CreateSoftware = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessLevels: [],
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        accessLevels: checked
          ? [...prev.accessLevels, value]
          : prev.accessLevels.filter((level) => level !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createSoftware(formData);
      navigate("/dashboard/admin");
    } catch (err) {
      setError(err.message || "Failed to create software.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg border border-purple-200">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Create New Software
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Software Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter software name"
          />

          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter description"
            rows={3}
          />

          <fieldset className="mb-6">
            <legend className="text-sm font-semibold text-gray-700 mb-2">
              Access Levels
            </legend>
            <div className="flex gap-4">
              {["Read", "Write", "Admin"].map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="accessLevels"
                    value={level}
                    checked={formData.accessLevels.includes(level)}
                    onChange={handleChange}
                    className="accent-purple-600"
                  />
                  {level}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Create Software
          </button>
        </form>

        <button
          onClick={() => navigate("/dashboard/admin")}
          className="w-full mt-4 text-purple-600 border border-purple-500 py-2 rounded-lg hover:bg-purple-100 transition font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CreateSoftware;
