import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
                  <Link
                    to={`/post/${reservation.resID}`}
                    className="btn btn-light text-dark border-dark"
                  >
                    View Details
                  </Link>
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
              <button className="page-link" onClick={goToPreviousPage}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
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
              <button className="page-link" onClick={goToNextPage}>
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
