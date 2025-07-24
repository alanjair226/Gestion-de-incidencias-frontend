import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    message = "¿Are you sure you want to proceed with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-dark-primary bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-dark-secondary p-6 rounded-lg shadow-xl max-w-sm w-full border border-dark-border">
                <h3 className="text-xl font-bold text-dark-text-primary mb-4">{title}</h3>
                <p className="text-dark-text-secondary mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-dark-border text-dark-text-primary rounded-md hover:bg-gray-600 transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-dark-error text-white rounded-md hover:bg-dark-error-hover transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;