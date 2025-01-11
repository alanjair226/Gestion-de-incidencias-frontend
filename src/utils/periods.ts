import { Period, UserScore } from "../types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentPeriod(token: string): Promise<Period> {

  try {
    const response = await fetch(`${apiUrl}/periods`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los periodos");
    }

    const periods: Period[] = await response.json();
    const currentPeriod = periods.find((p) => p.is_open);

    if (!currentPeriod) {
      throw new Error("No hay un periodo abierto");
    }

    return currentPeriod;
  } catch (error) {
    console.error("Error al obtener el periodo actual:", error);
    throw error;
  }
}

export async function getUserPeriods(userId: number, token: string): Promise<UserScore[]> {

  try {
    const response = await fetch(`${apiUrl}/scores/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los periodos del usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener los periodos:", error);
    throw error;
  }
}

export async function getPeriods(token: string) {
  try {
    const response = await fetch(`${apiUrl}/periods`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("No se pudieron obtener los periodos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener periodos:", error);
    throw error;
  }
}

export async function createPeriod(token: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/periods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        start_date: new Date().toISOString(), // Fecha actual en formato ISO
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo crear el periodo");
    }
  } catch (error) {
    console.error("Error al crear el periodo:", error);
    throw error;
  }
}

export async function closePeriod(periodId: number, token: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/periods/${periodId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_open: false,
        end_date: new Date().toISOString(), // Fecha actual en formato ISO
      }),
    });

    if (!response.ok) {
      throw new Error("No se pudo cerrar el periodo");
    }
  } catch (error) {
    console.error("Error al cerrar el periodo:", error);
    throw error;
  }
}

