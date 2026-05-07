import { Injectable, inject, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { QueueTicket, QueueSummary } from '../models/queue.model';

export interface QueueHubEvent {
  type: 'ticketAdded' | 'queueUpdated' | 'priorityChanged' | 'announcement' | 'summaryRefreshed' | 'ticketUpdated' | 'rewardAwarded';
  payload: any;
  /** True if this event was sent directly to this user's personal group (user-{userId}), not a branch broadcast */
  isPersonal?: boolean;
}

@Injectable({ providedIn: 'root' })
export class QueueHubService implements OnDestroy {
  private hubConnection: signalR.HubConnection | null = null;
  private readonly hubUrl = `${environment.apiUrl.replace('/api', '')}/hubs/queue`;

  /** Emits whenever a queue event arrives from the server */
  readonly events$ = new Subject<QueueHubEvent>();

  /** Current connection state */
  readonly connectionState$ = new BehaviorSubject<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );

  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private personalHandlersRegistered = false;
  /** Emits ONLY events targeting this specific user — safe to trigger alerts on */
  readonly personalEvents$ = new Subject<QueueHubEvent>();

  /**
   * Connect to the SignalR hub and join the appropriate group.
   * Call this once from the dashboard component on init.
   */
  async connect(counterId: number, branchId: number): Promise<void> {
    if (this.hubConnection) {
      // Already connected – just ensure we're in the right groups
      await this.joinGroups(counterId, branchId);
      return;
    }

    const token = localStorage.getItem('auth_token') ?? '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Exponential-ish back-off
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.registerHandlers();

    this.hubConnection.onreconnecting(() => {
      this.connectionState$.next(signalR.HubConnectionState.Reconnecting);
    });

    this.hubConnection.onreconnected(async () => {
      this.connectionState$.next(signalR.HubConnectionState.Connected);
      await this.joinGroups(counterId, branchId);
    });

    this.hubConnection.onclose(() => {
      this.connectionState$.next(signalR.HubConnectionState.Disconnected);
    });

    try {
      await this.hubConnection.start();
      this.connectionState$.next(signalR.HubConnectionState.Connected);
      await this.joinGroups(counterId, branchId);
      //console.log('[QueueHub] Connected to', this.hubUrl);
    } catch (err) {
      //console.error('[QueueHub] Connection failed:', err);
      this.connectionState$.next(signalR.HubConnectionState.Disconnected);
    }
  }

  private registerHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('OnTicketAdded', (ticket: QueueTicket) => {
      this.events$.next({ type: 'ticketAdded', payload: ticket });
    });

    this.hubConnection.on('OnQueueUpdated', (ticket: QueueTicket) => {
      this.events$.next({ type: 'queueUpdated', payload: ticket });
    });

    this.hubConnection.on('OnPriorityChanged', (ticketId: number, isPriority: boolean) => {
      this.events$.next({ type: 'priorityChanged', payload: { ticketId, isPriority } });
    });

    this.hubConnection.on('OnAnnouncement', (ticketNumber: string, counterName: string, message: string) => {
      this.events$.next({ type: 'announcement', payload: { ticketNumber, counterName, message } });
    });

    this.hubConnection.on('OnSummaryRefreshed', (summary: QueueSummary) => {
      this.events$.next({ type: 'summaryRefreshed', payload: summary });
    });

    this.hubConnection.on('OnRewardAwarded', (title: string, message: string, points: number) => {
      this.events$.next({ type: 'rewardAwarded', payload: { title, message, points } });
    });
  }

  private async joinGroups(counterId: number, branchId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) return;
    try {
      await this.hubConnection.invoke('JoinCounterGroup', counterId);
      await this.hubConnection.invoke('JoinBranchGroup', branchId);
      //console.log(`[QueueHub] Joined counter-${counterId} and branch-${branchId}`);
    } catch (err) {
      console.error('[QueueHub] Failed to join groups:', err);
    }
  }

  /**
   * Join a user-specific group to receive personalized updates (e.g. for my-bookings).
   */
  async joinUserGroup(userId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) return;
    try {
      await this.hubConnection.invoke('JoinUserGroup', userId);
      // Register personal-only handlers ONCE after joining the user group
      if (!this.personalHandlersRegistered) {
        this.registerPersonalHandlers();
        this.personalHandlersRegistered = true;
      }
      //console.log(`[QueueHub] Joined user-${userId}`);
    } catch (err) {
      console.error('[QueueHub] Failed to join user group:', err);
    }
  }

  /**
   * Register handlers that emit to personalEvents$ only.
   * These fire when the server sends directly to user-{userId} group.
   * We use separate SignalR method names defined in the hub for personal calls.
   */
  private registerPersonalHandlers(): void {
    if (!this.hubConnection) return;

    // OnPersonalAnnouncement is sent ONLY to user-{userId} group
    this.hubConnection.on('OnPersonalAnnouncement', (ticketNumber: string, counterName: string, message: string) => {
      this.personalEvents$.next({ type: 'announcement', payload: { ticketNumber, counterName, message }, isPersonal: true });
    });

    // OnPersonalQueueUpdated is sent ONLY to user-{userId} group
    this.hubConnection.on('OnPersonalQueueUpdated', (ticket: any) => {
      this.personalEvents$.next({ type: 'queueUpdated', payload: ticket, isPersonal: true });
    });
  }

  /**
   * Connect to the hub WITHOUT auth token — for public TV Display screen.
   * Only joins the branch group to receive broadcast events.
   */
  async connectPublic(branchId: number): Promise<void> {
    if (this.hubConnection) {
      // already connected, just join branch group
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.invoke('JoinBranchGroup', branchId).catch(console.error);
      }
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        // No token — public anonymous access
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect([0, 3000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.registerHandlers();

    this.hubConnection.onreconnecting(() =>
      this.connectionState$.next(signalR.HubConnectionState.Reconnecting)
    );

    this.hubConnection.onreconnected(async () => {
      this.connectionState$.next(signalR.HubConnectionState.Connected);
      await this.hubConnection!.invoke('JoinBranchGroup', branchId).catch(console.error);
    });

    this.hubConnection.onclose(() =>
      this.connectionState$.next(signalR.HubConnectionState.Disconnected)
    );

    try {
      await this.hubConnection.start();
      this.connectionState$.next(signalR.HubConnectionState.Connected);
      await this.hubConnection.invoke('JoinBranchGroup', branchId);
      //console.log(`[QueueHub] Public connected — joined branch-${branchId}`);
    } catch (err) {
      //console.error('[QueueHub] Public connection failed:', err);
      this.connectionState$.next(signalR.HubConnectionState.Disconnected);
    }
  }

  async disconnect(): Promise<void> {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
