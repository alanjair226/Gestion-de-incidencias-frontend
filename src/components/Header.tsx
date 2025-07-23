'use client'
import SettingsIcon from "@/icons/settings.svg";
import NotificationIcon from "@/icons/notification.svg";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { getAdminNotifications } from "@/utils/admin"; // Ajusta la ruta si es necesario

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const router = useRouter();
    const [notifications, setNotifications] = useState<number>(0);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Consultar notificaciones usando getAdminNotifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                // Obtener adminId del token
                const payload = JSON.parse(atob(token.split(".")[1]));
                const adminId: number = payload.id;
                const notificationsData = await getAdminNotifications(adminId, token);
                setNotifications(Array.isArray(notificationsData) ? notificationsData.length : 0);
            } catch {
                setNotifications(0);
            }
        };
        fetchNotifications();
    }, []);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-dark-primary py-3 shadow-md border-b-2 border-white/10 md:py-2">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
                {/* Título */}
                <h1 className="text-lg font-bold text-dark-text-primary text-center md:text-xl md:text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {title}
                </h1>

                {/* Contenedor de botones */}
                <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 mt-2 md:mt-0">

                    {/* Botón de Notificaciones */}
                    <button
                        onClick={() => router.push("/admin/notifications")}
                        className="relative p-1.5 rounded-lg w-auto shadow-md hover:bg-dark-secondary transition flex items-center justify-center"
                        aria-label="Notificaciones"
                    >
                        <NotificationIcon className="w-6 h-6 text-dark-accent md:w-8 md:h-8" />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 flex items-center justify-center min-w-[1.25rem] h-5">
                                {notifications}
                            </span>
                        )}
                    </button>

                    {/* Botón y Dropdown de Configuración */}
                    <div className="relative flex justify-center w-auto" ref={settingsRef}>
                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className="p-1.5 rounded-lg w-auto shadow-md hover:bg-dark-secondary transition flex items-center justify-center"
                            aria-label="Configuración"
                        >
                            <SettingsIcon className="w-6 h-6 text-dark-accent md:w-8 md:h-8" />
                        </button>
                        {settingsOpen && (
                            <div className="absolute rounded-lg right-0 mt-10 md:mt-12 bg-dark-secondary border border-dark-accent bg-opacity-90 shadow-lg z-50 min-w-[200px]">
                                <ul>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm md:text-base hover:bg-dark-accent hover:text-dark-primary transition rounded-t-lg"
                                            onClick={() => {
                                                setSettingsOpen(false);
                                                router.push("/admin/settings/severities");
                                            }}
                                        >
                                            Configurar Severidades
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm md:text-base hover:bg-dark-accent hover:text-dark-primary transition"
                                            onClick={() => {
                                                setSettingsOpen(false);
                                                router.push("/admin/settings/common-incidences");
                                            }}
                                        >
                                            Configurar Incidencias Comunes
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm md:text-base hover:bg-dark-accent hover:text-dark-primary transition rounded-b-lg"
                                            onClick={() => {
                                                setSettingsOpen(false);
                                                router.push("/admin/settings/periods");
                                            }}
                                        >
                                            Configurar Periodos
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Botón "Ver Incidencias Asignadas" */}
                    <button
                        onClick={() => router.push("/user/incidences")}
                        className="py-1.5 px-3 bg-dark-accent text-dark-primary rounded-lg shadow-md hover:shadow-lg transition text-center font-semibold text-sm md:text-base whitespace-nowrap"
                    >
                        Ver Incidencias
                    </button>
                    {/* Botón "Cerrar sesión" */}
                    <button
                        onClick={handleLogout}
                        className="py-1.5 px-3 bg-dark-error text-dark-primary rounded-lg shadow hover:bg-red-600 transition text-sm md:text-base whitespace-nowrap"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;