import { ReservationStatusCounts, WorkshopLevelCounts, WorkshopScheduleCounts } from "./instructor-stats.model";

export interface AdminStats {
    totalInstructors: number;
    totalCustomers: number;
    totalWorkshops: number;
    totalReservations: number;
    reservationCancellationRate: number;
    totalRevenue: number;
    workshopsByLevel: WorkshopLevelCounts;
    workshopsBySchedule: WorkshopScheduleCounts;

}