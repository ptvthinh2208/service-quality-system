import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app-routing.module';
import { authInterceptor } from './theme/shared/interceptors/auth.interceptor'; // Đường dẫn đúng tới file interceptor của bạn

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor]))
    ]
};