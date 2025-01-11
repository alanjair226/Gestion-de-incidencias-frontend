"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Incidence, User } from "../../../types";
import { getUsers, getAdminNotifications } from "../../../utils/admin";
import Image from "next/image";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Incidence[]>([]);
  const [search, setSearch] = useState<string>(""); // Estado para el filtro
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

        // Obtener usuarios
        const usersData = await getUsers(token);
        setUsers(usersData);
        setFilteredUsers(usersData); // Inicializar usuarios filtrados

        // Obtener notificaciones
        const payload = JSON.parse(atob(token.split(".")[1]));
        const adminId: number = payload.id;
        const notificationsData = await getAdminNotifications(adminId, token);
        setNotifications(notificationsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Actualizar la lista filtrada en base al término de búsqueda
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(lowerSearch)));
  }, [search, users]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <header className="bg-dark-secondary py-6 shadow-md">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-dark-accent text-center md:text-left">
            Incidencias OnFiber
          </h1>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-dark-error text-dark-primary py-2 px-6 rounded-lg shadow hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-lg font-semibold text-dark-text-secondary">
            Cargando información...
          </div>
        ) : error ? (
          <div className="text-center text-lg font-semibold text-dark-error">
            Error: {error}
          </div>
        ) : (
          <>
            {/* Filtro */}
            <section className="mb-6">
              <input
                type="text"
                placeholder="Buscar usuarios por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 rounded-lg bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
              />
            </section>

            {/* Botones de acceso */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => router.push("/user/incidences")}
                className="p-6 bg-dark-accent text-dark-primary rounded-lg shadow-md hover:shadow-lg transition text-center font-semibold"
              >
                Ver Incidencias Asignadas
              </button>
              <button
                onClick={() => router.push("/admin/notifications")}
                className="p-6 bg-dark-warning text-dark-primary rounded-lg shadow-md hover:shadow-lg transition text-center font-semibold"
              >
                Notificaciones ({notifications.length})
              </button>
              <button
                onClick={() => router.push("/admin/settings")}
                className="p-6 bg-dark-secondary text-dark-text-secondarysecondary rounded-lg shadow-md hover:shadow-lg transition text-center font-semibold"
              >
                Configuración (Periodos, Severidades, Incidencias Comunes)
              </button>
            </section>

            {/* Lista de usuarios */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-dark-accent">Usuarios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-6 bg-dark-secondary rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-center"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >

                    <Image
                      src={user.image}
                      alt={user.username}
                      width={96}
                      height={96}
                      className="rounded-full mx-auto mb-4 shadow-md"
                    />
                    <h3 className="text-xl font-bold text-dark-accent">{user.username}</h3>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>

  );
}
