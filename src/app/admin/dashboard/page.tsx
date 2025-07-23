"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../../../types";
import { getUsers } from "../../../utils/admin";
import UserCard from "@/components/UserCard";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
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

  // Actualizar la lista filtrada en base al término de búsqueda
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(lowerSearch)));
  }, [search, users]);

  return (
    <div className="min-h-screen text-dark-text-primary">
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


            {/* Buscador de usuarios */}
            <section className="flex flex-col md:flex-row md:justify-between mb-8 mt-8">
              <div className="w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 rounded-lg bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                />
              </div>
            </section>

            {/* Lista de usuarios */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-dark-accent">Usuarios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onClick={(id) => router.push(`/admin/users/${id}`)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>

  );
}
