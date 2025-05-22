import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardManager = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);

  const API_URL = "https://user-management-backend-lake.vercel.app/";

  const fetchPendingRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`{API_URL}/api/requests/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!storedUsername || !storedRole || !token) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
      setRole(storedRole);
      fetchPendingRequests();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const updateRequestStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh the list after update
        fetchPendingRequests();
      } else {
        console.error("Failed to update request status");
      }
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white">
      {/* Navbar */}
      <nav className="bg-purple-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-purple-100 transition"
        >
          Logout
        </button>
      </nav>

      {/* Welcome Card */}
      <div className="mx-auto mt-8 bg-white shadow-xl rounded-2xl p-8 w-[90%] border border-purple-300 text-center">
        <h2 className="text-2xl font-semibold text-purple-700 mb-2">
          Welcome, {username}!
        </h2>
        <p className="text-gray-700 mb-4">
          Your role: <span className="font-medium">{role}</span>
        </p>
        <p className="text-gray-600">
          This is your manager dashboard. Review and manage pending access requests.
        </p>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-purple-700 text-center mt-10">
        Pending Access Requests
      </h2>

      {/* Pending Requests List */}
      <div className="flex flex-wrap justify-center gap-6 px-6 py-10">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <div
              key={req._id}
              className="w-96 p-6 bg-white rounded-lg shadow-md border border-yellow-300"
            >
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                User: <span className="text-gray-800">{req.user?.username || "N/A"}</span>
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Software:</strong> {req.software?.name || "N/A"}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Access Type:</strong> {req.accessType}
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Reason:</strong> {req.reason}
              </p>
              <p className="text-sm text-yellow-600 font-semibold mb-3">
                Status: {req.status}
              </p>

              <div className="flex justify-between">
                <button
                  onClick={() => updateRequestStatus(req._id, "Approved")}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateRequestStatus(req._id, "Cancelled")}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No pending requests found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardManager;
