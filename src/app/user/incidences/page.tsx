"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPeriod } from "../../../utils/periods";
import { getUserIncidences } from "../../../utils/incidences";
import { getUserScore } from "../../../utils/scores";
import { Incidence } from "../../../types";
import HeaderUser from "@/components/HeaderUser";

export default function UserIncidences() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
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

        // Obtener el periodo actual
        const currentPeriod = await getCurrentPeriod(token);

        // Obtener incidencias del periodo actual
        const incidencesData = await getUserIncidences(
          userId,
          currentPeriod.id,
          token
        );
        setIncidences(incidencesData);

        // Obtener el score del periodo actual
        const score = await getUserScore(userId, currentPeriod.id, token);
        setCurrentScore(score);
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
  }, [router]);

  const getScoreClass = (score: number | null): string => {
    if (score === null) return "text-dark-text-secondary";
    if (score >= 85) return "text-dark-success";
    if (score >= 70) return "text-dark-warning";
    return "text-dark-error";
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <HeaderUser title="Mis Incidencias"/>

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
        ) : (
          <>
            {/* Score */}
            <section className="mb-6 text-center">
              <h3 className={`text-2xl font-bold ${getScoreClass(currentScore)}`}>
                {currentScore !== null
                  ? `Score Actual: ${currentScore}`
                  : "No hay score disponible"}
              </h3>
            </section>

            {/* Incidencias */}
            {incidences.length === 0 ? (
              <p className="text-center text-lg text-dark-text-secondary">
                No hay incidencias registradas para el periodo actual.
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incidences.map((incidence) => (
                  <li
                    key={incidence.id}
                    className="relative p-6 bg-dark-secondary rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
                    onClick={() => router.push(`/user/incidences/${incidence.id}`)}
                  >
                    {/* Indicadores */}
                    {incidence.status && (
                      <span className="absolute top-2 right-2 w-3 h-3 bg-dark-warning rounded-full"></span>
                    )}
                    {!incidence.valid && (
                      <span className="absolute top-2 right-6 w-3 h-3 bg-dark-success rounded-full"></span>
                    )}

                    <h2 className="text-xl font-bold text-dark-accent mb-2">
                      {incidence.description}
                    </h2>
                    <p className="text-sm text-dark-text-secondary">
                      <strong>Severidad:</strong> {incidence.severity.name}
                    </p>
                    <p className="text-sm text-dark-text-secondary">
                      <strong>Creado:</strong>{" "}
                      {new Date(incidence.created_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
