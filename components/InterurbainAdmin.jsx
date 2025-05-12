"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { interurbainService } from "@/services/interurbain";

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={20} />
        </button>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function InterurbainAdmin() {
  const [interurbanLines, setInterurbanLines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    Depart: "",
    Arrivee: "",
    Horaires: "",
    Prix: "",
    placesDisponibles: 50,
    active: true,
  });

  useEffect(() => {
    loadInterurbanLines();
  }, []);

  const loadInterurbanLines = async () => {
    try {
      const data = await interurbainService.getAllLines();
      setInterurbanLines(data);
    } catch (err) {
      console.error("❌ Erreur chargement lignes interurbaines:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        Prix: parseFloat(form.Prix),
        placesDisponibles: parseInt(form.placesDisponibles),
      };
      if (editItem) {
        await interurbainService.updateLine(editItem._id, data);
        alert("✅ Ligne interurbaine mise à jour avec succès.");
      } else {
        await interurbainService.addLine(data);
        alert("✅ Ligne interurbaine ajoutée avec succès.");
      }
      await loadInterurbanLines();
      setShowModal(false);
      setEditItem(null);
      resetForm();
    } catch (err) {
      console.error("❌ Erreur soumission:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("❗ Voulez-vous vraiment supprimer cette ligne ?");
    if (!confirmDelete) return;

    try {
      await interurbainService.deleteLine(id);
      await loadInterurbanLines();
      alert("✅ Ligne supprimée avec succès.");
    } catch (err) {
      console.error("❌ Erreur suppression:", err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setForm({ ...item });
      setEditItem(item);
    } else {
      resetForm();
      setEditItem(null);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      Depart: "",
      Arrivee: "",
      Horaires: "",
      Prix: "",
      placesDisponibles: 50,
      active: true,
    });
  };

  return (
    <div className="bg-white rounded-xl ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-700">Lignes Interurbaines</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus size={16} className="mr-2" /> Ajouter
        </button>
      </div>
      <table className="min-w-full table-auto rounded-lg overflow-hidden">
        <thead className="bg-green-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Départ</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Arrivée</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Horaires</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prix</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Places</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {interurbanLines.map((line) => (
            <tr key={line._id} className="bg-white border-t">
              <td className="px-6 py-4">{line.Depart}</td>
              <td className="px-6 py-4">{line.Arrivee}</td>
              <td className="px-6 py-4">{line.Horaires}</td>
              <td className="px-6 py-4">{line.Prix.toFixed(3)} TND</td>
              <td className="px-6 py-4">{line.placesDisponibles}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    line.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {line.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2">
                <button onClick={() => openModal(line)}>
                  <Edit size={16} className="text-blue-600 hover:text-blue-800" />
                </button>
                <button onClick={() => handleDelete(line._id)}>
                  <Trash2 size={16} className="text-red-600 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editItem ? "Modifier la ligne" : "Ajouter une ligne"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["Depart", "Arrivee", "Horaires", "Prix", "placesDisponibles"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full p-2 border rounded"
                required
              />
            ))}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <span>Actif</span>
            </label>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editItem ? "Enregistrer" : "Ajouter"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
