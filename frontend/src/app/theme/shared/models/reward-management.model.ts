export interface RewardPolicyResponse {
  policyId: number;
  policyName: string;
  isActive: boolean;
  thresholdKwLow: number;
  thresholdKwHigh: number;
  pointsForLowTier: number;
  pointsForHighTier: number;
  peakHourStart: number;
  peakHourEnd: number;
  peakMultiplier: number;
  calculationType: string;
  kwPerPoint: number;
  fixedBonusPoints?: number;
}

export interface CreateRewardPolicyRequest {
  policyName: string;
  isActive: boolean;
  thresholdKwLow: number;
  thresholdKwHigh: number;
  pointsForLowTier: number;
  pointsForHighTier: number;
  peakHourStart: number;
  peakHourEnd: number;
  peakMultiplier: number;
  calculationType: string;
  kwPerPoint: number;
  fixedBonusPoints?: number;
}

export interface RewardCampaignResponse {
  campaignId: number;
  campaignName: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string; // Tường này mới thêm
  status: string;
  campaignType: string;
  appliedPolicyId: number;
  allowCreateLuckyCode: boolean;
  policyName?: string;
  createdAt: string;
  updatedAt?: string;
  internalNotes?: string;
  totalTransactions: number;
  totalParticipants: number;
}

export interface RewardCampaignDto {
  campaignId: number;
  campaignName: string;
  description?: string;
  bannerUrl?: string; // Tường này mới thêm
  startDate: string;
  endDate: string;
  status: string;
  campaignType: string;
  appliedPolicyId: number;
  allowCreateLuckyCode: boolean;
  internalNotes?: string;
}

export interface RewardWalletResponse {
  walletId: number;
  userId: number;
  totalPoints: number;
  level: string;
  lastUpdated: string;
  isFirstChargeBonusApplied: boolean;
}

export interface RewardTransactionResponse {
  transactionId: number;
  pointsChanged: number;
  transactionType: string;
  description: string;
  createdAt: string;
  luckyCode?: string;
  campaignId?: number;
  campaignName?: string;
  campaignBannerUrl?: string;
}

export interface RewardHistoryResponse {
  currentWallet: RewardWalletResponse;
  transactions: RewardTransactionResponse[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface AdminAwardPointsRequest {
  userId: number;
  points: number;
  reason: string;
}

export interface AdminRewardTransactionRequest {
  page: number;
  size: number;
  searchTerm?: string;
  transactionType?: string;
  campaignId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminRewardTransactionResponse extends RewardTransactionResponse {
  fullName?: string;
  phoneNumber?: string;
  username?: string;
}
