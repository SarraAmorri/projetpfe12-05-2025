const API_BASE_URL = "http://localhost:5000/api/reservationticket";

export const reservationTicketService = {
  async createReservation({ userId, bus, numberOfPlaces }) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, bus, numberOfPlaces }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la réservation");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur createReservation:", error.message);
      throw error;
    }
  },
};
