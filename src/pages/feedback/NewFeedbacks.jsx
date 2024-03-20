import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./NewFeedbacks.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { feedbackRows } from "../../datatablesource_feedback";

const NewFeedBack = () => {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackDate, setFeedbackDate] = useState("");
  const [data, setData] = useState(feedbackRows);

  const handleSubmit = () => {
    var newid = Math.max(...data.map((item) => item.id));
    const newCinema = {
      id: newid + 1,
      user: user,
      email: email,
      message: message,
    };
    data.push(newCinema);
  };
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <form onSubmit={handleSubmit}>
          <table>
            <tr>
              <td>
                <label htmlFor="user">User:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="user"
                  value={user}
                  onChange={(event) => setUser(event.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="email">Email:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="message">Message:</label>
              </td>
              <td>
                <input
                  type="text"
                  id="message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <button className="submitButton" onClick={() => handleSubmit()}>
                Add Feedback
              </button>
            </tr>
          </table>
        </form>
      </div>
    </div>
  );
};

export default NewFeedBack;
