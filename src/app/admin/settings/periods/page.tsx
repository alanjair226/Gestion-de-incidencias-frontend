"use client";

import { useEffect, useState } from "react";
import { getPeriods, createPeriod, closePeriod } from "../../../../utils/periods";
import { Period } from "../../../../types";

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No estás autenticado");

        const data = await getPeriods(token);
        setPeriods(data);
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

  const handleCreatePeriod = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      await createPeriod(token);
      const updatedPeriods = await getPeriods(token);
      setPeriods(updatedPeriods);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
        console.error(err);
      }
    }
  };

  const handleClosePeriod = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      await closePeriod(id, token);
      const updatedPeriods = await getPeriods(token);
      setPeriods(updatedPeriods);
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
        Configuración de Periodos
      </h1>
    </div>
  </header>

  {/* Main Content */}
  <main className="container mx-auto px-6 py-8">
    {loading ? (
      <div className="text-center text-lg font-semibold text-dark-text-secondary">
        Cargando periodos...
      </div>
    ) : error ? (
      <div className="text-center text-lg font-semibold text-dark-error">
        Error: {error}
      </div>
    ) : (
      <div className="space-y-6">
        {/* Botón de creación */}
        <div className="text-center">
          <button
            onClick={handleCreatePeriod}
            className="bg-dark-success text-dark-primary py-3 px-6 rounded shadow-md hover:bg-green-700 transition font-semibold"
          >
            Crear Nuevo Periodo
          </button>
        </div>

        {/* Listado de periodos */}
        <ul className="space-y-4">
          {periods.map((period) => (
            <li
              key={period.id}
              className={`p-4 rounded shadow-md flex justify-between items-center ${
                period.is_open
                  ? "bg-dark-period-actual text-dark-primary"
                  : "bg-dark-secondary"
              }`}
            >
              <div>
                <p className="text-lg font-bold">
                  {period.is_open ? "Periodo Actual" : "Periodo Anterior"}
                </p>
                <p className="text-sm">
                  <strong>Inicio:</strong> {new Date(period.start_date).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <strong>Fin:</strong>{" "}
                  {period.end_date
                    ? new Date(period.end_date).toLocaleDateString()
                    : "Actualidad"}
                </p>
              </div>
              {period.is_open && (
                <button
                  onClick={() => handleClosePeriod(period.id)}
                  className="bg-dark-error text-dark-primary py-2 px-4 rounded hover:bg-red-700 transition font-semibold"
                >
                  Cerrar Periodo
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
  </main>
</div>

  );
}
