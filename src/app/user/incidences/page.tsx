"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentPeriod } from "../../../utils/periods";
import { getUserIncidences } from "../../../utils/incidences";
import { getUserScore } from "../../../utils/scores";
import { Incidence } from "../../../types";
import HeaderUser from "@/components/HeaderUser";
import IncidenceCard from "@/components/IncidenceCard"; // Import the IncidenceCard component here

export default function UserIncidences() {
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
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
        setRole(payload.role); // Save the role here

        // Validate if the token has expired
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const userId: number = payload.id;

        // Get the current period
        const currentPeriod = await getCurrentPeriod(token);

        // Get incidences for the current period
        const incidencesData = await getUserIncidences(
          userId,
          currentPeriod.id,
          token
        );
        setIncidences(incidencesData);

        // Get the score for the current period
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
    <div className="min-h-screen text-dark-text-primary">
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
                  <IncidenceCard key={incidence.id} incidence={incidence} /> // Use the IncidenceCard component here
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}