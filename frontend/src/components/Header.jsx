import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, reset } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav>
      {user ? (
        <>
          <Link to="/">[Home]</Link>
          <Link to="/marksheets">[Marksheets]</Link>
          <a
            href="#"
            onClick={() => {
              dispatch(logout());
              dispatch(reset());
            }}
          >
            [Logout]
          </a>
        </>
      ) : null}
    </nav>
  );
}
