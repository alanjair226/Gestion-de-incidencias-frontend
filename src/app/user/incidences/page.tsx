"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPeriod } from "../../../utils/periods";
import { getUserIncidences } from "../../../utils/incidences";
import { getUserScore } from "../../../utils/scores";
import { Incidence } from "../../../types";
import HeaderUser from "@/components/HeaderUser";
import IncidenceCard from "@/components/IncidenceCard";

export default function UserIncidences() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  const getScoreEmoji = (score: number | null) => {
        if (score === null) {
            return "👻";
        } else if (score >= 95) {
            return "🏆👑";
        } else if (score >= 90) {
            return "🚀✨";
        } else if (score >= 85) {
            return "😎👌";
        } else if (score >= 80) {
            return "📈🤨";
        } else if (score >= 75) {
            return "🤷‍♀️";
        } else if (score >= 70) {
            return "🤔🙄";
        } else if (score >= 60) {
            return "📉🤦‍♂️";
        } else if (score >= 50) {
            return "🚩🚨";
        } else if (score >= 30) {
            return "😵‍💫🗑️";
        } else {
            return "💀⚰️";
        }
    };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);

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

  // Function to determine text color for the score
  const getScoreTextColorClass = (score: number | null): string => {
    if (score === null) return "text-dark-text-secondary";
    if (score >= 90) return "text-dark-success";
    if (score >= 70) return "text-dark-warning";
    return "text-dark-error";
  };

  const scoreTextColorClass = getScoreTextColorClass(currentScore);


  return (
    <div className="min-h-screen text-dark-text-primary bg-dark-bg"> {/* Added bg-dark-bg for full page background */}
      {/* Header */}
      <HeaderUser
        title="Mis Incidencias"
        ButtonText={
          role === "admin" || role === "superadmin"
            ? "Volver al dashboard"
            : undefined
        }
        ButtonRoute={
          role === "admin" || role === "superadmin"
            ? "/admin/dashboard"
            : undefined
        }
      />

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
            {/* Score Section */}
            <section className="mb-8 p-6 bg-dark-secondary rounded-lg shadow-xl border-2 border-dark-border text-center">
              <h3 className="text-xl font-bold text-dark-text-primary mb-2">Tu Calificación Actual</h3>
              <p className={`text-5xl font-extrabold flex items-center justify-center gap-4 ${scoreTextColorClass}`}>
                {currentScore !== null ? currentScore : "N/A"}
                <span className="text-5xl"> {/* Emoji size matches score number */}
                  {getScoreEmoji(currentScore)}
                </span>
              </p>
              {currentScore === null && (
                  <p className="text-dark-text-secondary mt-2">No hay calificación disponible para este período.</p>
              )}
            </section>

            {/* Incidencias */}
            {incidences.length === 0 ? (
              <p className="text-center text-lg text-dark-text-secondary mt-8">
                No hay incidencias registradas para el periodo actual.
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incidences.map((incidence) => (
                  <IncidenceCard key={incidence.id} incidence={incidence} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}