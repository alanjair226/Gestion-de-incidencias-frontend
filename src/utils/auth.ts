export async function login(email: string, password: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Credenciales incorrectas");
        }

        const data = await response.json();
        return data; // Retorna el token y el email
    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
}
