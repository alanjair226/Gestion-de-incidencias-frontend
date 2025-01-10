import { Period, UserScore } from "../types";

export async function getCurrentPeriod(token: string): Promise<Period> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
