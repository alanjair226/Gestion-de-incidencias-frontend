import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">¡Bienvenido!</h1>
        <p className="mt-4 text-gray-700">
          Por favor, inicie sesión para continuar.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Ir a Login
        </Link>
      </div>
    </div>
  );
}
