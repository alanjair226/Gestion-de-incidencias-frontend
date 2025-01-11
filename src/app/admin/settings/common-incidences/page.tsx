"use client";

import { useEffect, useState } from "react";
import {
  getCommonIncidences,
  createCommonIncidence,
  updateCommonIncidence,
} from "../../../../utils/common-incidences";
import { getSeverities } from "../../../../utils/severities";
import { CommonIncidence, Severity } from "../../../../types";

export default function CommonIncidencesPage() {
  const [commonIncidences, setCommonIncidences] = useState<CommonIncidence[]>([]);
  const [filteredIncidences, setFilteredIncidences] = useState<CommonIncidence[]>([]);
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [newIncidence, setNewIncidence] = useState({ incidence: "", severity: "" });
  const [filter, setFilter] = useState({ incidence: "", severity: "" }); // Estados para filtros
  const [editing, setEditing] = useState<number | null>(null); // ID de incidencia en edición
  const [editedIncidence, setEditedIncidence] = useState({ incidence: "", severity: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No estás autenticado");

        const incidencesData = await getCommonIncidences(token);
        setCommonIncidences(incidencesData);
        setFilteredIncidences(incidencesData);

        const severitiesData = await getSeverities(token);
        setSeverities(severitiesData);
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

  useEffect(() => {
    // Filtrar por incidencia y gravedad
    const filtered = commonIncidences.filter(
      (incidence) =>
        incidence.incidence.toLowerCase().includes(filter.incidence.toLowerCase()) &&
        (filter.severity === "" || incidence.severity.name === filter.severity)
    );
    setFilteredIncidences(filtered);
  }, [filter, commonIncidences]);

  const handleCreateIncidence = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      if (!newIncidence.incidence || !newIncidence.severity) {
        throw new Error("Faltan campos obligatorios");
      }

      await createCommonIncidence(newIncidence.incidence, newIncidence.severity, token);
      setNewIncidence({ incidence: "", severity: "" });

      const updatedIncidences = await getCommonIncidences(token);
      setCommonIncidences(updatedIncidences);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
        console.error(err);
      }
    }
  };

  const handleStartEditing = (id: number, incidence: string, severity: string) => {
    setEditing(id);
    setEditedIncidence({ incidence, severity });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      await updateCommonIncidence(id, editedIncidence.incidence, editedIncidence.severity, token);

      const updatedIncidences = await getCommonIncidences(token);
      setCommonIncidences(updatedIncidences);

      setEditing(null);
      setEditedIncidence({ incidence: "", severity: "" });
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
  <header className="bg-dark-secondary py-6 shadow-md">
    <div className="container mx-auto px-6">
      <h1 className="text-3xl font-bold text-dark-accent text-center">
        Configuración de Incidencias Comunes
      </h1>
    </div>
  </header>

  {/* Main Content */}
  <main className="container mx-auto px-6 py-8">
    {loading ? (
      <div className="text-center text-lg font-semibold text-dark-text-secondary">
        Cargando incidencias comunes...
      </div>
    ) : error ? (
      <div className="text-center text-lg font-semibold text-dark-error">
        Error: {error}
      </div>
    ) : (
      <div className="space-y-8">
        {/* Filtros */}
        <div className="p-6 bg-dark-secondary rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-dark-accent">Filtros</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Filtrar por descripción"
              value={filter.incidence}
              onChange={(e) =>
                setFilter({ ...filter, incidence: e.target.value })
              }
              className="w-full md:w-1/2 p-2 rounded bg-dark-primary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
            />
            <select
              value={filter.severity}
              onChange={(e) =>
                setFilter({ ...filter, severity: e.target.value })
              }
              className="w-full md:w-1/2 p-2 rounded bg-dark-primary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
            >
              <option value="">Filtrar por gravedad</option>
              {severities.map((severity) => (
                <option key={severity.id} value={severity.name}>
                  {severity.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Crear Nueva Incidencia Común */}
        <div className="p-6 bg-dark-secondary rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-dark-accent">
            Crear Nueva Incidencia Común
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Descripción de la incidencia"
              value={newIncidence.incidence}
              onChange={(e) =>
                setNewIncidence({ ...newIncidence, incidence: e.target.value })
              }
              className="w-full p-2 rounded bg-dark-primary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
            />
            <select
              value={newIncidence.severity}
              onChange={(e) =>
                setNewIncidence({ ...newIncidence, severity: e.target.value })
              }
              className="w-full p-2 rounded bg-dark-primary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
            >
              <option value="" disabled>
                Seleccionar Severidad
              </option>
              {severities.map((severity) => (
                <option key={severity.id} value={severity.name}>
                  {severity.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreateIncidence}
            className="mt-4 bg-dark-success text-dark-primary py-2 px-4 rounded hover:bg-green-700 transition font-semibold"
          >
            Crear Nueva Incidencia
          </button>
        </div>

        {/* Listado de Incidencias Comunes */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIncidences.map((incidence) =>
            editing === incidence.id ? (
              <li key={incidence.id} className="p-6 bg-dark-secondary rounded shadow-md">
                <input
                  type="text"
                  value={editedIncidence.incidence}
                  onChange={(e) =>
                    setEditedIncidence({
                      ...editedIncidence,
                      incidence: e.target.value,
                    })
                  }
                  className="w-full p-2 mb-2 rounded bg-dark-primary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                />
                <select
                  value={editedIncidence.severity}
                  onChange={(e) =>
                    setEditedIncidence({
                      ...editedIncidence,
                      severity: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded bg-dark-primary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                >
                  {severities.map((severity) => (
                    <option key={severity.id} value={severity.name}>
                      {severity.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSaveEdit(incidence.id)}
                  className="mt-2 bg-dark-success text-dark-primary py-2 px-4 rounded hover:bg-green-700 transition font-semibold"
                >
                  Guardar
                </button>
              </li>
            ) : (
              <li key={incidence.id} className="p-6 bg-dark-secondary rounded shadow-md">
                <p>
                  <strong>Incidencia:</strong> {incidence.incidence}
                </p>
                <p>
                  <strong>Severidad:</strong> {incidence.severity.name}
                </p>
                <button
                  onClick={() =>
                    handleStartEditing(
                      incidence.id,
                      incidence.incidence,
                      incidence.severity.name
                    )
                  }
                  className="mt-2 bg-dark-warning text-dark-primary py-2 px-4 rounded hover:bg-yellow-700 transition font-semibold"
                >
                  Editar
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    )}
  </main>
</div>

  );
}
