"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { getUserIncidences } from "../../../../../utils/incidences";
import { getUserPeriods } from "../../../../../utils/periods";
import { Incidence, UserScore } from "../../../../../types";

export default function PeriodDetails() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: periodId } = useParams();

  const userId = parseInt(searchParams.get("userId") || "0", 10); // Obtener el userId de los query params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        if (!userId || !periodId) {
          console.error("Faltan parámetros para obtener datos.");
          throw new Error("Parámetros inválidos en la URL.");
        }

        const parsedPeriodId = Array.isArray(periodId) ? parseInt(periodId[0], 10) : parseInt(periodId || "0", 10);

        if (isNaN(parsedPeriodId)) {
          throw new Error("El ID del periodo no es válido.");
        }

        // Obtener las incidencias del periodo
        const incidencesData = await getUserIncidences(userId, parsedPeriodId, token);
        setIncidences(incidencesData);

        // Obtener la calificación del periodo
        const periodsData: UserScore[] = await getUserPeriods(userId, token);
        const selectedPeriod = periodsData.find((p) => p.period.id === parsedPeriodId);
        setScore(selectedPeriod ? selectedPeriod.score : null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, periodId, router]);

  const getScoreClass = (score: number | null): string => {
    if (score === null) return "text-dark-text-secondary";
    if (score >= 85) return "text-dark-success";
    if (score >= 70) return "text-dark-warning";
    return "text-dark-error";
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <header className="bg-dark-secondary py-6 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-dark-accent text-center">
            Detalles del Periodo
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-lg font-semibold text-dark-text-secondary">
            Cargando detalles del periodo...
          </div>
        ) : error ? (
          <div className="text-center text-lg font-semibold text-dark-error">
            Error: {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Score */}
            <div className="text-center">
              <p className={`text-2xl font-bold ${getScoreClass(score)}`}>
                {score !== null ? `Calificación: ${score}` : "Calificación no disponible"}
              </p>
            </div>

            {/* Incidences */}
            {incidences.length === 0 ? (
              <p className="text-center text-lg text-dark-text-secondary">
                No hay incidencias registradas para este periodo.
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {incidences.map((incidence) => (
    <li
      key={incidence.id}
      className="relative p-6 bg-dark-secondary rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
      onClick={() => router.push(`/user/incidences/${incidence.id}`)}
    >
      {/* Indicadores */}
      {incidence.status && (
        <span className="absolute top-2 right-2 w-3 h-3 bg-dark-warning rounded-full"></span>
      )}
      {!incidence.valid && (
        <span className="absolute top-2 right-6 w-3 h-3 bg-dark-success rounded-full"></span>
      )}

      <h2 className="text-xl font-bold text-dark-accent mb-4">
        {incidence.description}
      </h2>
      <p className="text-sm text-dark-text-secondary mb-2">
        <strong>Severidad:</strong> {incidence.severity.name}
      </p>
      <p className="text-sm text-dark-text-secondary mb-2">
        <strong>Creado:</strong> {new Date(incidence.created_at).toLocaleString()}
      </p>
    </li>
  ))}
</ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
