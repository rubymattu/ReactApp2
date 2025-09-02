import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ManageReservation = () => {
  const { resID } = useParams();
  const [reservation, setReservation] = useState(null);
  const [status, setStatus] = useState("available");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch reservation details
  const fetchReservation = async () => {
    if (!resID) return;

    try {
      const response = await axios.get(
        `http://localhost/reactapp2/reservations/reservation_server/api/manage-reservation.php/${resID}`
      );

      const reservationData = response.data?.data;
      if (!reservationData) throw new Error("Invalid response format");

      setReservation(reservationData);
      setStatus(reservationData.isBooked === 1 ? "booked" : "available");
    } catch (error) {
      console.error("Failed to fetch reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post(
        "http://localhost/reactapp2/reservations/reservation_server/api/update-reservation.php",
        {
          id: resID,
          status: status,
        }
      );

      const message = response.data?.message || "Update complete";
      //alert(message);
      fetchReservation(); // Refresh data after update
    } catch (error) {
      console.error("Failed to update reservation:", error);
      alert("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, []); // ✅ Only run on initial mount

  if (loading) return <div>Loading reservation...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-5 text-center">Manage Reservation</h2>
      <div className="card mb-4 shadow-lg border-0 p-4">
        <div className="card-body">
          <h5 className="card-title">{reservation.name}</h5>
          <p className="card-text">Time Slot: {reservation.time}</p>
          <p className="card-text">
            Status:{" "}
            <select
              className="form-select d-inline-block w-auto"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
          </p>
          <button
            className="btn btn-light text-light" 
            style={{ backgroundColor: "#2E8B57", color: "white" }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageReservation;
