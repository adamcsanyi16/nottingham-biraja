import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("playersData")) || [];

    // Alap pontszám számítása
    let calculated = data.map((p) => {
      const total =
        p.apple * 2 +
        p.cheese * 3 +
        p.bread * 3 +
        p.chicken * 4 +
        p.money +
        p.contraband;

      return {
        ...p,
        total,
        royalBonus: 0,
        queenBonus: 0,
      };
    });

    // --- BÓNUSZOK KIOSZTÁSA ---
    const goods = ["apple", "cheese", "bread", "chicken"];

    goods.forEach((good) => {
      const sorted = [...calculated].sort((a, b) => b[good] - a[good]);
      if (good == "apple" && sorted.length > 1) {
        if (
          sorted[0][good] == sorted[1][good] &&
          sorted[0][good] > 0 &&
          sorted[1][good] > 0
        ) {
          sorted[0].royalBonus += 15;
          sorted[1].royalBonus += 15;
        } else {
          if (sorted[0][good] != sorted[1][good] && sorted[0][good] > 0) {
            sorted[0].royalBonus += 20;
          }
          if (sorted[0][good] != sorted[1][good] && sorted[1][good] > 0) {
            sorted[1].queenBonus += 10;
          }
        }
      }
      if (good == "cheese" || (good == "bread" && sorted.length > 1)) {
        if (
          sorted[0][good] == sorted[1][good] &&
          sorted[0][good] > 0 &&
          sorted[1][good] > 0
        ) {
          sorted[0].royalBonus += 12.5;
          sorted[1].royalBonus += 12.5;
        } else {
          if (sorted[0][good] != sorted[1][good] && sorted[0][good] > 0) {
            sorted[0].royalBonus += 15;
          }
          if (sorted[0][good] != sorted[1][good] && sorted[1][good] > 0) {
            sorted[1].queenBonus += 10;
          }
        }
      }
      if (good == "chicken" && sorted.length > 1) {
        if (
          sorted[0][good] == sorted[1][good] &&
          sorted[0][good] > 0 &&
          sorted[1][good] > 0
        ) {
          sorted[0].royalBonus += 7.5;
          sorted[1].royalBonus += 7.5;
        } else {
          if (sorted[0][good] != sorted[1][good] && sorted[0][good] > 0) {
            sorted[0].royalBonus += 10;
          }
          if (sorted[0][good] != sorted[1][good] && sorted[1][good] > 0) {
            sorted[1].queenBonus += 5;
          }
        }
      }
    });

    calculated = calculated.map((p) => ({
      ...p,
      total: p.total + p.royalBonus + p.queenBonus,
    }));

    calculated.sort((a, b) => b.total - a.total);

    setResults(calculated);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Eredmények</h1>

      {results.length === 0 ? (
        <p>Nincs adat! Térj vissza a felvétel oldalra.</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <table
              border="1"
              cellPadding="8"
              cellSpacing="0"
              style={{
                borderCollapse: "collapse",
                width: "80%",
                textAlign: "center",
              }}
            >
              <thead style={{ backgroundColor: "#eee" }}>
                <tr>
                  <th>Helyezés</th>
                  <th>Név</th>
                  <th>Alma</th>
                  <th>Sajt</th>
                  <th>Kenyér</th>
                  <th>Csirke</th>
                  <th>Királyi Bónusz</th>
                  <th>Királynői Bónusz</th>
                  <th>Pénz</th>
                  <th>Csempészáru</th>
                  <th>Összesen</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => (
                  <tr key={index}>
                    <td>{index + 1}.</td>
                    <td>{r.name || `Játékos ${index + 1}`}</td>
                    <td>{r.apple}</td>
                    <td>{r.cheese}</td>
                    <td>{r.bread}</td>
                    <td>{r.chicken}</td>
                    <td>{r.royalBonus}</td>
                    <td>{r.queenBonus}</td>
                    <td>{r.money}</td>
                    <td>{r.contraband}</td>
                    <td>
                      <strong>{r.total}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={() => navigate("/felvetel")}>
              Vissza a szerkesztéshez
            </button>
          </div>
        </>
      )}
    </div>
  );
}
