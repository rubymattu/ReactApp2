import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ReservationForm() {
  const [image, setImage] = React.useState(null);
  const [reservationName, setReservationName] = React.useState("");
  const [reservationTime, setReservationTime] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  // Function to handle form validation
  const validateForm = () => {
    if (!reservationName.trim() || !reservationTime.trim()) {
      setError("All fields are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("reservationName", reservationName);
    formData.append("reservationTime", reservationTime);
    if (image) {
      formData.append("image", image);
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost/reactapp2/reservations/reservation_server/api/create-reservation.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Reservation created:", response.data);

      // Reset form after success
      setReservationName("");
      setReservationTime("");
      setImage(null);

      navigate("/"); // Go back to list
    } catch (error) {
      console.error("❌ Error creating reservation:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("There was an error creating the reservation. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <form
        className="px-5 py-5 border rounded shadow mt-5"
        style={{ maxWidth: "800px", minHeight: "400px" }}
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-5">Add Reservation</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Name Field */}
        <div className="row mb-4 align-items-center">
          <label htmlFor="reservationName" className="col-sm-4 col-form-label">
            Reservation Name:
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              id="reservationName"
              className="form-control"
              value={reservationName}
              placeholder="Enter reservation name"
              onChange={(e) => setReservationName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Time Slot Field */}
        <div className="row mb-4 align-items-center">
          <label htmlFor="reservationTime" className="col-sm-4 col-form-label">
            Reservation Time:
          </label>
          <div className="col-sm-8">
            <select
              id="reservationTime"
              className="form-select"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              required
            >
              <option value="">-- Choose a time slot --</option>
              <option value="9:00 am - 12:00 noon">9:00 AM - 12:00 Noon</option>
              <option value="12:00 noon - 3:00 pm">12:00 Noon - 3:00 PM</option>
              <option value="3:00pm - 6:00 pm">3:00 PM - 6:00 PM</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="row mb-3 align-items-center">
          <label htmlFor="image" className="col-sm-4 col-form-label">
            Upload Image:
          </label>
          <div className="col-sm-8">
            <input
              type="file"
              className="form-control"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ maxWidth: "150px" }}
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-dark mt-5" disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding Reservation...
              </>
            ) : (
              "Add Reservation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
