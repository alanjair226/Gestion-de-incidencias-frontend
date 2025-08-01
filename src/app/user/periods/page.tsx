"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserPeriods } from "../../../utils/periods";
import { UserScore } from "../../../types";
import HeaderUser from "@/components/HeaderUser";

export default function UserPeriods() {
  const [periods, setPeriods] = useState<UserScore[]>([]);
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
        const userId: number = payload.id;

        const periodsData = await getUserPeriods(userId, token);
        // Ordenar los periodos por `start_date` más reciente
        const sortedPeriods = periodsData.sort(
          (a, b) => new Date(b.period.start_date).getTime() - new Date(a.period.start_date).getTime()
        );

        setPeriods(sortedPeriods);
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

  const formatDate = (date: string | null): string =>
    date ? new Date(date).toLocaleDateString() : "actualidad";

  const getPeriodClass = (isOpen: boolean): string =>
    isOpen
      ? "bg-dark-accent text-dark-primary"
      : "bg-dark-secondary text-dark-text-primary";

  return (
    <div className="min-h-screen text-dark-text-primary">
      {/* Header */}
      <HeaderUser 
      title="Mis Periodos" 
      ButtonText="Volver a incidencias"
      ButtonRoute="/user/incidences"
      />

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
        ) : periods.length === 0 ? (
          <p className="text-center text-lg text-dark-text-secondary">
            No hay periodos registrados.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {periods.map(({ period }) => (
              <li
                key={period.id}
                className={`p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all ${getPeriodClass(
                  period.is_open
                )}`}
                onClick={() => router.push(`/user/periods/${period.id}`)}
              >
                <p className="text-lg font-bold text-center">
                  {`${formatDate(period.start_date)} a ${formatDate(period.end_date)}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
