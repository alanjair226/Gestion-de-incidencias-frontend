import { Score } from "../types";

export async function getUserScore(userId: number, periodId: number, token: string): Promise<number> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${apiUrl}/scores/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener el score del usuario");
        }

        const scores = await response.json();

        // Buscar el score del periodo actual
        const currentScore = scores.find((score: Score) => score.period.id === periodId);

        if (!currentScore) {
            return 0; // Si no hay score, se asume 0
        }

        return currentScore.score;
    } catch (error) {
        console.error("Error al obtener el score:", error);
        throw error;
    }
}
