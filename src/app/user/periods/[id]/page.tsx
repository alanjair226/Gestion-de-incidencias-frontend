"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserIncidences } from "../../../../utils/incidences";
import { getUserPeriods } from "../../../../utils/periods";
import { Incidence, UserScore } from "../../../../types";
import HeaderUser from "@/components/HeaderUser";

export default function PeriodDetails() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams(); // Obtenemos el ID del periodo dinámicamente

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId: number = payload.id;

        // Obtener las incidencias del periodo
        const incidencesData = await getUserIncidences(userId, Number(id), token);
        // Ordenar incidencias por fecha más reciente
        const sortedIncidences = incidencesData.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setIncidences(sortedIncidences);

        // Obtener la calificación del periodo
        const periodsData: UserScore[] = await getUserPeriods(userId, token);
        const selectedPeriod = periodsData.find((p) => p.period.id === Number(id));
        setScore(selectedPeriod ? selectedPeriod.score : null);
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
  }, [id, router]);

  const getScoreClass = (score: number | null): string => {
    if (score === null) return "text-dark-text-secondary";
    if (score >= 85) return "text-dark-success";
    if (score >= 70) return "text-dark-warning";
    return "text-dark-error";
  };

  return (
    <div className="min-h-screen text-dark-text-primary">
      {/* Header */}
      <HeaderUser 
      title="Mis Periodos" 
      ButtonText="Volver a periodos"
      ButtonRoute="/user/periods"
      />

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
          <>
            {/* Score */}
            <div className="text-center mb-8">
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
                    className="p-4 bg-dark-secondary rounded shadow-md hover:shadow-lg transition cursor-pointer"
                    onClick={() => router.push(`/user/incidences/${incidence.id}`)}
                  >
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
          </>
        )}
      </main>
    </div>
  );
}
