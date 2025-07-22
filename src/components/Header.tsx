import React from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <header className="bg-dark-secondary py-6 shadow-md">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-bold text-dark-accent text-center md:text-left">
                    {title}
                </h1>
                <button
                    onClick={handleLogout}
                    className="mt-4 md:mt-0 bg-dark-error text-dark-primary py-2 px-6 rounded-lg shadow hover:bg-red-600 transition"
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
};

export default Header;