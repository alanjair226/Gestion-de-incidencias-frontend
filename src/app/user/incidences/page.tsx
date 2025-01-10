"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPeriod } from "../../../utils/periods";
import { getUserIncidences } from "../../../utils/incidences";
import { Incidence } from "../../../types";

export default function UserIncidences() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));

        // Validar si el token ha expirado
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const userId: number = payload.id;

        const currentPeriod = await getCurrentPeriod(token);

        const incidencesData = await getUserIncidences(userId, currentPeriod.id, token);
        setIncidences(incidencesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <header className="bg-dark-secondary py-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
          <h1 className="text-3xl font-bold text-dark-accent text-center md:text-left">
            Mis Incidencias
          </h1>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={handleLogout}
              className="bg-dark-error text-dark-primary py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => router.push("/user/periods")}
              className="bg-dark-accent text-dark-primary py-2 px-4 rounded hover:bg-purple-700 transition"
            >
              Ver periodos anteriores
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-lg font-semibold text-dark-text-secondary">
            Cargando incidencias...
          </div>
        ) : error ? (
          <div className="text-center text-lg font-semibold text-dark-error">
            Error: {error}
          </div>
        ) : incidences.length === 0 ? (
          <p className="text-center text-lg text-dark-text-secondary">
            No hay incidencias registradas para el periodo actual.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidences.map((incidence) => (
              <li
                key={incidence.id}
                className="relative p-4 bg-dark-secondary rounded shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/user/incidences/${incidence.id}`)}
              >
                {/* Indicadores */}
                {incidence.status && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-dark-warning rounded-full"></span>
                )}
                {!incidence.valid && (
                  <span className="absolute top-2 right-6 w-3 h-3 bg-dark-success rounded-full"></span>
                )}

                <h2 className="text-xl font-bold text-dark-accent mb-2">{incidence.description}</h2>
                <p className="text-sm text-dark-text-secondary">
                  <strong>Severidad:</strong> {incidence.severity.name}
                </p>
                <p className="text-sm text-dark-text-secondary">
                  <strong>Creado:</strong> {new Date(incidence.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
