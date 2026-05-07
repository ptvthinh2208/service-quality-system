export interface User {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: 'Admin' | 'Staff' | 'Customer'; // Chỉ chấp nhận 3 giá trị này
    defaultLicensePlate?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    requirePasswordChange?: boolean;
    refreshToken?: string | null;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    password: string;
    fullName: string;
    email?: string;
    phoneNumber: string;
    role?: string; // Mặc định là 'Customer'
    // Thông tin xe (Optional nhưng khuyến khích cho tài xế)
    licensePlate?: string;
    vehicleType?: string;
    vehicleColor?: string;
}
///User Info

export interface UserProfile {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    defaultLicensePlate?: string;
    vehicleType?: string;
    vehicleColor?: string;
}

export interface RewardWallet {
    walletId: number;
    userId: number;
    totalPoints: number;
    level: string; // Member, Silver, Gold...
    lastUpdated: string;
}

export interface RewardTransaction {
    transactionId: number;
    pointsChanged: number;
    transactionType: string; // Earned, Redeemed...
    description: string;
    createdAt: string;
}

export interface ProfileResponse {
    user: UserProfile;
    wallet: RewardWallet;
    recentTransactions: RewardTransaction[];
}