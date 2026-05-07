using ServiceQuality.Domain.Common;

namespace ServiceQuality.Domain.Entities;

/// <summary>
/// Một phiên đánh giá = một lần user Flutter gửi đánh giá.
/// Lưu toàn bộ metadata thiết bị và snapshot cấu hình tại thời điểm gửi.
/// </summary>
public class EvaluationSession : BaseEntity
{
    public long Id { get; set; }

    /// <summary>UUID unique cho mỗi phiên đánh giá</summary>
    public string SessionCode { get; set; } = Guid.NewGuid().ToString();

    /// <summary>Device ID của Flutter app (persistent)</summary>
    public string? DeviceId { get; set; }

    /// <summary>Platform: "android" | "ios"</summary>
    public string? DevicePlatform { get; set; }

    /// <summary>Phiên bản Flutter app</summary>
    public string? AppVersion { get; set; }

    /// <summary>IP address của request</summary>
    public string? IpAddress { get; set; }

    /// <summary>Bình luận tổng (tùy chọn, không gắn với tiêu chí nào)</summary>
    public string? GeneralComment { get; set; }

    /// <summary>Điểm trung bình tự tính từ tất cả items</summary>
    public decimal? TotalScore { get; set; }

    /// <summary>Thời điểm submit</summary>
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// JSON snapshot cấu hình tiêu chí tại thời điểm gửi.
    /// Quan trọng: đảm bảo báo cáo chính xác dù Admin đổi config sau.
    /// </summary>
    public string? ConfigSnapshot { get; set; }

    // Navigation
    public ICollection<EvaluationItem> Items { get; set; } = [];
}
