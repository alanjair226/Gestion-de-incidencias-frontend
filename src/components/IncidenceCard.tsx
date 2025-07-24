// components/IncidenceCard.tsx
import React, { useState } from 'react';
import { Incidence } from '../types';
import { useRouter } from 'next/navigation';
import { deleteIncidence } from '@/utils/incidences';
import ConfirmationModal from './ConfirmationModal';

interface IncidenceCardProps {
    incidence: Incidence;
    onDeleteSuccess?: (id: number) => void; 
}

const IncidenceCard: React.FC<IncidenceCardProps> = ({ incidence, onDeleteSuccess }) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const role: string = payload.role;

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        // Open confirmation modal first
        setShowConfirmModal(true); 
    };

    const confirmDeleteAction = async () => {
        setShowConfirmModal(false); // Close modal after user confirms

        const token = localStorage.getItem("token"); // Re-get token as it might be async
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setIsDeleting(true); // Start animation
            await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for animation

            await deleteIncidence(incidence.id, token);
            
            if (onDeleteSuccess) {
                onDeleteSuccess(incidence.id); 
            }

        } catch (error) {
            console.error("Error deleting incidence:", error);
            setIsDeleting(false); // Revert animation on error
            alert("No se pudo eliminar la incidencia. Por favor, inténtalo de nuevo.");
        }
    };

    const cardClasses = `
        relative p-4 bg-dark-secondary rounded shadow-md cursor-pointer border 
        border-dark-border transform transition-all duration-300 ease-in-out hover:scale-95
        ${isDeleting 
            ? 'opacity-0 scale-y-0 translate-y-full h-0 p-0 m-0 overflow-hidden' 
            : 'opacity-100'
        }
    `;

    return (
        <> {/* Use a React Fragment to wrap the li and the modal */}
            <li
                key={incidence.id}
                className={cardClasses}
                onClick={() => router.push(`/user/incidences/${incidence.id}`)}
            >
                {incidence.status && (
                    <span
                        className="absolute top-2 right-2 w-3 h-3 bg-dark-warning rounded-full"
                        title="Incidencia Abierta/Pendiente"
                    ></span>
                )}
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
                {(incidence.valid && (role === "superadmin" || role === "admin")) && (
                    <button
                        className="mt-2 px-3 py-1 bg-dark-error text-white rounded hover:bg-dark-error-hover"
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleDelete();
                        }}
                    >
                        Eliminar
                    </button>
                )}
            </li>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmDeleteAction}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la incidencia "${incidence.description}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
            />
        </>
    );
};

export default IncidenceCard;