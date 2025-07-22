"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserDetails } from "../../../../utils/admin";
import { getCommonIncidences } from "../../../../utils/common-incidences";
import { getSeverities } from "../../../../utils/severities";
import { getCurrentPeriod, getUserPeriods } from "../../../../utils/periods";
import {
  getUserIncidences,
  createIncidence,
  uploadIncidenceImage,
} from "../../../../utils/incidences";
import { User, CommonIncidence, Severity, Incidence, UserScore } from "../../../../types";
import Image from "next/image";

export default function UserDetailsPage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id || "0", 10);
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const [user, setUser] = useState<User | null>(null);
  const [commonIncidences, setCommonIncidences] = useState<CommonIncidence[]>([]);
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [currentIncidences, setCurrentIncidences] = useState<Incidence[]>([]);
  const [currentPeriodId, setCurrentPeriodId] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [newIncidence, setNewIncidence] = useState({
    description: "",
    assigned_to: userId,
    severity: "",
    period: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [commonIncidenceSearch, setCommonIncidenceSearch] = useState("");
  const [showCommonIncidenceList, setShowCommonIncidenceList] = useState(false);

  // Buscar incidencias comunes por palabras clave
  const filteredCommonIncidences = commonIncidences.filter((ci) => {
    const search = commonIncidenceSearch.toLowerCase().trim();
    if (!search) return false;
    // Divide la búsqueda en palabras y verifica que todas estén presentes
    return search
      .split(" ")
      .every((word) => ci.incidence.toLowerCase().includes(word));
  });

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
          setError("Ocurrió un error inesperado");
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

      // Crear la incidencia y obtener la data (incluye el id)
      const createdIncidence = await createIncidence(newIncidence, token);
      if (!createdIncidence) {
        alert("No se pudo crear la incidencia");
        return;
      }
      alert("Incidencia creada exitosamente.");

      // Subir cada imagen seleccionada
      if (selectedFiles.length > 0) {
        await Promise.all(
          selectedFiles.map((file) => uploadIncidenceImage(createdIncidence.id, file, token))
        );
        alert("Imágenes subidas exitosamente.");
      }

      // Resetear campos: descripción, severidad, incidencia común y archivos
      setNewIncidence((prev) => ({ ...prev, description: "", severity: "" }));
      setSelectedFiles([]);
      setFileInputKey(Date.now()); // Forzar reinicio del input file

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



  const handleDescriptionChange = (value: string) => {
    setNewIncidence((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSeverityChange = (value: string) => {
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
                  src={
                    user?.image ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                  }
                  alt={user?.username || "Imagen de perfil"}
                  width={128}
                  height={128}
                  className="rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold">{user?.username}</h2>
                <p className="mt-2 text-lg">
                  <strong>Calificación:</strong>{" "}
                  <span
                    className={`font-bold ${
                      score !== null && score >= 85
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
                <div className="relative">
                  <input
                    type="text"
                    value={commonIncidenceSearch}
                    onChange={(e) => {
                      setCommonIncidenceSearch(e.target.value);
                      setShowCommonIncidenceList(true);
                    }}
                    onFocus={() => setShowCommonIncidenceList(true)}
                    onBlur={() => setTimeout(() => setShowCommonIncidenceList(false), 150)}
                    placeholder="Buscar incidencia común..."
                    className="w-full p-2 rounded bg-dark-secondary text-dark-text-primary border border-dark-secondary focus:outline-none focus:ring-2 focus:ring-dark-accent"
                    autoComplete="off"
                  />
                  {showCommonIncidenceList && filteredCommonIncidences.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full bg-dark-secondary border border-dark-accent rounded w-full max-h-48 overflow-y-auto mt-1 z-20">
                      {filteredCommonIncidences.map((ci) => (
                        <li
                          key={ci.id}
                          className="p-2 cursor-pointer hover:bg-dark-accent hover:text-dark-primary"
                          onMouseDown={() => {
                            setCommonIncidenceSearch(ci.incidence);
                            setShowCommonIncidenceList(false);
                            setNewIncidence({
                              ...newIncidence,
                              description: ci.incidence,
                              severity: ci.severity.name,
                            });
                          }}
                        >
                          {ci.incidence}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
                <input
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                  className="mt-4"
                />
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
