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


export async function getUserDetails(userId: number, token: string): Promise<User> {
  console.log({userId, token})

  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error ${response.status}: ${errorMessage}`);
      throw new Error(
        `No se pudieron obtener los detalles del usuario. Código: ${response.status}, Mensaje: ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener los detalles del usuario:", error);
    throw error;
  }
}

