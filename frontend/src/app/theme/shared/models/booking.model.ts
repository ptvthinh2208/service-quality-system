export interface Service {
    serviceId: number;
    serviceCode: string;
    serviceName: string;
    avgDurationMinutes: number;
}

export interface Branch {
    branchId: number;
    branchName: string;
    address: string;
}

export interface Vehicle {
    vehicleId: number;
    licensePlate: string;
    vehicleType: string;
    color: string;
}

// ==================== Master Data Models ====================

export interface BranchResponse {
    branchId: number;
    branchName: string;
    address?: string;
    status: string;
    totalServices: number;
    totalCounters: number;
    createdAt: string;
}

export interface CreateBranchRequest {
    branchName: string;
    address?: string;
    status?: string;
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
    avgDurationMinutes?: number;
    isOnlineBookingEnabled?: boolean;
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
    assignedStaffId?: number;
    assignedStaffName?: string;
    status: string;
    currentTicketNumber?: string;
    totalServedToday: number;
}

export interface CreateCounterRequest {
    counterName: string;
    branchId: number;
    assignedStaffId?: number;
    status?: string;
}

export interface UpdateCounterRequest {
    counterId: number;
    counterName?: string;
    branchId?: number;
    assignedStaffId?: number;
    status?: string;
}

export interface AssignStaffRequest {
    staffId?: number;
}

export interface MasterDataListResponse<T> {
    totalCount: number;
    items: T[];
}
export interface BookingResponse {
    bookingId: number;
    userName: string;
    fullName: string;
    serviceName: string;
    branchName: string;
    licensePlate: string;
    bookingDate: string;
    timeSlotStart: string;
    timeSlotEnd: string;
    status: string; // Sync with Backend (Pending, Confirmed, Cancelled, Completed, NoShow)
    verificationCode?: string;
    createdAt: string;
    ticketNumber?: string;
    estimatedWaitMinutes?: number;
    
    // Sync with Queue Status
    queueId?: number;
    queueStatus?: string; // Waiting, Serving, Completed, Skipped
    counterName?: string;
    calledTime?: string;
    queueCreatedAt?: string; 
}
export interface BookingListResponse {
    totalCount: number;
    bookings: BookingResponse[];
}
export interface CreateBookingRequest {
    serviceId: number;
    branchId: number;
    bookingDate: string; // Format YYYY-MM-DD
    timeSlotStart: string; // Format HH:mm
    timeSlotEnd: string;   // Format HH:mm
    vehicleId?: number;
    notes?: string;
}
export interface BookingCompletionResponse {
  success: boolean;
  message: string;
  totalPointsEarned: number;
  normalPoints: number;
  bonusPoints: number;
  isFirstChargeBonus: boolean;
  luckyCodes: string[];
  campaignName: string;
}
