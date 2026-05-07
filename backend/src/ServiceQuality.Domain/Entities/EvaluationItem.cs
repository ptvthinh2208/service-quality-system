using ServiceQuality.Domain.Common;

namespace ServiceQuality.Domain.Entities;

/// <summary>
/// Chi tiết điểm và bình luận cho một tiêu chí trong một phiên đánh giá.
/// </summary>
public class EvaluationItem : BaseEntity
{
    public long Id { get; set; }

    public long SessionId { get; set; }
    public int CategoryId { get; set; }

    /// <summary>Snapshot tên tiêu chí tại thời điểm gửi (tránh sai lệch khi đổi tên sau)</summary>
    public string? CategoryName { get; set; }

    /// <summary>Điểm đánh giá (1-5)</summary>
    public int Score { get; set; }

    /// <summary>Bình luận cho tiêu chí này (có thể null nếu AllowComment=false)</summary>
    public string? Comment { get; set; }

    // Navigation
    public EvaluationSession Session { get; set; } = null!;
    public EvaluationCategory Category { get; set; } = null!;
}
