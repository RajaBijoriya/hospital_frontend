import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { appointmentAPI } from "../services/api";
import "../styles/BookAppointment.css";

export const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const { doctorId } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    patientId: user?.id || "",
    doctorId: doctorId || "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await appointmentAPI.bookAppointment(formData, token);
      alert("Appointment booked successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-appointment-container">
      <div className="book-appointment-form">
        <h1>Book Appointment</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Doctor ID</label>
            <input
              type="text"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              placeholder="Select a doctor"
            />
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason for Appointment</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              minLength="10"
              placeholder="Please provide at least 10 characters"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
