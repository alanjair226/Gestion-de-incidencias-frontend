import {User , Incidence} from "../types"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers(token: string): Promise<User[]> {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

export async function getAdminNotifications(adminId: number, token: string): Promise<Incidence[]> {
  try {
    const response = await fetch(`${apiUrl}/incidences/admin/${adminId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener las notificaciones del admin");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    throw error;
  }
}
