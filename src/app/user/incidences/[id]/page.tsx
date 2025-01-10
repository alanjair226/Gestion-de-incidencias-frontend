"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Incidence } from "../../../../types";
import { addCommentToIncidence } from "../../../../utils/incidences";

export default function IncidenceDetails() {
  const [incidence, setIncidence] = useState<Incidence | null>(null);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/incidences/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la incidencia");
      }

      const data: Incidence = await response.json();
      setIncidence(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, router]);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await addCommentToIncidence(Number(id), comment, token);

      setSuccess("Comentario agregado con éxito");
      setComment("");
      fetchData(); // Refrescar los datos para incluir el nuevo comentario
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusLabel = () => {
    if (!incidence) return null;
    if (incidence.status) {
      return (
        <span className="text-dark-warning font-semibold">En Revisión</span>
      );
    }
    if (!incidence.comment) {
      return null;
    }
    return <span className="text-dark-success font-semibold">Resuelta</span>;
  };

  const getValidityLabel = () => {
    if (!incidence) return null;
    return incidence.valid ? (
      <span className="bg-dark-error text-dark-primary px-2 py-1 rounded text-sm font-semibold">
        Esta incidencia es válida
      </span>
    ) : (
      <span className="bg-dark-success text-dark-primary px-2 py-1 rounded text-sm font-semibold">
        No cuenta
      </span>
    );
  };

  return (
    <div className="p-6 dark:bg-dark-primary dark:text-dark-text-primary min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Detalles de la Incidencia</h1>
      {loading ? (
        <div>Cargando incidencia...</div>
      ) : error ? (
        <div className="text-dark-error">Error: {error}</div>
      ) : incidence ? (
        <>
          <div className="p-6 bg-dark-secondary rounded shadow-md mb-6">
            <h2 className="text-xl font-bold mb-2">{incidence.description}</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <p>
                <strong>Severidad:</strong> {incidence.severity.name}
              </p>
              <p>
                <strong>Valor:</strong> {incidence.value}
              </p>
              <p>
                <strong>Estado:</strong> {getStatusLabel()}
              </p>
              {getValidityLabel()}
            </div>
            <p>
              <strong>Creado por:</strong> {incidence.created_by.username}
            </p>
            <p>
              <strong>Asignado a:</strong> {incidence.assigned_to.username}
            </p>
            <p>
              <strong>Fecha de creación:</strong> {new Date(incidence.created_at).toLocaleString()}
            </p>
          </div>

          {incidence.comment && (
            <div className="p-4 bg-dark-secondary rounded shadow-md mb-6">
              <h3 className="text-lg font-bold mb-2">Comentario existente</h3>
              <p className="text-dark-text-secondary">{incidence.comment}</p>
            </div>
          )}

          {incidence.status === false && incidence.comment === null && incidence.period.is_open && (
            <div className="p-6 bg-dark-secondary rounded shadow-md mb-6">
              <h3 className="text-lg font-bold mb-2">Añadir Comentario</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 mb-2 bg-dark-primary text-dark-text-primary border border-dark-secondary rounded focus:outline-none focus:ring-2 focus:ring-dark-accent"
                placeholder="Escribe tu comentario aquí..."
              />
              <button
                onClick={handleCommentSubmit}
                className="bg-dark-accent text-dark-primary py-2 px-4 rounded hover:bg-purple-700"
              >
                Enviar Comentario
              </button>
              {error && <p className="text-dark-error mt-2">{error}</p>}
              {success && <p className="text-dark-success mt-2">{success}</p>}
            </div>
          )}
          <div className="text-center">
            <button
              onClick={() => router.back()}
              className="mt-4 bg-dark-accent text-dark-primary py-2 px-6 rounded hover:bg-purple-700"
            >
              Volver
            </button>
          </div>
        </>
      ) : (
        <div>No se encontraron detalles para esta incidencia.</div>
      )}
    </div>
  );
}
