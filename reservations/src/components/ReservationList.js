import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './ReservationList.css';


function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReservations, setTotalReservations] = useState(0);
  const reservationsPerPage = 4;

  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost/reactapp2/reservations/reservation_server/api/reservations.php`,
          {
            params: { page: currentPage, limit: reservationsPerPage },
          }
        );

        // Update state using API response
        if (response.data.reservations) {
          setReservations(response.data.reservations);
          setTotalReservations(Number(response.data.totalReservations) || 0);
        } else {
          setReservations([]);
          setTotalReservations(0);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError(
          "There was an error fetching the reservations. Please try again later."
        );
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [currentPage]);

  const totalPages = Math.ceil(totalReservations / reservationsPerPage);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    // Delete reservation handler
  const handleDelete = async (resID) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const response = await axios.post(
        "http://localhost/reactapp2/reservations/reservation_server/api/delete-reservation.php",
        { id: resID }
      );

      alert(response.data.message);

      // Remove deleted reservation from state
      setReservations((prev) => prev.filter((res) => res.resID !== resID));
      setTotalReservations((prev) => prev - 1);

      // Adjust current page if necessary
      if (reservations.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete reservation.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-5 text-center">Recent Reservations</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {isLoading ? (
          <p>Loading reservations...</p>
        ) : reservations.length ? (
          reservations.map((reservation) => (
            <div className="col-md-6" key={reservation.resID}>
              <div className="card mb-4 shadow-lg border-0 p-4">
                <div className="card-body">
                  <h5 className="card-title">{reservation.reservationName}</h5>
                  <p className="card-text">
                    Time Slot: {reservation.reservationTime}
                  </p>
                  <p className="card-text">
                    Status: {reservation.isBooked === "0" ? (
                    <span className="text-success">Available</span>
                    ) : (
                    <span className="text-danger">Booked</span>
                  )}</p>

                  <Link
                    to={`/reservation/${reservation.resID}`}
                    className="green-button"
                  >
                    Manage Reservation
                  </Link>
                  <button
                    to={`/reservation/${reservation.resID}`}
                    className="delete-btn"
                    onClick={() => handleDelete(reservation.resID)}      
                  >
                    Delete Reservation
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No reservations available.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center mt-4">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={goToPreviousPage}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className="page-item">
                <button
                  className={`page-link ${currentPage === index + 1 ? "custom-active" : "text-dark"}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button className="page-link text-dark" onClick={goToNextPage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default ReservationList;
