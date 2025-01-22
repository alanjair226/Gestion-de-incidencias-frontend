"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserDetails } from "../../../../utils/admin";
import { getCommonIncidences } from "../../../../utils/common-incidences";
import { getSeverities } from "../../../../utils/severities";
import { getCurrentPeriod, getUserPeriods } from "../../../../utils/periods";
import { getUserIncidences, createIncidence } from "../../../../utils/incidences";
import { User, CommonIncidence, Severity, Incidence, UserScore } from "../../../../types";
import Image from "next/image";


export default function UserDetailsPage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id || "0", 10); // Convertir ID
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [commonIncidences, setCommonIncidences] = useState<CommonIncidence[]>([]);
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [currentIncidences, setCurrentIncidences] = useState<Incidence[]>([]);
  const [currentPeriodId, setCurrentPeriodId] = useState<number | null>(null); // ID del periodo actual
  const [score, setScore] = useState<number | null>(null); // Score del periodo actual
  const [newIncidence, setNewIncidence] = useState({
    description: "",
    assigned_to: userId,
    severity: "",
    period: 0,
  });
  const [selectedIncidence, setSelectedIncidence] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Obtener detalles del usuario
        const userData = await getUserDetails(userId, token);
        setUser(userData);

        // Obtener el periodo actual
        const currentPeriod = await getCurrentPeriod(token);
        setCurrentPeriodId(currentPeriod.id);
        setNewIncidence((prev) => ({ ...prev, period: currentPeriod.id }));

        // Obtener score del periodo actual
        const periodsData: UserScore[] = await getUserPeriods(userId, token);
        const selectedPeriod = periodsData.find((p) => p.period.id === currentPeriod.id);
        setScore(selectedPeriod ? selectedPeriod.score : null);

        // Obtener incidencias comunes y severidades
        const commonIncidencesData = await getCommonIncidences(token);
        setCommonIncidences(commonIncidencesData);

        const severitiesData = await getSeverities(token);
        setSeverities(severitiesData);

        // Obtener incidencias del periodo actual
        const incidencesData = await getUserIncidences(userId, currentPeriod.id, token);
        setCurrentIncidences(incidencesData);
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
  }, [router, userId]);

  const handleCreateIncidence = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      if (!newIncidence.description || !newIncidence.severity || !newIncidence.period) {
        alert("Debe llenar todos los campos requeridos.");
        return;
      }
  
      await createIncidence(newIncidence, token);
      alert("Incidencia creada exitosamente.");
  
      // Resetear campos y actualizar incidencias
      setNewIncidence((prev) => ({ ...prev, description: "", severity: "" }));
  
      // Actualizar las incidencias
      const updatedIncidences = await getUserIncidences(userId, currentPeriodId!, token);
      setCurrentIncidences(updatedIncidences);
  
      // Actualizar el score del periodo
      const periodsData: UserScore[] = await getUserPeriods(userId, token);
      const selectedPeriod = periodsData.find((p) => p.period.id === currentPeriodId);
      setScore(selectedPeriod ? selectedPeriod.score : null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
        console.error(err);
      }
    }
  };

  const handleCommonIncidenceChange = (value: string) => {
    setSelectedIncidence(value);
    const selected = commonIncidences.find((ci) => ci.incidence === value);
    if (selected) {
      setNewIncidence({
        ...newIncidence,
        description: selected.incidence,
        severity: selected.severity.name,
      });
    } else {
      setNewIncidence({
        ...newIncidence,
        description: "",
        severity: "",
      });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setSelectedIncidence(null); // Restablecer incidencia común seleccionada
    setNewIncidence((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSeverityChange = (value: string) => {
    setSelectedIncidence(null); // Restablecer incidencia común seleccionada
    setNewIncidence((prev) => ({
      ...prev,
      severity: value,
    }));
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <header className="bg-dark-secondary py-6 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-dark-accent text-center">Detalles del Usuario</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center text-lg font-semibold text-dark-text-secondary">
            Cargando datos del usuario...
          </div>
        ) : error ? (
          <div className="text-center text-lg font-semibold text-red-500">Error: {error}</div>
        ) : (
          <>
            {/* Datos Generales */}
            <section className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex flex-col items-center">
                <Image
                  src={user?.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                  alt={user?.username || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                  width={128}
                  height={128}
                  className="rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <p className="mt-2 text-lg">
                  <strong>Calificación:</strong>{" "}
                  <span
                    className={`font-bold ${score !== null && score >= 85
                        ? "text-dark-success"
                        : score !== null
                          ? "text-dark-warning"
                          : "text-dark-error"
                      }`}
                  >
                    {score !== null ? score : "No disponible"}
                  </span>
                </p>
              </div>
              <div>
                <button
                  onClick={() => router.push(`/admin/users/periods?userId=${userId}`)}
                  className="bg-dark-accent text-dark-primary py-2 px-4 rounded hover:bg-purple-700 transition"
                >
                  Ver Periodos
                </button>
              </div>
            </section>

            {/* Formulario Crear Incidencia */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Nueva Incidencia</h2>
              <div className="flex flex-col gap-4">
                <select
                  value={selectedIncidence || ""}
                  onChange={(e) => handleCommonIncidenceChange(e.target.value)}
                  className="w-full p-2 rounded bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                >
                  <option value="">Seleccionar Incidencia Común</option>
                  {commonIncidences.map((ci) => (
                    <option key={ci.id} value={ci.incidence}>
                      {ci.incidence}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Descripción personalizada"
                  value={newIncidence.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="w-full p-2 rounded bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                />
                <select
                  value={newIncidence.severity}
                  onChange={(e) => handleSeverityChange(e.target.value)}
                  className="w-full p-2 rounded bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                >
                  <option value="">Seleccionar Severidad</option>
                  {severities.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreateIncidence}
                className="mt-4 bg-dark-success text-dark-primary py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Crear Incidencia
              </button>
            </section>

            {/* Incidencias del Periodo Actual */}
            <section>
              <h2 className="text-xl font-bold mb-4">Incidencias del Periodo Actual</h2>
              {currentIncidences.length === 0 ? (
                <p className="text-center">No hay incidencias registradas en el periodo actual.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentIncidences.map((incidence) => (
                    <li
                      key={incidence.id}
                      className="relative p-4 bg-dark-secondary rounded shadow-md hover:shadow-lg transition cursor-pointer"
                      onClick={() => router.push(`/user/incidences/${incidence.id}`)}
                    >
                      {/* Indicadores */}
                      {incidence.status && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-dark-warning rounded-full"></span>
                      )}
                      {!incidence.valid && (
                        <span className="absolute top-2 right-6 w-3 h-3 bg-dark-success rounded-full"></span>
                      )}

                      <h3 className="font-bold text-dark-accent">{incidence.description}</h3>
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
            </section>
          </>
        )}
      </main>
    </div>
  );
}
