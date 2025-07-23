"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserPeriods } from '../../../../utils/periods';
import { UserScore } from '../../../../types';
import Header from '@/components/Header';
// This function wraps the use of `useSearchParams` and returns the userId
function UserIdFetcher() {
  const searchParams = useSearchParams();
  return parseInt(searchParams.get("userId") || "0", 10);
}

export default function AdminUserPeriods() {
  const [periods, setPeriods] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const userId = UserIdFetcher(); // Get userId using the fetcher function

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
  }, [userId]);

  const formatDate = (date: string | null): string =>
    date ? new Date(date).toLocaleDateString() : "Actualidad";

  const getPeriodClass = (isOpen: boolean): string =>
    isOpen ? "bg-dark-accent text-dark-primary" : "bg-dark-secondary text-dark-text-primary";

  return (
    <Suspense fallback={<div>Cargando periodos del usuario...</div>}>
      <div className="min-h-screen text-dark-text-primary">
        <Header title="Periodos del Usuario"/>
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
                  onClick={() => router.push(`/admin/users/periods/${period.id}?userId=${userId}`)}
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
    </Suspense>
  );
}
