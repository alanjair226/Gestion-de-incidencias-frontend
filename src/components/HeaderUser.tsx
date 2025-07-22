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
    <header className="bg-dark-secondary py-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
        <h1 className="text-3xl font-bold text-dark-accent text-center md:text-left">
          {title}
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={handleViewPeriods}
            className="bg-dark-accent text-dark-primary py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            {ButtonText}
          </button>
          <button
            onClick={handleLogout}
            className="bg-dark-error text-dark-primary py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;