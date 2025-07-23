import React from 'react';
import { Incidence } from '../types';
import { useRouter } from 'next/navigation';

interface IncidenceCardProps {
    incidence: Incidence;
}

const IncidenceCard: React.FC<IncidenceCardProps> = ({ incidence }) => {
    const router = useRouter();

    return (
        <li
            key={incidence.id}
            className="relative p-4 bg-dark-secondary rounded shadow-md hover:shadow-lg cursor-pointer border 
            border-dark-border transform transition-all duration-300 ease-in-out hover:scale-95"
            onClick={() => router.push(`/user/incidences/${incidence.id}`)}
        >
            {/* Indicadores */}
            {incidence.status && (
                <span
                    className="absolute top-2 right-2 w-3 h-3 bg-dark-warning rounded-full"
                    title="Incidencia Abierta/Pendiente"
                ></span>
            )}
            {/* If !incidence.valid means it's good/resolved/approved */}
            {!incidence.valid && (
                <span
                    className="absolute top-2 right-6 w-3 h-3 bg-dark-success rounded-full"
                    title="Incidencia Resuelta/Aprobada"
                ></span>
            )}

            <h3 className="font-bold text-dark-accent mb-1">
                {incidence.description}
            </h3>
            <p className="text-sm text-dark-text-secondary">
                <strong>Severidad:</strong> {incidence.severity.name}
            </p>
            <p className="text-sm text-dark-text-secondary">
                <strong>Creado:</strong>{" "}
                {new Date(incidence.created_at).toLocaleString()}
            </p>
        </li>
    );
};

export default IncidenceCard;