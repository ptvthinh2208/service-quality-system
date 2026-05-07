export interface EvaluationItemDetail {
    categoryId: number;
    categoryName: string;
    score: number;
    comment?: string;
}

export interface EvaluationSession {
    id: number;
    sessionCode: string;
    devicePlatform?: string;
    generalComment?: string;
    totalScore?: number;
    submittedAt: string;
    itemCount: number;
}

export interface EvaluationSessionDetail extends EvaluationSession {
    deviceId?: string;
    appVersion?: string;
    ipAddress?: string;
    items: EvaluationItemDetail[];
}

export interface EvaluationFilter {
    fromDate?: string;
    toDate?: string;
    minScore?: number;
    maxScore?: number;
    page: number;
    pageSize: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
