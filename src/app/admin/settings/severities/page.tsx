"use client";

import { useEffect, useState } from "react";
import { getSeverities, createSeverity } from "../../../../utils/severities";
import { Severity } from "../../../../types";
import Header from "@/components/Header";

export default function SeveritiesPage() {
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [newSeverity, setNewSeverity] = useState({ name: "", value: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No estás autenticado");

        const data = await getSeverities(token);
        setSeverities(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocurrió un error inesperado');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateSeverity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      if (!newSeverity.name || newSeverity.value <= 0) {
        throw new Error("El nombre o el valor no son válidos");
      }

      await createSeverity(newSeverity.name, newSeverity.value, token);
      setNewSeverity({ name: "", value: 0 });

      const updatedSeverities = await getSeverities(token);
      setSeverities(updatedSeverities);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <Header title="Configuración de Severidades"/>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-lg font-semibold text-dark-text-secondary">
            Cargando severidades...
          </div>
        ) : error ? (
          <div className="text-center text-lg font-semibold text-dark-error">
            Error: {error}
          </div>
        ) : (
          <>
            {/* Crear Nueva Severidad */}
            <div className="mb-6">
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Nombre de la severidad"
                  value={newSeverity.name}
                  onChange={(e) =>
                    setNewSeverity({ ...newSeverity, name: e.target.value })
                  }
                  className="w-full p-2 rounded bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                />
                <input
                  type="number"
                  placeholder="Valor de la severidad"
                  value={newSeverity.value}
                  onChange={(e) =>
                    setNewSeverity({ ...newSeverity, value: parseInt(e.target.value, 10) })
                  }
                  className="w-full p-2 rounded bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                />
              </div>
              <button
                onClick={handleCreateSeverity}
                className="bg-dark-success text-dark-primary py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Crear Nueva Severidad
              </button>
            </div>

            {/* Listado de Severidades */}
            <ul className="space-y-4">
              {severities.map((severity) => (
                <li
                  key={severity.id}
                  className="p-4 bg-dark-secondary rounded shadow-md"
                >
                  <p>
                    <strong>Nombre:</strong> {severity.name}
                  </p>
                  <p>
                    <strong>Valor:</strong> {severity.value}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
