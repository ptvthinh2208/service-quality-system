export enum QueueStatus {
  Waiting = 'Waiting',
  Calling = 'Calling',
  Serving = 'Serving',
  Completed = 'Completed',
  Skipped = 'Skipped'
}

export interface QueueTicket {
  id?: number;
  ticketId?: number; // Some endpoints might map back to ticketId or queueId
  queueId?: number;
  ticketNumber: string;
  bookingId?: number;
  customerName: string;
  phoneNumber?: string;
  vehiclePlate?: string;
  serviceId: number;
  serviceName: string;
  branchId: number;
  branchName: string;
  counterId?: number;
  counterName?: string;
  status: QueueStatus;
  createdAt: string;
  updatedAt?: string;
  calledAt?: string;
  servedAt?: string;
  completedAt?: string;
  skippedAt?: string;
  skipReason?: string;
  isPriority: boolean;
  estimatedWaitTimeMinutes?: number;
}

export interface CallTicketRequest {
  counterId: number;
  ticketId?: number;
  isRecall: boolean;
  isPriority: boolean;
}

export interface CallSpecificRequest {
  queueId: number;
  counterId: number;
}

export interface SkipTicketRequest {
  ticketId: number;
  reason: string;
}

export interface QueueSummary {
  waitingCount: number;
  callingCount: number;
  servingCount: number;
  completedCount: number;
  skippedCount: number;
  averageWaitTimeMinutes: number;
}

export interface QueueFilter {
  status?: QueueStatus;
  date?: string;
  serviceId?: number;
  branchId?: number;
  counterId?: number;
  keyword?: string;
  pageNumber?: number;
  pageSize?: number;
}
