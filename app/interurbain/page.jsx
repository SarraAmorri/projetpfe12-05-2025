'use client'

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { reservationTicketService } from "@/services/reservationticket";

const ReservationTicket = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const busId = searchParams.get("busId");

  const [userId, setUserId] = useState(null);
  const [nbrTickets, setNbrTickets] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.userId || payload.id;
      setUserId(id);
    } catch (err) {
      console.error("Erreur de décodage du token :", err);
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!busId) throw new Error("Bus ID manquant.");
      const places = parseInt(nbrTickets);
      if (isNaN(places) || places <= 0) {
        throw new Error("Entrez un nombre valide de tickets.");
      }

      await reservationTicketService.createReservation({
        userId,
        bus: busId,
        numberOfPlaces: places,
      });

      setSuccess(`✅ Réservation confirmée pour ${places} place(s).`);
      setNbrTickets("");
      setTimeout(() => router.push("/interurbain"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 via-emerald-100 to-lime-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-emerald-700 mb-4">
          Réserver un Ticket
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Nombre de places"
            value={nbrTickets}
            onChange={(e) => setNbrTickets(e.target.value)}
            min="1"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />

          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
          >
            {loading ? "Réservation en cours..." : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationTicket;
