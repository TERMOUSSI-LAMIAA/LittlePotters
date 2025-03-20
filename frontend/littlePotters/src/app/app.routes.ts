import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { CustomerSpaceComponent } from './customer-space/customer-space.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { CustomerManagementComponentComponent } from './admin-dashboard/customer-management-component/customer-management-component.component';
import { InstructorManagementComponentComponent } from './admin-dashboard/instructor-management-component/instructor-management-component.component';
import { UserprofileComponent } from './shared/components/userprofile/userprofile.component';
import { InstructorFormComponentComponent } from './admin-dashboard/instructor-form-component/instructor-form-component.component';
import { InstructorsResolver } from './core/resolvers/instructors.resolver';
import { CustomersResolver } from './core/resolvers/customers.resolver';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { WorkshopManagementComponent } from './instructor-dashboard/workshop-management/workshop-management.component';
import { ReservationManagementComponent } from './instructor-dashboard/reservation-management/reservation-management.component';
import { WorkshopFormComponent } from './instructor-dashboard/workshop-form/workshop-form.component';
import { WorkshopResolver } from './core/resolvers/workshops.resolver';

export const routes: Routes = [
    // { path: '', component: HomeComponent },
    // { path: 'home', component: HomeComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegisterComponent },
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            { path: "", component: HomeComponent },
            { path: "home", component: HomeComponent },
            { path: "login", component: LoginComponent },
            { path: "register", component: RegisterComponent },
        ],
    },
    {
        path: 'admin-dashboard', component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        data: { role: 'ROLE_ADMIN' },
        children: [
            {
                path: 'instructors',
                component: InstructorManagementComponentComponent,
                resolve: {
                    instructors: InstructorsResolver
                },
                children: [
                    {
                        path: 'new',
                        component: InstructorFormComponentComponent
                    },
                    {
                        path: ':id',
                        component: InstructorFormComponentComponent
                    }
                ]
            },
            {
                path: 'customers',
                component: CustomerManagementComponentComponent,
                resolve: {
                    customers: CustomersResolver
                }
            },
            {
                path: 'profile',
                component: UserprofileComponent
            }
        ]
    },
    {
        path: 'instructor-dashboard', component: InstructorDashboardComponent,
        canActivate: [AuthGuard],
        data: { role: 'ROLE_INSTRUCTOR' },
        children: [
            {
                path: 'workshops',
                component: WorkshopManagementComponent,
                resolve: {
                    workshops: WorkshopResolver
                },
                children: [
                    {
                        path: 'new',
                        component: WorkshopFormComponent
                    },
                    {
                        path: ':id',
                        component: WorkshopFormComponent
                    }
                ]
               
            },
            {
                path: 'reservations',
                component: ReservationManagementComponent,
                resolve: {
                    // my-reservations: ReservationsResolver
                }

            },
            {
                path: 'profile',
                component: UserprofileComponent
            }
            
           ]
        
    },
    {
        path: 'customer-space', component: CustomerSpaceComponent,
        canActivate: [AuthGuard],
        data: { role: 'ROLE_CUSTOMER' }
    },
];
