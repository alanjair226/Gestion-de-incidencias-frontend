import { Incidence, UpdateIncidenceBody } from "../types";

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

export async function updateIncidenceStatus(
  incidenceId: number,
  body: UpdateIncidenceBody,
  token: string
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/incidences/${incidenceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("No se pudo actualizar el estado de la incidencia");
    }
  } catch (error) {
    console.error("Error al actualizar la incidencia:", error);
    throw error;
  }
}

export async function createIncidence(
  incidenceData: { description: string; assigned_to: number; severity: string; period: number },
  token: string
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    console.log("Datos enviados a la API:", incidenceData); // Verificar los datos enviados
    const response = await fetch(`${apiUrl}/incidences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(incidenceData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error en la respuesta del servidor:", errorDetails);
      throw new Error(
        `No se pudo crear la incidencia. Código: ${response.status}, Mensaje: ${errorDetails.message || "Error desconocido"}`
      );
    }

    console.log("Incidencia creada exitosamente");
  } catch (error) {
    console.error("Error al crear la incidencia:", error);
    throw error;
  }
}
