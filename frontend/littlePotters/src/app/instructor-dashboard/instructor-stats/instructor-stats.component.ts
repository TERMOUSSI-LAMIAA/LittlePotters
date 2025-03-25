import { Component, OnInit } from '@angular/core';
import { InstructorStatisticsService } from '../../core/services/statistics/instructor-statistics.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { InstructorStats } from '../../core/models/stats/instructor-stats.model';

@Component({
  selector: 'app-instructor-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-stats.component.html',
  styleUrl: './instructor-stats.component.scss'
})
export class InstructorStatsComponent implements OnInit {
  stats?: InstructorStats;
  loading = true;
  error?: string;

  constructor(
    private statsService: InstructorStatisticsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const instructorId = this.authService.currentUserValue?.user.id;
    if (instructorId) {
      this.loadStats(instructorId);
    } else {
      this.error = 'No instructor ID available';
      this.loading = false;
    }
  }

  loadStats(instructorId: number): void {
    this.loading = true;
    this.error = undefined;

    this.statsService.getStats(instructorId).subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
        this.error = 'Failed to load statistics. Please try again later.';
        this.loading = false;
      }
    });
  }

  getStatusEntries(): { key: string, value: number }[] {
    if (!this.stats?.reservationsByStatus) return [];
    return Object.entries(this.stats.reservationsByStatus)
      .map(([key, value]) => ({ key, value }));
  }

  getLevelEntries(): { key: string, value: number }[] {
    if (!this.stats?.workshopsByLevel) return [];
    return Object.entries(this.stats.workshopsByLevel)
      .map(([key, value]) => ({ key, value }));
  }

  getScheduleEntries(): { key: string, value: number }[] {
    if (!this.stats?.workshopsBySchedule) return [];
    return Object.entries(this.stats.workshopsBySchedule)
      .map(([key, value]) => ({ key, value }));
  }

  

  getStatusBgClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
