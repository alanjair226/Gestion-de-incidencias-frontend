"use client";

import { useEffect, useState } from "react";
import { getPeriods, createPeriod, closePeriod, downloadReport } from "../../../../utils/periods";
import { Period } from "../../../../types";
import Header from "@/components/Header";

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
          setError("Ocurrió un error inesperado");
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
        setError("Ocurrió un error inesperado");
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
        setError("Ocurrió un error inesperado");
        console.error(err);
      }
    }
  };

  const handleDownloadReport = async (periodId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const blob = await downloadReport(periodId, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "incidences-report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error(err);
      alert("Error al descargar el reporte");
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <Header title="Configuración de Periodos"/>

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
                  <div className="flex space-x-2">
                    {period.is_open && (
                      <button
                        onClick={() => handleClosePeriod(period.id)}
                        className="bg-dark-error text-dark-primary py-2 px-4 rounded hover:bg-red-700 transition font-semibold"
                      >
                        Cerrar Periodo
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadReport(period.id)}
                      className=" bg-purple-400 text-dark-primary py-2 px-4 rounded hover:bg-purple-700 transition font-semibold"
                    >
                      Descargar Reporte
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
