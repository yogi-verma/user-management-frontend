import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAdminSoftware } from "../utils/software";

const ITEMS_PER_PAGE = 4;

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [softwareList, setSoftwareList] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);

  const fetchPendingRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/requests/pending", {
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
      loadSoftware();
      fetchPendingRequests();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const loadSoftware = async () => {
    try {
      const data = await fetchAdminSoftware();
      setSoftwareList(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateRequestStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchPendingRequests();
      } else {
        console.error("Failed to update request status");
      }
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  };

  const totalPages = Math.ceil(softwareList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = softwareList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white">
      <nav className="bg-purple-700 text-white py-4 px-6 flex justify-between items-center shadow-md relative">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowRequestsDropdown((prev) => !prev)}
              className="relative focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {pendingRequests.length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-600"></span>
              )}
            </button>

            {showRequestsDropdown && (
              <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Pending Requests</h4>
                {pendingRequests.length === 0 ? (
                  <p className="text-gray-500">No pending requests.</p>
                ) : (
                  <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {pendingRequests.map((req) => (
                      <li key={req._id} className="border-b pb-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {req.software?.name} - {req.user?.username}
                        </p>
                        <p className="text-xs text-gray-500">Reason: {req.reason}</p>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => updateRequestStatus(req._id, "Approved")}
                            className="text-green-600 hover:underline text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req._id, "Rejected")}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex justify-center mt-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[90%] text-center border border-purple-200">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Welcome to the Dashboard, {username}!
          </h2>
          <p className="text-gray-600 mb-6">
            You have admin privileges. Manage software access easily.
          </p>
          <button
            onClick={() => navigate("/dashboard/admin/create-software")}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition font-medium"
          >
            Create Software
          </button>
        </div>
      </div>

      <div className="mt-10 px-6">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">All Created Software</h3>
        {error && <p className="text-red-500">{error}</p>}
        {softwareList.length === 0 ? (
          <p className="text-gray-600">No software created yet.</p>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paginatedList.map((software) => (
                <div key={software._id} className="bg-white p-4 shadow rounded-lg border border-purple-100">
                  <h4 className="text-lg font-bold text-purple-700">{software.name}</h4>
                  <p className="text-gray-700">{software.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Access Levels: {software.accessLevels.join(", ")}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8 mb-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-purple-500 text-purple-600 rounded hover:bg-purple-100 disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-purple-700 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-purple-500 text-purple-600 rounded hover:bg-purple-100 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
