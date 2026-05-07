import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { authGuard } from './theme/shared/guards/auth.guard';
import { roleGuard } from './theme/shared/guards/role.guard';

// Layouts
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

export const routes: Routes = [
  // ==================== PUBLIC ROUTES (LOGIN, REGISTER) ====================
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then(c => c.AuthSigninComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then(c => c.AuthSignupComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./demo/pages/authentication/auth-forgot-password/auth-forgot-password.component').then(c => c.AuthForgotPasswordComponent)
      }
    ]
  },

  // ==================== PROTECTED ROUTES (DASHBOARD & FEATURES) ====================
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // Route mặc định sẽ điều hướng dựa trên Role (xử lý trong DashboardComponent hoặc Guard)
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/default/default.component').then(c => c.DefaultComponent),
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Staff', 'Customer'] } // Cả 3 role đều vào được trang default, nhưng nội dung sẽ thay đổi
      },

      // --- ADMIN MODULES ---
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: ['Admin'] },
        children: [
          {
            path: 'categories',
            loadComponent: () => import('./demo/admin-panel/categories/categories.component').then(c => c.CategoriesComponent)
          },
          {
            path: 'sessions',
            loadComponent: () => import('./demo/admin-panel/sessions/sessions.component').then(c => c.SessionsComponent)
          }
        ]
      },

      // --- COMMON PAGES (OPTIONAL) ---
      {
        path: 'profile',
        loadComponent: () => import('./demo/pages/profile/profile.component').then(c => c.ProfileComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./demo/pages/authentication/change-password/change-password.component').then(c => c.ChangePasswordComponent)
      }
    ]
  },

  // ==================== WILDCARD ROUTE ====================
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({

  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
