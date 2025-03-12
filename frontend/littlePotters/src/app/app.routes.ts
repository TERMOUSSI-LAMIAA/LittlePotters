import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { CustomerSpaceComponent } from './customer-space/customer-space.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'admin-dashboard', component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        data: { role: 'ROLE_ADMIN' }
    },
    {
        path: 'instructor-dashboard', component: InstructorDashboardComponent,
        canActivate: [AuthGuard],
        data: { role: 'ROLE_INSTRUCTOR' }
    },
    {
        path: 'customer-space', component: CustomerSpaceComponent,
        canActivate: [AuthGuard],
        data: { role: 'ROLE_CUSTOMER' }
    },
];
