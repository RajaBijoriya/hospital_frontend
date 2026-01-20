import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI, appointmentAPI } from "../services/api";
import "../styles/Dashboard.css";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [token, user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (user?.role === "patient") {
        const appointmentsRes = await appointmentAPI.getAppointments(
          user.id,
          "patient",
          token,
        );
        setAppointments(appointmentsRes.data.data);

        const doctorsRes = await userAPI.getAllDoctors();
        setDoctors(doctorsRes.data.data);
      } else if (user?.role === "doctor") {
        const appointmentsRes = await appointmentAPI.getAppointments(
          user.id,
          "doctor",
          token,
        );
        setAppointments(appointmentsRes.data.data);

        const patientsRes = await userAPI.getAllPatients();
        setPatients(patientsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBookAppointment = (doctorId) => {
    navigate("/book-appointment", { state: { doctorId } });
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.cancelAppointment(
        appointmentId,
        {
          cancelledBy: user.role,
          cancellationReason: "User requested cancellation",
        },
        token,
      );
      fetchData();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.approveAppointment(appointmentId, token);
      fetchData();
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const handleRejectAppointment = async (appointmentId) => {
    try {
      await appointmentAPI.rejectAppointment(
        appointmentId,
        {
          cancelledBy: "doctor",
          cancellationReason: "Doctor rejected appointment",
        },
        token,
      );
      fetchData();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Hospital Appointment System</h1>
          <div className="navbar-user">
            <span>{user?.fullName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}>
            My Appointments
          </button>
          {user?.role === "patient" && (
            <button
              className={`tab ${activeTab === "doctors" ? "active" : ""}`}
              onClick={() => setActiveTab("doctors")}>
              Available Doctors
            </button>
          )}
          {user?.role === "doctor" && (
            <button
              className={`tab ${activeTab === "patients" ? "active" : ""}`}
              onClick={() => setActiveTab("patients")}>
              Appointment Requests
            </button>
          )}
        </div>

        <div className="tab-content">
          {activeTab === "appointments" && (
            <div className="appointments-section">
              <h2>My Appointments</h2>
              {loading ? (
                <p>Loading appointments...</p>
              ) : appointments.length > 0 ? (
                <div className="appointments-grid">
                  {appointments.map((apt) => (
                    <div key={apt._id} className="appointment-card">
                      <h3>Appointment Details</h3>
                      {user?.role === "patient" ? (
                        <>
                          <div className="doctor-profile">
                            <h4>{apt.doctorId?.fullName}</h4>
                            <p>
                              <strong>Specialization:</strong>{" "}
                              {apt.doctorId?.specialization}
                            </p>
                            <p>
                              <strong>Email:</strong> {apt.doctorId?.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {apt.doctorId?.phone}
                            </p>
                            {apt.doctorId?.bio && (
                              <p>
                                <strong>Bio:</strong> {apt.doctorId?.bio}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="patient-profile">
                            <h4>{apt.patientId?.fullName}</h4>
                            <p>
                              <strong>Email:</strong> {apt.patientId?.email}
                            </p>
                            <p>
                              <strong>Phone:</strong> {apt.patientId?.phone}
                            </p>
                          </div>
                        </>
                      )}
                      <div className="appointment-details">
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Time:</strong> {apt.appointmentTime}
                        </p>
                        <p>
                          <strong>Reason:</strong> {apt.reason}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          <span className={`status ${apt.status}`}>
                            {apt.status}
                          </span>
                        </p>
                      </div>

                      {user?.role === "patient" && (
                        <div className="appointment-actions">
                          {apt.status !== "cancelled" && (
                            <button
                              className="cancel-btn"
                              onClick={() => handleCancelAppointment(apt._id)}>
                              Cancel Appointment
                            </button>
                          )}
                        </div>
                      )}

                      {user?.role === "doctor" && (
                        <div className="appointment-actions">
                          {apt.status === "pending" && (
                            <>
                              <button
                                className="approve-btn"
                                onClick={() =>
                                  handleApproveAppointment(apt._id)
                                }>
                                Approve Appointment
                              </button>
                              <button
                                className="reject-btn"
                                onClick={() =>
                                  handleRejectAppointment(apt._id)
                                }>
                                Reject Appointment
                              </button>
                            </>
                          )}
                          {apt.status !== "cancelled" &&
                            apt.status !== "pending" && (
                              <button
                                className="cancel-btn"
                                onClick={() =>
                                  handleCancelAppointment(apt._id)
                                }>
                                Cancel Appointment
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No appointments scheduled</p>
              )}
            </div>
          )}

          {activeTab === "doctors" && user?.role === "patient" && (
            <div className="doctors-section">
              <h2>Available Doctors</h2>
              {loading ? (
                <p>Loading doctors...</p>
              ) : doctors.length > 0 ? (
                <div className="doctors-grid">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className="doctor-card">
                      <h3>{doctor.fullName}</h3>
                      <p>
                        <strong>Specialization:</strong> {doctor.specialization}
                      </p>
                      <p>
                        <strong>Email:</strong> {doctor.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {doctor.phone}
                      </p>
                      {doctor.bio && (
                        <p>
                          <strong>Bio:</strong> {doctor.bio}
                        </p>
                      )}
                      <button
                        className="book-btn"
                        onClick={() => handleBookAppointment(doctor._id)}>
                        Get Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No doctors available</p>
              )}
            </div>
          )}

          {activeTab === "patients" && user?.role === "doctor" && (
            <div className="patients-section">
              <h2>Appointment Requests</h2>
              {loading ? (
                <p>Loading appointment requests...</p>
              ) : appointments.filter((apt) => apt.status === "pending")
                  .length > 0 ? (
                <div className="patients-grid">
                  {appointments
                    .filter((apt) => apt.status === "pending")
                    .map((apt) => (
                      <div key={apt._id} className="patient-card">
                        <div className="patient-profile">
                          <h3>{apt.patientId?.fullName}</h3>
                          <p>
                            <strong>Email:</strong> {apt.patientId?.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {apt.patientId?.phone}
                          </p>
                        </div>
                        <div className="appointment-details">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Time:</strong> {apt.appointmentTime}
                          </p>
                          <p>
                            <strong>Reason:</strong> {apt.reason}
                          </p>
                        </div>
                        <div className="appointment-actions">
                          <button
                            className="approve-btn"
                            onClick={() => handleApproveAppointment(apt._id)}>
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleRejectAppointment(apt._id)}>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="appointments-section">
                  <h3>Confirmed Appointments</h3>
                  {appointments.filter((apt) => apt.status === "confirmed")
                    .length > 0 ? (
                    <div className="patients-grid">
                      {appointments
                        .filter((apt) => apt.status === "confirmed")
                        .map((apt) => (
                          <div key={apt._id} className="patient-card">
                            <div className="patient-profile">
                              <h3>{apt.patientId?.fullName}</h3>
                              <p>
                                <strong>Email:</strong> {apt.patientId?.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {apt.patientId?.phone}
                              </p>
                            </div>
                            <div className="appointment-details">
                              <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  apt.appointmentDate,
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Time:</strong> {apt.appointmentTime}
                              </p>
                              <p>
                                <strong>Reason:</strong> {apt.reason}
                              </p>
                              <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status ${apt.status}`}>
                                  {apt.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p>No pending or confirmed appointments</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
