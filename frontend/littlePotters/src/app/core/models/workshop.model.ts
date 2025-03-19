
export enum WorkshopLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}

export enum WorkshopSchedule {
    MORNING = 'MORNING',
    AFTERNOON = 'AFTERNOON',
    EVENING = 'EVENING'
}

export interface Workshop {
    id: number;
    title: string;
    description: string;
    date: string;  
    level: WorkshopLevel;
    schedule: WorkshopSchedule;
    maxParticipants: number;
    availablePlaces: number;
    price: number;
    imageUrl: string;
    instructorId: number; 
}

export interface WorkshopRequest {
    title: string;
    description: string;
    date: string;
    level: WorkshopLevel;
    schedule: WorkshopSchedule;
    maxParticipants: number;
    price: number;
    image: File | null;
}
