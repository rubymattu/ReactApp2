import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ManageReservation = () => {
  const { resID } = useParams();
  const [reservation, setReservation] = useState(null);
  const [reservationName, setReservationName] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [isBooked, setIsBooked] = useState(0); // 0 = available, 1 = booked
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch reservation details
  const fetchReservation = async () => {
    if (!resID) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.get(
        `http://localhost/reactapp2/reservations/reservation_server/api/manage-reservation.php/${resID}`,
        { withCredentials: true }
      );

      const reservationData = response.data?.data;
      if (!reservationData) throw new Error("Invalid response format");

      setReservation(reservationData);
      setReservationName(reservationData.reservationName || "");
      // console.log("Fetched time:", reservationData.reservationTime);

      setReservationTime(
        reservationData.reservationTime || "9:00 am - 12 noon"
      );
      setIsBooked(parseInt(reservationData.isBooked, 10));
    } catch (err) {
      console.error("Failed to fetch reservation:", err);
      setError("Failed to fetch reservation details.");
    } finally {
      setLoading(false);
    }
  };

  // Update reservation
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost/reactapp2/reservations/reservation_server/api/update-reservation.php",
        {
          id: resID,
          reservationName,
          reservationTime,
          isBooked,
        },
        { withCredentials: true }
      );
      // console.log("Backend response:", response.data);
      if (response.data.status === "success") {
        setSuccess(response.data.message);
        fetchReservation();
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError(response.data.message || "Failed to update reservation.");
      }
    } catch (err) {
      console.error("Failed to update reservation:", err);
      setError("Failed to update reservation.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchReservation();
    // eslint-disable-next-line
  }, [resID]);

  if (loading) return <div>Loading reservation...</div>;

  return (
    <div className="container-sm mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="mb-5 text-center">Manage Reservation</h2>

      <div className="card mb-4 shadow-lg border-0 p-4">
        <div className="row g-0 align-items-center">
          <div className="col-md-8">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <div className="mb-3">
                <label className="form-label">Reservation Name:</label>
                <input
                  type="text"
                  className="form-control"
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                  placeholder="Enter reservation name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Time Slot:</label>
                <select
                  className="form-select"
                  value={reservationTime}
                  onChange={(e) => setReservationTime(e.target.value)}
                >
                  <option value="9:00 am - 12:00 noon">9:00 am - 12:00 noon</option>
                  <option value="12:00 noon - 3:00 pm">12:00 noon - 3:00 pm</option>
                  <option value="3:00 pm - 6:00 pm">3:00 pm - 6:00 pm</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Status:</label>
                <select
                  className="form-select"
                  value={isBooked}
                  onChange={(e) => setIsBooked(parseInt(e.target.value))}
                >
                  <option value={0}>Available</option>
                  <option value={1}>Booked</option>
                </select>
              </div>

              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Reservation"}
              </button>
            </div>
          </div>

          {reservation.imageName && (
            <div className="col-md-4 text-center">
              <img
                src={`http://localhost/reactapp2/reservations/reservation_server/api/uploads/${reservation.imageName}`}
                alt={reservation.reservationName}
                className="img-fluid rounded"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReservation;
