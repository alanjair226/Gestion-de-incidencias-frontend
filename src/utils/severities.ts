const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getSeverities(token: string) {
    try {
      const response = await fetch(`${apiUrl}/severities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("No se pudieron obtener las severidades");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error al obtener severidades:", error);
      throw error;
    }
  }
  
  export async function createSeverity(name: string, value: number, token: string) {
    try {
      const response = await fetch(`${apiUrl}/severities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, value }),
      });
  
      if (!response.ok) {
        throw new Error("No se pudo crear la severidad");
      }
    } catch (error) {
      console.error("Error al crear la severidad:", error);
      throw error;
    }
  }
  