"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserPeriods } from "../../../utils/periods";
import { UserScore } from "../../../types";

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
        setPeriods(periodsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const formatDate = (date: string | null): string =>
    date ? new Date(date).toLocaleDateString() : "actualidad";

  const getPeriodClass = (isOpen: boolean): string =>
    isOpen ? "bg-dark-period-actual text-dark-primary" : "bg-dark-period-past text-dark-primary";

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <header className="bg-dark-secondary py-6 shadow-md">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold text-dark-accent">Mis Periodos</h1>
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
