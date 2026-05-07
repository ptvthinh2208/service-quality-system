using ServiceQuality.Domain.Common;

namespace ServiceQuality.Domain.Entities;

/// <summary>
/// Cấu hình tiêu chí đánh giá - Admin điều chỉnh linh hoạt từ portal.
/// Flutter App gọi API để lấy về và render form động.
/// </summary>
public class EvaluationCategory : BaseEntity
{
    public int Id { get; set; }

    /// <summary>Tên tiêu chí hiển thị trên app</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Mô tả phụ bên dưới tên tiêu chí</summary>
    public string? Description { get; set; }

    /// <summary>Icon đại diện (emoji hoặc tên icon, vd: "👤", "🏬")</summary>
    public string? Icon { get; set; }

    /// <summary>Thứ tự hiển thị trên app (tăng dần)</summary>
    public int DisplayOrder { get; set; } = 0;

    /// <summary>Bật/tắt tiêu chí này — Admin toggle từ portal</summary>
    public bool IsActive { get; set; } = true;

    // --- Cấu hình ô bình luận ---

    /// <summary>Có hiển thị ô bình luận bên dưới star rating không</summary>
    public bool AllowComment { get; set; } = true;

    /// <summary>Placeholder text cho ô bình luận</summary>
    public string? CommentLabel { get; set; } = "Chia sẻ thêm ý kiến của bạn...";

    /// <summary>Bình luận bắt buộc nhập hay tùy chọn</summary>
    public bool CommentRequired { get; set; } = false;

    // --- Cấu hình điểm ---

    /// <summary>Điểm tối thiểu (mặc định 1)</summary>
    public int MinScore { get; set; } = 1;

    /// <summary>Điểm tối đa (mặc định 5)</summary>
    public int MaxScore { get; set; } = 5;

    /// <summary>Bắt buộc chọn điểm hay có thể bỏ qua</summary>
    public bool IsRequired { get; set; } = true;

    // --- Metadata ---
    public int? CreatedBy { get; set; }

    // Navigation
    public AdminUser? Creator { get; set; }
    public ICollection<EvaluationItem> EvaluationItems { get; set; } = [];
}
