import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <main>
      <h1>Profile</h1>

      <table>
        <tbody>
          <tr>
            <td>
              <b>Id</b>
            </td>
            <td>{user?.id}</td>
          </tr>
          <tr>
            <td>
              <b>First Name</b>
            </td>
            <td>{user?.firstName}</td>
          </tr>
          <tr>
            <td>
              <b>Last Name</b>
            </td>
            <td>{user?.lastName}</td>
          </tr>
          <tr>
            <td>
              <b>Email</b>
            </td>
            <td>{user?.email}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
