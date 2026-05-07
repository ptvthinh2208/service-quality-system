import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export type DisplayTheme = 'ocean' | 'emerald' | 'royal';

export interface DisplayConfig {
  theme: DisplayTheme;
  adUrl: string;
}

export const DISPLAY_THEMES: Record<DisplayTheme, {
  label: string;
  description: string;
  accent: string;
  bg: string;
  cardBg: string;
  borderColor: string;
  preview: string;
  textPrimary: string;
  textMuted: string;
  panelHeaderBg: string;
  topBarBg: string;
  topBarText: string;
  accentSuccess: string;
  accentWarning: string;
  accentDanger: string;
}> = {
  ocean: {
    label: 'Deep Ocean',
    description: 'Xanh đại dương — Chuyên nghiệp, công nghệ cao',
    accent: '#00b4ff',
    bg: '#060d1a',
    cardBg: '#0d1829',
    borderColor: 'rgba(0,180,255,0.3)',
    preview: 'linear-gradient(135deg, #060d1a 0%, #0d1829 50%, #081525 100%)',
    textPrimary: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    panelHeaderBg: 'rgba(255, 255, 255, 0.05)',
    topBarBg: 'linear-gradient(90deg, #0a1628 0%, #0d1f3c 60%, #091523 100%)',
    topBarText: '#ffffff',
    accentSuccess: '#00e676',
    accentWarning: '#ffc107',
    accentDanger: '#ff5252'
  },
  emerald: {
    label: 'Emerald Night',
    description: 'Xanh ngọc lục bảo — Năng lượng, tươi mới',
    accent: '#00e676',
    bg: '#050f0a',
    cardBg: '#0a1f12',
    borderColor: 'rgba(0,230,118,0.3)',
    preview: 'linear-gradient(135deg, #050f0a 0%, #0a1f12 50%, #061509 100%)',
    textPrimary: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    panelHeaderBg: 'rgba(255, 255, 255, 0.05)',
    topBarBg: 'linear-gradient(90deg, #050f0a 0%, #0a1f12 60%, #061509 100%)',
    topBarText: '#ffffff',
    accentSuccess: '#00e676',
    accentWarning: '#ffc107',
    accentDanger: '#ff5252'
  },
  royal: {
    label: 'Soft Sky',
    description: 'Sáng xanh dịu — Hiện đại, dễ nhìn, thân thiện',
    accent: '#007bff',
    bg: '#f8fafc',
    cardBg: '#ffffff',
    borderColor: 'rgba(0,123,255,0.15)',
    preview: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
    textPrimary: '#1e293b',
    textMuted: '#64748b',
    panelHeaderBg: '#f1f5f9',
    topBarBg: '#ffffff',
    topBarText: '#1e293b',
    accentSuccess: '#10b981',
    accentWarning: '#f59e0b',
    accentDanger: '#ef4444'
  }
};

const DEFAULT_CONFIG: DisplayConfig = { theme: 'ocean', adUrl: '' };
const STORAGE_KEY = 'qms_display_config';

@Injectable({ providedIn: 'root' })
export class DisplaySettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/DisplaySettings`;

  private currentConfig: DisplayConfig = { ...DEFAULT_CONFIG };

  constructor() {
    this.loadFromCache();
  }

  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        this.currentConfig = JSON.parse(cached);
        // Áp dụng theme ngay lập tức từ cache
        this.applyThemeToDocument(this.currentConfig.theme);
      }
    } catch (e) {}
  }

  getConfig(): DisplayConfig {
    return this.currentConfig;
  }

  fetchConfig(): Observable<DisplayConfig> {
    return this.http.get<DisplayConfig>(this.apiUrl).pipe(
      tap(config => {
        this.currentConfig = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        this.applyThemeToDocument(config.theme);
      })
    );
  }

  saveConfig(config: DisplayConfig): Observable<any> {
    return this.http.post(this.apiUrl, config).pipe(
      tap(() => {
        this.currentConfig = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        this.applyThemeToDocument(config.theme);
      })
    );
  }

  getThemeInfo(theme: DisplayTheme) {
    return DISPLAY_THEMES[theme];
  }

  applyThemeToDocument(theme: DisplayTheme): void {
    const info = DISPLAY_THEMES[theme];
    const root = document.documentElement;
    root.style.setProperty('--tv-accent', info.accent);
    root.style.setProperty('--tv-bg', info.bg);
    root.style.setProperty('--tv-card-bg', info.cardBg);
    root.style.setProperty('--tv-border', info.borderColor);
    root.style.setProperty('--tv-accent-rgb', this.hexToRgb(info.accent));
    root.style.setProperty('--tv-text-main', info.textPrimary);
    root.style.setProperty('--tv-text-muted', info.textMuted);
    root.style.setProperty('--tv-panel-header-bg', info.panelHeaderBg);
    root.style.setProperty('--tv-topbar-bg', info.topBarBg);
    root.style.setProperty('--tv-topbar-text', info.topBarText);
    root.style.setProperty('--tv-accent-success', info.accentSuccess);
    root.style.setProperty('--tv-accent-warning', info.accentWarning);
    root.style.setProperty('--tv-accent-danger', info.accentDanger);
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 180, 255';
  }
}
