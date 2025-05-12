"use client";

import { useEffect, useState } from "react";
import { urbainService } from "@/services/urbain";

export default function Urbain() {
  const [urbanLines, setUrbanLines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await urbainService.getAllLines();
        setUrbanLines(data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des lignes urbaines :", err);
      }
    };
    fetchData();
  }, []);

  const filteredLines = urbanLines.filter((line) => {
    const term = search.toLowerCase();
    return (
      line.numero?.toLowerCase().includes(term) ||
      line.startPoint?.toLowerCase().includes(term) ||
      line.endPoint?.toLowerCase().includes(term) ||
      line.stations?.some((station) => station.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 via-emerald-100 to-lime-100 px-4 flex  justify-center">
      <div className="max-w-5xl w-full space-y-6 py-5">  
        <h1 className="text-3xl font-bold text-center text-emerald-700 mb-4">
          RÉSEAU DU TRANSPORT URBAIN
        </h1>

        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Rechercher ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full max-w-md shadow-sm bg-white"
          />
        </div>

        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-emerald-200 text-emerald-900 rounded-t-lg">
            <tr>
              <th className="px-4 py-3 text-left">Numéro</th>
              <th className="px-4 py-3 text-left">Départ</th>
              <th className="px-4 py-3 text-left">Arrivée</th>
              <th className="px-4 py-3 text-left">Stations traversées</th>
              <th className="px-4 py-3 text-left">Heure</th>
              <th className="px-4 py-3 text-left">Prix (TND)</th>
              <th className="px-4 py-3 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredLines.length > 0 ? (
              filteredLines.map((line, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-emerald-50 transition duration-200"
                >
                  <td className="px-4 py-3 font-semibold text-sky-700">{line.numero}</td>
                  <td className="px-4 py-3">{line.startPoint}</td>
                  <td className="px-4 py-3">{line.endPoint}</td>
                  <td className="px-4 py-3">{(line.stations || []).join(", ")}</td>
                  <td className="px-4 py-3">{line.departTime}</td>
                  <td className="px-4 py-3">{line.price.toFixed(3)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        line.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {line.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                  Aucune ligne trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
