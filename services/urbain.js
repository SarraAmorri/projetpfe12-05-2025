const API_BASE_URL = 'http://localhost:5000/api/urbain';

export const urbainService = {
  async getAllLines() {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) throw new Error(`Erreur réseau (${response.status}): ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erreur dans getAllLines:', error.message);
      throw error;
    }
  },

  async getLineById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) throw new Error(`Erreur réseau (${response.status}): ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erreur dans getLineById:', error.message);
      throw error;
    }
  },

  async addLine(lineData) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(lineData),
      });
      if (!response.ok) throw new Error(`Erreur réseau (${response.status}): ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erreur dans addLine:', error.message);
      throw error;
    }
  },

  async updateLine(id, updatedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error(`Erreur réseau (${response.status}): ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erreur dans updateLine:', error.message);
      throw error;
    }
  },

  async deleteLine(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) throw new Error(`Erreur réseau (${response.status}): ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('❌ Erreur dans deleteLine:', error.message);
      throw error;
    }
  }
};
