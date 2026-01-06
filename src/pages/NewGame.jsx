import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NewGame.css";

export default function NewGame() {
  const [playerCount, setPlayerCount] = useState(null);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  const smallRange = Array.from({ length: 31 }, (_, i) => i);
  const bigRange = Array.from({ length: 121 }, (_, i) => i);

  useEffect(() => {
    const saved = localStorage.getItem("playersData");
    if (saved) {
      const data = JSON.parse(saved);
      setPlayers(data);
      setPlayerCount(data.length);
    }
  }, []);

  function handleSelect(count) {
    setPlayerCount(count);
    setPlayers(
      Array.from({ length: count }, () => ({
        name: "",
        apple: 0,
        cheese: 0,
        bread: 0,
        chicken: 0,
        money: 0,
        contraband: 0,
      }))
    );
  }

  function handleChange(index, field, value) {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[index][field] = field === "name" ? value : Number(value);
      return copy;
    });
  }

  function handleStartGame(e) {
    e.preventDefault();
    localStorage.setItem("playersData", JSON.stringify(players));
    navigate("/results");
  }

  function handleReset() {
    localStorage.removeItem("playersData");
    setPlayerCount(null);
    setPlayers([]);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center" }}>Új játék</h1>
      <p style={{ textAlign: "center" }}>Válaszd ki a játékosok számát:</p>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {[3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => handleSelect(n)}
            style={{
              marginRight: "10px",
              padding: "10px 15px",
              cursor: "pointer",
              backgroundColor: playerCount === n ? "rgba(143, 86, 50, 1)" : "transparent",
              color: playerCount === n ? "white" : "black",
            }}
          >
            {n} játékos
          </button>
        ))}
      </div>

      {playerCount !== null ? (
        <form onSubmit={handleStartGame}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {players.map((player, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "8px",
                  padding: "40px",
                  border: "2px solid #1A1A1A",
                  minWidth: "250px",
                  backgroundColor: "#f9f9f9",
                  flex: "0 0 auto",
                }}
              >
                <h3 style={{ textAlign: "center" }}>Játékos {i + 1}</h3>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => handleChange(i, "name", e.target.value)}
                      placeholder={`Játékos ${i + 1} neve`}
                      className="input"
                    />
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    ["apple", "Alma", smallRange],
                    ["cheese", "Sajt", smallRange],
                    ["bread", "Kenyér", smallRange],
                    ["chicken", "Csirke", smallRange],
                    ["money", "Pénz", bigRange],
                    ["contraband", "Csempészáru", bigRange],
                  ].map(([key, label, range]) => (
                    <label key={key}>
                      {label}:{" "}
                      <select
                        value={player[key]}
                        onChange={(e) => handleChange(i, key, e.target.value)}
                      >
                        {range.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <button type="submit" >Számlálás indítása</button>
            <button type="button" onClick={handleReset}>
              Újrakezdés
            </button>
          </div>
        </form>
      ) : (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <p>Válassz egy gombot a fenti listából a mezők generálásához.</p>
          <button onClick={() => navigate("/")}>Vissza</button>
        </div>
      )}
    </div>
  );
}
