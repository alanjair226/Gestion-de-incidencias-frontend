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

export async function deleteIncidence(incidenceId: number, token: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/incidences/${incidenceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la incidencia");
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
): Promise<{ id: number } | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
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
      throw new Error(
        `No se pudo crear la incidencia. Código: ${response.status}, Mensaje: ${errorDetails.message || "Error desconocido"}`
      );
    }

    const data = await response.json();
    return data; // Retorna la incidencia creada con su ID
  } catch (error) {
    console.error("Error al crear la incidencia:", error);
    return null;
  }
}

export async function uploadIncidenceImage(
  incidenceId: number,
  file: File,
  token: string
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  try {
    const formData = new FormData();
    formData.append("incidenceId", incidenceId.toString());
    formData.append("file", file);

    const response = await fetch(`${apiUrl}/image-incidence`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      throw new Error(`No se pudo subir la imagen. Código: ${response.status}`);
    }

    console.log("Imagen subida con éxito a la incidencia:", incidenceId);
  } catch (error) {
    console.error("Error al subir la imagen de la incidencia:", error);
    throw error;
  }
}
