"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-primary text-dark-text-primary">
      {/* Header */}
      <Header title="Configuración"/>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push("/admin/settings/periods")}
            className="p-6 bg-dark-accent text-dark-primary rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m0 0H3m5 0h5m3 4a3 3 0 113 3h-3V7zm-3 4a3 3 0 113 3h3v-3a3 3 0 00-3-3h-3zm-3 4a3 3 0 113 3H8v3a3 3 0 00-3-3h-3v-3h3zm0 0a3 3 0 113 3H5m0-3h3"
              />
            </svg>
            <span className="text-lg font-bold">Configurar Periodos</span>
          </button>

          <button
            onClick={() => router.push("/admin/settings/severities")}
            className="p-6 bg-dark-accent text-dark-primary rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 2m-7 0h7a4 4 0 010 8h-7a4 4 0 110-8zm0 0a4 4 0 010 8h3m-3-8H5a4 4 0 010-8h7a4 4 0 010 8h-7z"
              />
            </svg>
            <span className="text-lg font-bold">Configurar Severidades</span>
          </button>

          <button
            onClick={() => router.push("/admin/settings/common-incidences")}
            className="p-6 bg-dark-accent text-dark-primary rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 0v4m0 4h12"
              />
            </svg>
            <span className="text-lg font-bold">Configurar Incidencias Comunes</span>
          </button>
        </div>
      </main>
    </div>
  );
}
