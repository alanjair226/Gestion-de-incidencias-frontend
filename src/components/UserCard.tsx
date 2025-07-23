import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentPeriod } from "@/utils/periods";
import { getUserScore } from "@/utils/scores";
import { FaStar } from "react-icons/fa";

interface UserCardProps {
    user: {
        id: number;
        username: string;
        image: string;
    };
    onClick: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
    const [userScore, setUserScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ********* FUNCIÓN DE EMOJIS CON MÁS THRESHOLDS "MAMONES" *********
    const getScoreEmoji = (score: number | null) => {
        if (score === null) {
            return "👻";
        } else if (score >= 95) {
            return "🏆👑";
        } else if (score >= 90) {
            return "🚀✨";
        } else if (score >= 85) {
            return "😎👌";
        } else if (score >= 80) {
            return "📈🤨";
        } else if (score >= 75) {
            return "🤷‍♀️";
        } else if (score >= 70) {
            return "🤔🙄";
        } else if (score >= 60) {
            return "📉🤦‍♂️";
        } else if (score >= 50) {
            return "🚩🚨";
        } else if (score >= 30) {
            return "😵‍💫🗑️";
        } else {
            return "💀⚰️";
        }
    };

    useEffect(() => {
        const fetchUserScore = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("Token not found");
                    setError("Authentication token not found.");
                    setIsLoading(false);
                    return;
                }

                const currentPeriod = await getCurrentPeriod(token);
                const score = await getUserScore(user.id, currentPeriod.id, token);
                setUserScore(score);
            } catch (err) {
                console.error("Failed to fetch user score:", err);
                setError("Failed to load user score.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserScore();
    }, [user.id]);

    // Función para determinar el color del score y emoji
    const getScoreTextColorClass = (score: number | null) => {
        if (score === null) return "text-dark-text-secondary";
        if (score >= 90) return "text-dark-success"; // Verde para excelentes
        if (score >= 70) return "text-dark-warning"; // Amarillo para bien/regular
        return "text-dark-error"; // Rojo para bajo
    };

    const scoreTextColorClass = getScoreTextColorClass(userScore);

    if (isLoading) {
        return (
            <div className={`p-6 bg-dark-secondary rounded-lg shadow-xl border-2 border-dark-accent animate-pulse`}>
                <p className="text-dark-text-secondary text-center">Cargando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 bg-dark-secondary rounded-lg shadow-xl border-2 border-dark-error text-center`}>
                <p className="text-dark-error">Error: {error}</p>
            </div>
        );
    }

    return (
        <div
            className={`
                relative p-6 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out
                hover:scale-95 hover:shadow-2xl cursor-pointer text-center
                bg-dark-secondary border-2 border-dark-border
            `}
            onClick={() => onClick(user.id)}
        >
            <Image
                src={user.image}
                alt={user.username}
                width={120}
                height={120}
                className="aspect-square rounded-full mx-auto mb-4 shadow-lg object-cover border-4 border-dark-primary"
            />
            <h3 className="text-2xl font-extrabold text-dark-text-primary mb-2">
                {user.username}
            </h3>

            {/* Contenedor para la calificación numérica, estrella y el emoji */}
            <div className="flex items-center justify-center gap-2 mt-4">
                {/* Score Numérico sin círculo, con color dinámico */}
                <p className={`text-xl font-extrabold ${scoreTextColorClass}`}>
                    {userScore !== null ? userScore : "N/A"}
                </p>

                {/* Estrella y Emoji */}
                <span className="text-2xl"> {/* Tamaño reducido para el emoji */}
                    <FaStar className={`inline-block text-yellow-400 mr-1`} /> {/* Tamaño normal para la estrella */}
                    {getScoreEmoji(userScore)}
                </span>
            </div>

            {/* Sutil gradiente decorativo en la parte inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dark-accent to-transparent opacity-20 rounded-b-lg"></div>
        </div>
    );
};

export default UserCard;