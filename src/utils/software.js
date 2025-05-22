const API_URL = "http://localhost:5000";


export const createSoftware = async (softwareData) => {
  const token = localStorage.getItem("token"); // assuming token is stored after login/signup
  console.log(token);

  const response = await fetch(`${API_URL}/api/software`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(softwareData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create software");
  }

  return await response.json();
};



// utils/software.js

export const fetchAdminSoftware = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please log in again.");
  }

  const res = await fetch(`${API_URL}/api/software`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch software.");
  }

  return data; 
};

