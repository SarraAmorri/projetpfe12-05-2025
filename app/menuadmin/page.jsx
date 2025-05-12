"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import UrbainAdminComponent from "@/components/UrbainAdmin";
import InterurbainAdminComponent from "@/components/InterurbainAdmin";

export default function MenuAdminStatic() {
  const [activeTab, setActiveTab] = useState("urbaines");

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-200">
          <div className="flex space-x-8">
            {[
              { key: "urbaines", label: "Lignes Urbaines" },
              { key: "interurbaines", label: "Lignes Interurbaines" },
              { key: "demandes", label: "Demandes de Location" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={
                  activeTab === tab.key
                    ? "text-green-600 border-b-2 border-green-600 pb-1"
                    : "text-gray-500 hover:text-gray-700 pb-1"
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Plus size={20} className="text-green-600" />
            <span className="text-sm text-gray-600">Ajouter une ligne</span>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "urbaines" && <UrbainAdminComponent />}
          {activeTab === "interurbaines" && <InterurbainAdminComponent />}
          {activeTab === "demandes" && (
            <p className="text-center text-gray-500">Gestion des demandes de location bientôt disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
