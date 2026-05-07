using ServiceQuality.Domain.Common;
using ServiceQuality.Domain.Enums;

namespace ServiceQuality.Domain.Entities;

/// <summary>
/// Tài khoản Admin quản lý hệ thống
/// </summary>
public class AdminUser : BaseEntity
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // BCrypt hashed
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public AdminRole Role { get; set; } = AdminRole.Viewer;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLogin { get; set; }

    // Navigation
    public ICollection<EvaluationCategory> CreatedCategories { get; set; } = [];
}
