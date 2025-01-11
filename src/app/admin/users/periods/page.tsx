"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserPeriods } from "../../../../utils/periods";
import { UserScore } from "../../../../types";

export default function AdminUserPeriods() {
  const [periods, setPeriods] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = parseInt(searchParams.get("userId") || "0", 10); // Obtener el `userId` de los query params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        if (!userId) {
          throw new Error("No se proporcionó el ID del usuario.");
        }

        const periodsData = await getUserPeriods(userId, token);
        // Ordenar los periodos por `start_date` más reciente
        const sortedPeriods = periodsData.sort(
          (a, b) => new Date(b.period.start_date).getTime() - new Date(a.period.start_date).getTime()
        );
        setPeriods(sortedPeriods);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, userId]);

  const formatDate = (date: string | null): string =>
    date ? new Date(date).toLocaleDateString() : "Actualidad";

  const getPeriodClass = (isOpen: boolean): string =>
    isOpen
      ? "bg-dark-accent text-dark-primary"
      : "bg-dark-secondary text-dark-text-primary";

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <header className="bg-dark-secondary py-6 shadow-md">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-dark-accent">Periodos del Usuario</h1>
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
        ) : periods.length === 0 ? (
          <p className="text-center text-lg text-dark-text-secondary">
            No hay periodos registrados para este usuario.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {periods.map(({ period }) => (
              <li
                key={period.id}
                className={`p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all ${getPeriodClass(
                  period.is_open
                )}`}
                onClick={() =>
                  router.push(`/admin/users/periods/${period.id}?userId=${userId}`)
                }
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
