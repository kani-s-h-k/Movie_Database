const MESSAGES = {
  "auth/email-already-in-use":
    "An account with this email already exists. Try logging in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-password": "Please enter your password.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed":
    "Network error. Check your connection and try again.",
  "auth/popup-closed-by-user":
    "The sign-in window was closed before finishing.",
  "auth/cancelled-popup-request":
    "The sign-in window was closed before finishing.",
  "auth/popup-blocked":
    "Your browser blocked the sign-in popup. Allow popups and try again.",
  "auth/operation-not-allowed":
    "This sign-in method is not enabled for this project.",
};

export function friendlyAuthError(error) {
  return (
    (error && MESSAGES[error.code]) || "Something went wrong. Please try again."
  );
}
