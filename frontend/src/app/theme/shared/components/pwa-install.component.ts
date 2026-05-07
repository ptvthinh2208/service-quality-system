import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showInstallPrompt" class="pwa-install-banner" [@fadeInOut]>
      <div class="pwa-banner-content">
        <div class="pwa-banner-header">
          <img src="icons/icon-192x192.png" alt="FGL QMS" class="pwa-app-icon"/>
          <div class="pwa-banner-title">
            <h4>Install FGL QMS</h4>
            <p>Add to home screen for quick access</p>
          </div>
          <button class="pwa-close-btn" (click)="dismiss()">&times;</button>
        </div>
        <div class="pwa-banner-actions">
          <button class="pwa-install-btn" (click)="install()">
            Install App
          </button>
          <button class="pwa-later-btn" (click)="dismiss()">
            Maybe later
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile bottom banner alternative -->
    <div *ngIf="showMobileBanner" class="pwa-mobile-banner" [@fadeInOut]>
      <div class="mobile-banner-content">
        <span class="mobile-icon">📱</span>
        <span class="mobile-text">Add FGL QMS to your home screen</span>
        <button class="mobile-close" (click)="dismissMobile()">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .pwa-install-banner {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      max-width: 500px;
      width: 90%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.3s ease-out;
    }

    .pwa-banner-content {
      padding: 16px;
    }

    .pwa-banner-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .pwa-app-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .pwa-banner-title {
      flex: 1;
    }

    .pwa-banner-title h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a73e8;
    }

    .pwa-banner-title p {
      margin: 4px 0 0;
      font-size: 12px;
      color: #666;
    }

    .pwa-close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pwa-close-btn:hover {
      color: #333;
    }

    .pwa-banner-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .pwa-install-btn {
      background: #1a73e8;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .pwa-install-btn:hover {
      background: #1557b0;
    }

    .pwa-later-btn {
      background: none;
      border: 1px solid #ddd;
      color: #666;
      padding: 10px 24px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pwa-later-btn:hover {
      background: #f5f5f5;
    }

    .pwa-mobile-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      background: #1a73e8;
      color: white;
      padding: 12px 16px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .mobile-banner-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mobile-icon {
      font-size: 20px;
    }

    .mobile-text {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }

    .mobile-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
    }

    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class PwaInstallComponent implements OnInit {
  showInstallPrompt = false;
  showMobileBanner = false;
  private deferredPrompt: any;
  private isInstalled = false;

  ngOnInit() {
    this.checkIfAlreadyInstalled();
    this.listenForInstallPrompt();
    this.checkMobileBrowser();
  }

  private checkIfAlreadyInstalled() {
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (this.isInstalled) {
      //('App is already installed as PWA');
    }
  }

  private listenForInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e;

      // Show prompt after a delay (don't interrupt user immediately)
      setTimeout(() => {
        if (!this.isInstalled) {
          this.showInstallPrompt = true;
        }
      }, 3000);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.showInstallPrompt = false;
      this.showMobileBanner = false;
      //console.log('PWA was installed');
    });
  }

  private checkMobileBrowser() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile && !isStandalone) {
      // Show mobile banner after delay
      setTimeout(() => {
        if (!this.isInstalled) {
          this.showMobileBanner = true;
        }
      }, 5000);
    }
  }

  async install() {
    if (!this.deferredPrompt) {
      //console.log('No install prompt available');
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      //console.log('User accepted the install prompt');
      this.isInstalled = true;
    } else {
      //console.log('User dismissed the install prompt');
    }

    this.deferredPrompt = null;
    this.showInstallPrompt = false;
  }

  dismiss() {
    this.showInstallPrompt = false;
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  }

  dismissMobile() {
    this.showMobileBanner = false;
    sessionStorage.setItem('pwa-mobile-banner-dismissed', 'true');
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: Event) {
    this.deferredPrompt = e;
  }
}
