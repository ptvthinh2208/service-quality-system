import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface VoucherHubEvent {
  type: 'voucherAcquired' | 'statusUpdated';
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class VoucherHubService implements OnDestroy {
  private hubConnection: signalR.HubConnection | null = null;
  private readonly hubUrl = `${environment.apiUrl.replace('/api', '')}/hubs/voucher`;

  /** Emits whenever a voucher event arrives from the server */
  readonly events$ = new Subject<VoucherHubEvent>();

  /** Current connection state */
  readonly connectionState$ = new BehaviorSubject<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );

  /**
   * Connect to the SignalR voucher hub.
   * Admins and Customers use different join methods after connecting.
   */
  async connect(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    const token = localStorage.getItem('qms_token') ?? '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.registerHandlers();

    this.hubConnection.onreconnecting(() => {
      this.connectionState$.next(signalR.HubConnectionState.Reconnecting);
    });

    this.hubConnection.onreconnected(() => {
      this.connectionState$.next(signalR.HubConnectionState.Connected);
    });

    this.hubConnection.onclose(() => {
      this.connectionState$.next(signalR.HubConnectionState.Disconnected);
    });

    try {
      await this.hubConnection.start();
      this.connectionState$.next(signalR.HubConnectionState.Connected);
      //console.log('[VoucherHub] Connected');
    } catch (err) {
      this.connectionState$.next(signalR.HubConnectionState.Disconnected);
    }
  }

  private registerHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('OnVoucherAcquired', (voucher: any) => {
      this.events$.next({ type: 'voucherAcquired', payload: voucher });
    });

    this.hubConnection.on('OnVoucherStatusUpdated', (voucherCode: string, status: string) => {
      this.events$.next({ type: 'statusUpdated', payload: { voucherCode, status } });
    });
  }

  async joinAdminGroup(): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) return;
    try {
      await this.hubConnection.invoke('JoinAdminGroup');
    } catch (err) {
      console.error('[VoucherHub] Failed to join admin group:', err);
    }
  }

  async joinUserGroup(userId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) return;
    try {
      await this.hubConnection.invoke('JoinUserGroup', userId);
    } catch (err) {
      console.error('[VoucherHub] Failed to join user group:', err);
    }
  }

  async disconnect(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
