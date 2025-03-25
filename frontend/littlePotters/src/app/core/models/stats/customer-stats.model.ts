export interface CustomerStats {
    totalReservations: number;
    totalSpent: number | null;  
    mostExpensiveReservation: number | null;
    timePreference: {
        MORNING: number;
        AFTERNOON: number;
        EVENING: number;
    };
    mostFrequentInstructor: {
        id: number;
        name: string;
        count: number;
    } | null;
}