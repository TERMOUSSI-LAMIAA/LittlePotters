export interface ReservationStatusCounts {
    PENDING: number;
    CONFIRMED: number;
    CANCELLED: number;
    COMPLETED: number;
}

export interface WorkshopLevelCounts {
    BEGINNER: number;
    INTERMEDIATE: number;
    ADVANCED: number;
}

export interface WorkshopScheduleCounts {
    MORNING: number;
    AFTERNOON: number;
    EVENING: number;
}

export interface InstructorStats {
    totalWorkshops: number;
    totalReservations: number;
    reservationsByStatus: ReservationStatusCounts;
    workshopsByLevel: WorkshopLevelCounts;
    workshopsBySchedule: WorkshopScheduleCounts;
}