"use client";
import React, { useState } from "react";
import { registerUser } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    cin: "",
    adresse: "",
    email: "",
    tel: "",
    password: "",
    confirmation: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cin: formData.cin,
        adresse: formData.adresse,
        tel: formData.tel,
        role: "user", // optional, but explicit
      };

      const data = await registerUser(payload);
      alert("Inscription réussie !");
      router.push("/login");
    } catch (error) {
      alert(error.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 via-emerald-100 to-lime-100 px-4 py-10 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-700">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <input
            type="text"
            name="cin"
            placeholder="CIN"
            value={formData.cin}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <input
            type="tel"
            name="tel"
            placeholder="Téléphone"
            value={formData.tel}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <input
            type="password"
            name="confirmation"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            S'inscrire
          </button>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
