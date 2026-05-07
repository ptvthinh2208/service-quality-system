namespace ServiceQuality.Domain.Common;

/// <summary>
/// Base entity with common audit fields
/// </summary>
public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
