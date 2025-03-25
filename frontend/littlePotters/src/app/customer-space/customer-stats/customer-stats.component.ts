import { Component, OnInit } from '@angular/core';
import { CustomerStats } from '../../core/models/stats/customer-stats.model';
import { CustomerStatisticsService } from '../../core/services/statistics/customer-statistics.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-stats.component.html',
  styleUrl: './customer-stats.component.scss'
})
export class CustomerStatsComponent implements OnInit {
  stats?: CustomerStats;
  loading = true;
  error?: string;
  customerId?: number;

  constructor(
    private statsService: CustomerStatisticsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.currentUserValue && this.authService.hasRole('ROLE_CUSTOMER')) {
      this.customerId = this.authService.currentUserValue.user.id;
      this.loadStats();
    } else {
      this.error = 'Access denied. Customer privileges required.';
      this.loading = false;
    }
  }

  loadStats(): void {
    this.loading = true;
    this.error = undefined;

    if (!this.customerId) {
      this.error = 'Customer ID not available';
      this.loading = false;
      return;
    }

    this.statsService.getCustomerStats(this.customerId).subscribe({
      next: (data) => {
        console.log('Received customer stats:', data);
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load customer stats:', err);
        this.error = 'Failed to load statistics. Please try again later.';
        this.loading = false;
      }
    });
  }

  getTimePreferenceEntries(): { key: string, value: number }[] {
    if (!this.stats?.timePreference) return [];
    return Object.entries(this.stats.timePreference)
      .map(([key, value]) => ({ key, value }));
  }


  formatCurrency(amount: number | null): string {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  hasMostFrequentInstructor(): boolean {
    return !!this.stats?.mostFrequentInstructor;
  }

  getTimeOfDayClass(time: string): string {
    switch (time) {
      case 'MORNING': return 'bg-yellow-100 text-yellow-800';
      case 'AFTERNOON': return 'bg-orange-100 text-orange-800';
      case 'EVENING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
