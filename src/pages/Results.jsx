import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import alma from "../assets/alma.jpg";
import kenyer from "../assets/kenyer.jpg";
import sajt from "../assets/sajt.jpg";
import csirke from "../assets/csirke.jpg";
import bors from "../assets/bors.jpg";
import penz from "../assets/penz.png";

export default function Results() {
  const [results, setResults] = useState([]);
  const [playerCount, setPlayerCount] = useState(null);
  const navigate = useNavigate();

  const bonusConfig = {
    apple: { king: 20, queen: 10 },
    cheese: { king: 15, queen: 10 },
    bread: { king: 15, queen: 10 },
    chicken: { king: 10, queen: 5 },
  };

  function applyBonuses(players, good, kingBonus, queenBonus) {
    const sorted = [...players].sort((a, b) => b[good] - a[good]);

    if (sorted[0][good] === 0) return;

    const topValue = sorted[0][good];
    const topPlayers = sorted.filter((p) => p[good] === topValue);

    if (topPlayers.length === 1) {
      // Király
      sorted[0].royalBonus += kingBonus;

      // Királynő
      if (sorted[1] && sorted[1][good] > 0) {
        const Qvalue = sorted[1][good];
        const topQs = sorted.filter((q) => q[good] === Qvalue);

        if (topQs.length > 1) {
          const splitQ = Math.floor(queenBonus / topQs.length);
          topQs.forEach((q) => {
            q.queenBonus += splitQ;
          });
        } else {
          sorted[1].queenBonus += queenBonus;
        }
      }
    } else {
      // Holtverseny az első helyen
      const totalBonus = kingBonus + queenBonus;
      const split = Math.floor(totalBonus / topPlayers.length);
      topPlayers.forEach((p) => {
        p.royalBonus += split;
      });
    }
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("playersData")) || [];
    setPlayerCount(data.length);

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

    //BÓNUSZOK KIOSZTÁSA
    Object.entries(bonusConfig).forEach(([good, bonuses]) => {
      applyBonuses(calculated, good, bonuses.king, bonuses.queen);
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
