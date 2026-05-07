export interface BranchResponse {
  branchId: number;
  branchName: string;
  address: string;
  status: string;
  totalServices: number;
  totalCounters: number;
  createdAt: string;
}

export interface CreateBranchRequest {
  branchName: string;
  address: string;
  status: string;
}

export interface UpdateBranchRequest {
  branchId: number;
  branchName?: string;
  address?: string;
  status?: string;
}

export interface ServiceResponse {
  serviceId: number;
  serviceCode: string;
  serviceName: string;
  branchId: number;
  branchName: string;
  avgDurationMinutes: number;
  isOnlineBookingEnabled: boolean;
  totalBookingsToday: number;
  waitingCount: number;
}

export interface CreateServiceRequest {
  serviceCode: string;
  serviceName: string;
  branchId: number;
  avgDurationMinutes: number;
  isOnlineBookingEnabled: boolean;
}

export interface UpdateServiceRequest {
  serviceId: number;
  serviceCode?: string;
  serviceName?: string;
  branchId?: number;
  avgDurationMinutes?: number;
  isOnlineBookingEnabled?: boolean;
}

export interface CounterResponse {
  counterId: number;
  counterName: string;
  branchId: number;
  branchName: string;
  assignedStaffId: number | null;
  assignedStaffName: string | null;
  status: string;
  currentTicketNumber: string | null;
  totalServedToday: number;
}

export interface CreateCounterRequest {
  counterName: string;
  branchId: number;
  assignedStaffId: number | null;
  status: string;
}

export interface UpdateCounterRequest {
  counterId: number;
  counterName?: string;
  branchId?: number;
  assignedStaffId?: number | null;
  status?: string;
}

export interface AssignStaffRequest {
  staffId: number | null;
}
