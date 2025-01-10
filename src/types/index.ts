// Tipo para un periodo
export interface Period {
    id: number;
    start_date: string;
    end_date: string | null;
    is_open: boolean;
}

// Tipo para una incidencia
export interface Incidence {
    id: number;
    description: string;
    value: number;
    status: boolean;
    valid: boolean;
    created_at: string;
    comment: string | null;
    assigned_to: {
        id: number;
        username: string;
        image: string;
    };
    created_by: {
        id: number;
        username: string;
        image: string;
    };
    severity: {
        id: number;
        name: string;
        value: number;
    };
    period: Period;
}

// Tipo para el score del usuario
export interface UserScore {
    id: number;
    score: number;
    user: {
        id: number;
        username: string;
        image: string;
    };
    period: Period;
}

export interface UserScore {
    id: number;
    score: number;
    period: Period;
}

export interface User {
    id: number;
    username: string;
    image: string;
  }