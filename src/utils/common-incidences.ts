const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getCommonIncidences(token: string) {
    try {
      const response = await fetch(`${apiUrl}/common-incidences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("No se pudieron obtener las incidencias comunes");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error al obtener incidencias comunes:", error);
      throw error;
    }
  }
  
  export async function createCommonIncidence(
    incidence: string,
    severity: string,
    token: string
  ) {
    try {
      const response = await fetch(`${apiUrl}/common-incidences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ incidence, severity }),
      });
  
      if (!response.ok) {
        throw new Error("No se pudo crear la incidencia común");
      }
    } catch (error) {
      console.error("Error al crear la incidencia común:", error);
      throw error;
    }
  }
  
  export async function updateCommonIncidence(
    id: number,
    incidence: string,
    severity: string,
    token: string
  ) {
    try {
      const response = await fetch(`${apiUrl}/common-incidences/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ incidence, severity }),
      });
  
      if (!response.ok) {
        throw new Error("No se pudo actualizar la incidencia común");
      }
    } catch (error) {
      console.error("Error al actualizar la incidencia común:", error);
      throw error;
    }
  }
  