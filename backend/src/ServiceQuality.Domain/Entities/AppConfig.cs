using ServiceQuality.Domain.Common;

namespace ServiceQuality.Domain.Entities;

/// <summary>
/// Cấu hình toàn ứng dụng (welcome text, logo, timeout tự reset, ...).
/// Admin điều chỉnh từ portal, Flutter + Angular đọc về.
/// </summary>
public class AppConfig : BaseEntity
{
    public int Id { get; set; }

    /// <summary>Khóa cấu hình (vd: "welcome_title", "reset_timeout_seconds")</summary>
    public string ConfigKey { get; set; } = string.Empty;

    /// <summary>Giá trị cấu hình (string, number, JSON đều được)</summary>
    public string? ConfigValue { get; set; }

    /// <summary>Mô tả ý nghĩa của key này</summary>
    public string? Description { get; set; }
}
