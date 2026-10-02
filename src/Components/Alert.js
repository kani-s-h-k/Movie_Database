import React from "react";

function Alert({ alert }) {
  return (
    <div
      className={`alert alert-${alert.type}`}
      role="alert"
      style={{
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 2000,
        borderRadius: 0,
        textAlign: "center",
      }}
    >
      {alert.message}
    </div>
  );
}

export default Alert;
