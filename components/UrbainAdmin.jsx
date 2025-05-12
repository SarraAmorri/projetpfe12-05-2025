"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { urbainService } from "@/services/urbain";

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

export default function UrbainAdmin() {
  const [urbanLines, setUrbanLines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    numero: "",
    startPoint: "",
    endPoint: "",
    departTime: "",
    stations: "",
    price: "",
    active: true,
  });

  useEffect(() => {
    loadUrbanLines();
  }, []);

  const loadUrbanLines = async () => {
    try {
      const data = await urbainService.getAllLines();
      setUrbanLines(data);
    } catch (err) {
      console.error("❌ Erreur chargement lignes urbaines:", err);
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
        price: parseFloat(form.price),
        stations: form.stations.split(",").map((s) => s.trim()),
      };
      if (editItem) {
        await urbainService.updateLine(editItem._id, data);
        alert("✅ Ligne mise à jour avec succès.");
      } else {
        await urbainService.addLine(data);
        alert("✅ Ligne ajoutée avec succès.");
      }
      await loadUrbanLines();
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
      await urbainService.deleteLine(id);
      await loadUrbanLines();
      alert("✅ Ligne supprimée avec succès.");
    } catch (err) {
      console.error("❌ Erreur suppression:", err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setForm({ ...item, stations: item.stations?.join(", ") || "" });
      setEditItem(item);
    } else {
      resetForm();
      setEditItem(null);
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      numero: "",
      startPoint: "",
      endPoint: "",
      departTime: "",
      stations: "",
      price: "",
      active: true,
    });
  };

  return (
    <div className="bg-white rounded-xl ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-emerald-700">Lignes Urbaines</h2>
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Numéro</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Départ</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Arrivée</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Heure</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stations</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prix</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {urbanLines.map((line) => (
            <tr key={line._id} className="bg-white border-t">
              <td className="px-6 py-4">{line.numero}</td>
              <td className="px-6 py-4">{line.startPoint}</td>
              <td className="px-6 py-4">{line.endPoint}</td>
              <td className="px-6 py-4">{line.departTime}</td>
              <td className="px-6 py-4">{line.stations?.join(", ")}</td>
              <td className="px-6 py-4">{line.price.toFixed(3)} TND</td>
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
            {["numero", "startPoint", "endPoint", "departTime", "stations", "price"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={
                  field === "departTime"
                    ? "Heure de départ (ex: 01:30 PM)"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
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
