import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowsRotate } from "react-icons/fa6";

const DashboardEmployee = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [softwares, setSoftwares] = useState([]);
  const [requests, setRequests] = useState({});
  const [approvedSoftwareList, setApprovedSoftwareList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || !storedUsername) {
      navigate("/login");
      return;
    }

    setUsername(storedUsername);
    setRole(storedRole);

    // Fetch software list
    fetch(`${API_URL}/api/software`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const reversed = data.reverse();
        setSoftwares(reversed);
      })
      .catch((err) => console.error("Error fetching software:", err));

    fetchMyRequests();
  }, [navigate]);

  // 🔄 Refreshable request fetch
  const fetchMyRequests = async () => {
    const token = localStorage.getItem("token");
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/requests/myrequests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const reqStatusMap = {};
      const approved = [];

      data.forEach((req) => {
        reqStatusMap[req.software._id] = req.status;
        if (req.status === "Approved") {
          approved.push(req.software);
        }
      });

      setRequests(reqStatusMap);
      setApprovedSoftwareList(approved);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubmitRequest = async (softwareId, accessType, reason, closeForm) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ softwareId, accessType, reason }),
      });
      const data = await res.json();
      setRequests((prev) => ({ ...prev, [softwareId]: data.status }));
      closeForm();
    } catch (err) {
      console.error("Request submission failed:", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(softwares.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentSoftwares = softwares.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white">
      {/* Navbar */}
      <nav className="bg-purple-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </nav>

      {/* Welcome Card */}
      <div className="flex justify-center mt-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 w-[90%] text-center border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            Welcome, {username}!
          </h2>
          <p className="text-gray-600">
            Your role is <strong>{role}</strong>. You can request access to software.
          </p>
        </div>
      </div>

      {/* Section Header with Refresh Button */}
      <div className="flex justify-center items-center mt-10 mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-purple-700">Available Softwares</h2>
        <button
          onClick={fetchMyRequests}
          title="Refresh Requests"
          className="text-purple-700 text-xl hover:text-purple-900 transition"
        >
          <FaArrowsRotate className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Software Cards */}
      <div className="flex flex-wrap justify-center gap-6 px-6 pb-10">
        {currentSoftwares.map((software) => (
          <SoftwareCard
            key={software._id}
            software={software}
            status={requests[software._id]}
            onRequestSubmit={handleSubmitRequest}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center pb-10 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 rounded bg-purple-500 text-white disabled:bg-gray-300"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-purple-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 rounded bg-purple-500 text-white disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const SoftwareCard = ({ software, status, onRequestSubmit }) => {
  const [showForm, setShowForm] = useState(false);
  const [accessType, setAccessType] = useState("");
  const [reason, setReason] = useState("");

  const cardColor =
    status === "Approved"
      ? "bg-green-100 border-green-300"
      : status === "Pending"
      ? "bg-orange-100 border-orange-300"
      : "bg-white border-gray-200";

  return (
    <div className={`w-80 p-6 rounded-lg shadow-md border ${cardColor} transition-all`}>
      <h3 className="text-xl font-bold text-purple-700 mb-2">{software.name}</h3>
      <p className="text-gray-600 mb-4">{software.description}</p>

      {status === "Approved" ? (
        <p className="text-sm text-green-700 font-semibold">Access Approved</p>
      ) : status === "Pending" ? (
        <p className="text-sm text-orange-700 font-semibold">Request Pending</p>
      ) : (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition mb-2"
        >
          Request Access
        </button>
      )}

      {showForm && (
        <div className="mt-2">
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Access Type</option>
            {software.accessLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={() =>
              onRequestSubmit(software._id, accessType, reason, () => setShowForm(false))
            }
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition w-full"
          >
            Submit Request
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardEmployee;
