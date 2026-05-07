export interface RewardWallet {
    walletId: number;
    userId: number;
    totalPoints: number;
    level: string;
    lastUpdated: string;
    isFirstChargeBonusApplied: boolean;
}

export interface RewardTransaction {
    transactionId: number;
    pointsChanged: number;
    transactionType: string;
    description: string;
    luckyCode?: string;
    createdAt: string;
    campaignId?: number;
    campaignName?: string;
    campaignBannerUrl?: string;
}

export interface RewardHistoryResponse {
    currentWallet: RewardWallet;
    transactions: RewardTransaction[];
    totalCount: number;
}