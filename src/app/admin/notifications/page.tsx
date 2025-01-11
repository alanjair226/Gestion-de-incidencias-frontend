"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminNotifications } from "../../../utils/admin";
import { updateIncidenceStatus } from "../../../utils/incidences";
import { Incidence } from "../../../types";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Incidence[]>([]);
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
        const adminId: number = payload.id;

        const notificationsData = await getAdminNotifications(adminId, token);
        setNotifications(notificationsData);
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

  const handleAction = async (incidenceId: number, action: "conserve" | "annul") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const body = action === "annul" ? { status: false, valid: false } : { status: false };
      await updateIncidenceStatus(incidenceId, body, token);

      // Actualizar la lista de notificaciones
      setNotifications((prev) => prev.filter((notif) => notif.id !== incidenceId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
  {/* Header */}
  <header className="bg-dark-secondary py-6 shadow-md">
    <div className="container mx-auto px-6 flex justify-center items-center">
      <h1 className="text-3xl font-bold text-dark-accent">
        Notificaciones de Incidencias
      </h1>
    </div>
  </header>

  {/* Main Content */}
  <main className="container mx-auto px-6 py-8">
    {loading ? (
      <div className="text-center text-lg font-semibold text-dark-text-secondary">
        Cargando notificaciones...
      </div>
    ) : error ? (
      <div className="text-center text-lg font-semibold text-dark-error">
        Error: {error}
      </div>
    ) : notifications.length === 0 ? (
      <p className="text-center text-lg text-dark-text-secondary">
        No tienes incidencias en revisión.
      </p>
    ) : (
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.map((notif) => (
          <li
            key={notif.id}
            className="p-6 bg-dark-secondary rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-dark-accent mb-3">
                {notif.description}
              </h2>
              <div className="text-sm text-dark-text-secondary space-y-2">
                <p>
                  <strong>Severidad:</strong> {notif.severity.name}
                </p>
                <p>
                  <strong>Comentario:</strong> {notif.comment || "Sin comentario"}
                </p>
                <p>
                  <strong>Asignado a:</strong> {notif.assigned_to.username}
                </p>
                <p>
                  <strong>Creado el:</strong>{" "}
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={() => handleAction(notif.id, "conserve")}
                className="w-full bg-dark-success text-dark-primary py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Conservar
              </button>
              <button
                onClick={() => handleAction(notif.id, "annul")}
                className="w-full bg-dark-error text-dark-primary py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Anular
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </main>
</div>

  );
}
