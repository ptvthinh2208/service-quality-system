namespace ServiceQuality.Application.DTOs;

// ---- EVALUATION DTOs ----

/// <summary>DTO Flutter gửi lên khi submit đánh giá</summary>
public class SubmitEvaluationDto
{
    public string? DeviceId { get; set; }
    public string? DevicePlatform { get; set; }
    public string? AppVersion { get; set; }
    public string? GeneralComment { get; set; }
    public List<EvaluationItemDto> Items { get; set; } = [];
}

public class EvaluationItemDto
{
    public int CategoryId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
}

/// <summary>Response sau khi submit thành công</summary>
public class SubmitEvaluationResponseDto
{
    public long SessionId { get; set; }
    public string SessionCode { get; set; } = string.Empty;
    public string Message { get; set; } = "Cảm ơn bạn đã đánh giá!";
}

/// <summary>DTO hiển thị danh sách đánh giá trên Admin</summary>
public class EvaluationSessionListDto
{
    public long Id { get; set; }
    public string SessionCode { get; set; } = string.Empty;
    public string? DevicePlatform { get; set; }
    public string? GeneralComment { get; set; }
    public decimal? TotalScore { get; set; }
    public DateTime SubmittedAt { get; set; }
    public int ItemCount { get; set; }
}

/// <summary>DTO chi tiết một đánh giá trên Admin</summary>
public class EvaluationSessionDetailDto : EvaluationSessionListDto
{
    public string? DeviceId { get; set; }
    public string? AppVersion { get; set; }
    public string? IpAddress { get; set; }
    public List<EvaluationItemDetailDto> Items { get; set; } = [];
}

public class EvaluationItemDetailDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int Score { get; set; }
    public string? Comment { get; set; }
}

/// <summary>Tham số lọc danh sách đánh giá</summary>
public class EvaluationFilterDto
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? MinScore { get; set; }
    public int? MaxScore { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

/// <summary>Generic paged result</summary>
public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
