import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Nottingham Bírája - Pontszámláló</h1>
      <div
        className="buttons"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button onClick={() => navigate("/felvetel")}>Új játék</button>
        <button>Mentett játékok</button>
      </div>
    </div>
  );
};

export default Home;
