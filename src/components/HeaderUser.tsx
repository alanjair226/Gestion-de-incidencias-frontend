import React from "react";
import { useRouter } from "next/navigation";

interface HeaderUserProps {
  title: string;
  ButtonText?: string;
  ButtonRoute?: string;
}

const HeaderUser: React.FC<HeaderUserProps> = ({
  title,
  ButtonText = "Ver periodos anteriores",
  ButtonRoute = "/user/periods",
}) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleViewPeriods = () => {
    router.push(ButtonRoute);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-dark-primary py-3 shadow-md border-b-2 border-white/10 md:py-2">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
        {/* Título */}
        <h1 className="text-xl font-bold text-dark-text-primary text-center md:text-2xl md:text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {title}
        </h1>

        {/* Contenedor de botones */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-2 md:mt-0">
          {/* Botón de acción */}
          <button
            onClick={handleViewPeriods}
            className="py-1.5 px-3 bg-dark-accent text-dark-primary rounded-lg shadow-md hover:shadow-lg transition text-center font-semibold text-sm md:text-base whitespace-nowrap"
          >
            {ButtonText}
          </button>
          {/* Botón de cerrar sesión */}
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

export default HeaderUser;