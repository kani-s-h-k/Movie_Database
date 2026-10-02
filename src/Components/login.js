import GoogleIcon from "@mui/icons-material/Google";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../Helpers/firebase";
import { friendlyAuthError } from "../Helpers/authErrors";
import { useApp } from "../Helpers/StateContext";

const NOT_CONFIGURED =
  "Authentication is not configured. Add your Firebase keys to the .env file.";

export const Login = () => {
  const { user, authReady, showAlert } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Sign Up");
  const [submitting, setSubmitting] = useState(false);

  // Send people back to where they were (e.g. the title they tried to like).
  const redirectTo = (location.state && location.state.from) || "/";

  const run = async (action, successMessage) => {
    if (!auth) {
      showAlert(NOT_CONFIGURED, "danger");
      return;
    }
    setSubmitting(true);
    try {
      await action();
      showAlert(successMessage, "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      showAlert(friendlyAuthError(err), "danger");
      setSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting) return;
    if (title === "Sign Up") {
      run(
        () => createUserWithEmailAndPassword(auth, email.trim(), password),
        "Sign Up Successful !!!"
      );
    } else {
      run(
        () => signInWithEmailAndPassword(auth, email.trim(), password),
        "Log In Successful !!"
      );
    }
  };

  const handleGoogleLogin = () => {
    if (submitting) return;
    run(() => signInWithPopup(auth, googleProvider), "Log In Successful !!");
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      showAlert("Log Out Successful", "primary");
    } catch (err) {
      console.error(err);
      showAlert(friendlyAuthError(err), "danger");
    }
  };

  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "90%",
    maxWidth: "420px",
    minHeight: "50vh",
    margin: "auto",
    padding: "2vh",
    alignItems: "center",
    marginTop: "5vh",
    justifyContent: "center",
  };

  if (!authReady) {
    return <div style={boxStyle}>Loading…</div>;
  }

  if (user) {
    return (
      <div style={boxStyle}>
        <h2>You're signed in</h2>
        <p>{user.displayName || user.email}</p>
        <div style={{ display: "flex", gap: "2vh" }}>
          <Link to="/watchlist" className="btn btn-dark">
            My Watchlist
          </Link>
          <button type="button" onClick={handleLogOut} className="btn btn-dark">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={boxStyle}>
      <h2>{title}</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "90%", margin: "2vh", padding: "0.8vh" }}
        type="email"
        autoComplete="email"
        placeholder="Enter Your Email..."
        aria-label="Email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "90%", margin: "2vh", padding: "0.8vh" }}
        placeholder="Enter Your Password..."
        aria-label="Password"
        type="password"
        autoComplete={title === "Sign Up" ? "new-password" : "current-password"}
        required
      />
      <button type="submit" className="btn btn-dark" disabled={submitting}>
        {submitting ? "Please wait…" : "Submit"}
      </button>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={submitting}
        className="btn btn-success"
        style={{
          width: "80%",
          margin: "2vh",
          border: "1px solid green",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1vh",
        }}
      >
        <GoogleIcon style={{ color: "white", marginRight: "10px" }} />
        <div>{`${title} With Google`}</div>
      </button>

      <div>
        {title === "Sign Up" ? "Already got an account? " : "New here? "}
        <button
          type="button"
          className="btn btn-link p-0 align-baseline"
          onClick={() => setTitle(title === "Sign Up" ? "Log In" : "Sign Up")}
        >
          {title === "Sign Up" ? "Log In" : "Sign Up"}
        </button>
      </div>
    </form>
  );
};
