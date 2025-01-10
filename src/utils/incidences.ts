import { Incidence } from "../types";

export async function getUserIncidences(userId: number, periodId: number, token: string): Promise<Incidence[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/incidences/user/${userId}/${periodId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener las incidencias");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    throw error;
  }
}

export async function addCommentToIncidence(incidenceId: number, comment: string, token: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/incidences/comment/${incidenceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ comment }),
  });

  if (!response.ok) {
    throw new Error("No se pudo enviar el comentario");
  }
}

