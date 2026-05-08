import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AppConfig {
  welcomeTitle: string;
  welcomeSubtitle: string;
  thankYouMessage: string;
  resetTimeoutSeconds: number;
  logoUrl?: string;
  primaryColor: string;
  hotline: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/app-config`;

  getConfig(): Observable<{ success: boolean; data: AppConfig }> {
    return this.http.get<{ success: boolean; data: AppConfig }>(this.apiUrl);
  }

  updateConfig(config: Partial<AppConfig>): Observable<{ success: boolean; message: string }> {
    // Chuyển đổi thành Dictionary<string, string> cho backend
    const dict: Record<string, string> = {};
    if (config.welcomeTitle !== undefined) dict['welcome_title'] = config.welcomeTitle;
    if (config.welcomeSubtitle !== undefined) dict['welcome_subtitle'] = config.welcomeSubtitle;
    if (config.thankYouMessage !== undefined) dict['thankyou_message'] = config.thankYouMessage;
    if (config.resetTimeoutSeconds !== undefined) dict['reset_timeout_seconds'] = config.resetTimeoutSeconds.toString();
    if (config.logoUrl !== undefined) dict['logo_url'] = config.logoUrl;
    if (config.primaryColor !== undefined) dict['primary_color'] = config.primaryColor;
    if (config.hotline !== undefined) dict['hotline'] = config.hotline;

    return this.http.put<{ success: boolean; message: string }>(this.apiUrl, dict);
  }
}
