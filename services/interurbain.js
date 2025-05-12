const API_URL = 'http://localhost:5000/api/interurbain';

export const interurbainService = {
  async getAllLines() {
    try {
      const res = await fetch(`${API_URL}`);
      if (!res.ok) throw new Error('Erreur lors de la récupération des lignes interurbaines');
      return await res.json();
    } catch (err) {
      console.error('❌ getAllLines error:', err.message);
      throw err;
    }
  },

  async getLineById(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Ligne non trouvée');
      return await res.json();
    } catch (err) {
      console.error('❌ getLineById error:', err.message);
      throw err;
    }
  },

  async addLine(data) {
    try {
      const res = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur lors de l’ajout de la ligne');
      return await res.json();
    } catch (err) {
      console.error('❌ addLine error:', err.message);
      throw err;
    }
  },

  async updateLine(id, data) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      return await res.json();
    } catch (err) {
      console.error('❌ updateLine error:', err.message);
      throw err;
    }
  },

  async deleteLine(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      return await res.json();
    } catch (err) {
      console.error('❌ deleteLine error:', err.message);
      throw err;
    }
  },
};
