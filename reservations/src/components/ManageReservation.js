import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ManageReservation = () => {
  const { resID } = useParams();
  const [reservation, setReservation] = useState(null);

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `http://localhost/reactapp2/reservations/reservation_server/api/manage-reservation.php/${resID}`
      );
      const reservationData = response.data.data;
      setReservation(reservationData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [resID]);

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
  <div className="container mt-5">
    <h2 className="mb-5 text-center">Manage Reservation</h2>
    <div className="card mb-4 shadow-lg border-0 p-4">
      <div className="card-body">
        <h5 className="card-title">{reservation.name}</h5>
        <p className="card-text">Time Slot: {reservation.time}</p>
        <p className="card-text">
          Status:{" "}
          {reservation.isBooked === 0 ? (
            <span className="text-success">Available</span>
          ) : (
            <span className="text-danger">Booked</span>
          )}
        </p>

        <Link
          to={`/reservation/${reservation.resID}`}
          className="btn btn-light text-dark border-dark"
        >
          Save Reservation
        </Link>
      </div>
    </div>
  </div>
  );
};

export default ManageReservation;
