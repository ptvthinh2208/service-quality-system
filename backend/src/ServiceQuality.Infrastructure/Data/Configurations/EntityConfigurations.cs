using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ServiceQuality.Domain.Entities;
using ServiceQuality.Domain.Enums;

namespace ServiceQuality.Infrastructure.Data.Configurations;

public class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> builder)
    {
        builder.ToTable("AdminUsers");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Username).IsRequired().HasMaxLength(100); // 100×4=400 bytes, OK
        builder.Property(x => x.Password).IsRequired().HasMaxLength(255);
        builder.Property(x => x.FullName).HasMaxLength(200);
        // Email unique index: giới hạn 191 ký tự với utf8mb4 (191×4=764 bytes < 767 bytes MySQL limit)
        builder.Property(x => x.Email).HasMaxLength(191);
        builder.Property(x => x.Role)
               .HasConversion<string>()
               .HasMaxLength(20)
               .HasSentinel(AdminRole.Viewer); // Fix: dùng Sentinel thay vì HasDefaultValue cho enum

        builder.HasIndex(x => x.Username).IsUnique();
        builder.HasIndex(x => x.Email).IsUnique();

        // Seed: tài khoản SuperAdmin mặc định
        // Password: admin123 (BCrypt hash)
        builder.HasData(new AdminUser
        {
            Id = 1,
            Username = "admin",
            Password = "$2a$11$Z1n47x.y6f5S7n1x7Uo1xeG6D/k6gV7gJ5Q0V5z8g4G4l8Q4q6s6O", 
            FullName = "Super Administrator",
            Email = "admin@atlink.asia",
            Role = AdminRole.SuperAdmin,
            IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });
    }
}

public class EvaluationCategoryConfiguration : IEntityTypeConfiguration<EvaluationCategory>
{
    public void Configure(EntityTypeBuilder<EvaluationCategory> builder)
    {
        builder.ToTable("EvaluationCategories");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Description).HasMaxLength(500);
        builder.Property(x => x.Icon).HasMaxLength(100);
        builder.Property(x => x.CommentLabel).HasMaxLength(200);
        builder.Property(x => x.DisplayOrder).HasDefaultValue(0);
        builder.Property(x => x.IsActive).HasDefaultValue(true);
        builder.Property(x => x.AllowComment).HasDefaultValue(true);
        builder.Property(x => x.CommentRequired).HasDefaultValue(false);
        builder.Property(x => x.MinScore).HasDefaultValue(1);
        builder.Property(x => x.MaxScore).HasDefaultValue(5);
        builder.Property(x => x.IsRequired).HasDefaultValue(true);

        builder.HasIndex(x => new { x.DisplayOrder, x.IsActive });

        // FK to AdminUser
        builder.HasOne(x => x.Creator)
               .WithMany(u => u.CreatedCategories)
               .HasForeignKey(x => x.CreatedBy)
               .OnDelete(DeleteBehavior.SetNull);

        // Seed: 3 tiêu chí mặc định
        builder.HasData(
            new EvaluationCategory
            {
                Id = 1, Name = "Thái độ nhân viên",
                Description = "Nhân viên có thân thiện và nhiệt tình phục vụ?",
                Icon = "👤", DisplayOrder = 1, IsActive = true,
                AllowComment = true, CommentLabel = "Bạn muốn chia sẻ thêm điều gì?",
                CommentRequired = false, MinScore = 1, MaxScore = 5, IsRequired = true,
                CreatedBy = 1, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new EvaluationCategory
            {
                Id = 2, Name = "Chất lượng sản phẩm",
                Description = "Sản phẩm có đạt chất lượng như kỳ vọng của bạn?",
                Icon = "⭐", DisplayOrder = 2, IsActive = true,
                AllowComment = true, CommentLabel = "Sản phẩm bạn sử dụng hôm nay là gì?",
                CommentRequired = false, MinScore = 1, MaxScore = 5, IsRequired = true,
                CreatedBy = 1, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new EvaluationCategory
            {
                Id = 3, Name = "Không gian & Môi trường",
                Description = "Không gian cửa hàng có sạch sẽ và thoải mái?",
                Icon = "🏬", DisplayOrder = 3, IsActive = true,
                AllowComment = false, CommentLabel = null,
                CommentRequired = false, MinScore = 1, MaxScore = 5, IsRequired = true,
                CreatedBy = 1, CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}

public class EvaluationSessionConfiguration : IEntityTypeConfiguration<EvaluationSession>
{
    public void Configure(EntityTypeBuilder<EvaluationSession> builder)
    {
        builder.ToTable("EvaluationSessions");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SessionCode).IsRequired().HasMaxLength(50);
        builder.Property(x => x.DeviceId).HasMaxLength(150);
        builder.Property(x => x.DevicePlatform).HasMaxLength(20);
        builder.Property(x => x.AppVersion).HasMaxLength(20);
        builder.Property(x => x.IpAddress).HasMaxLength(50);
        builder.Property(x => x.TotalScore).HasPrecision(5, 2);
        // Dùng longtext thay vì json để tương thích MySQL 5.7 và mọi phiên bản
        builder.Property(x => x.ConfigSnapshot).HasColumnType("longtext");

        builder.HasIndex(x => x.SessionCode).IsUnique();
        builder.HasIndex(x => x.SubmittedAt);
        builder.HasIndex(x => x.DeviceId);
    }
}

public class EvaluationItemConfiguration : IEntityTypeConfiguration<EvaluationItem>
{
    public void Configure(EntityTypeBuilder<EvaluationItem> builder)
    {
        builder.ToTable("EvaluationItems");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.CategoryName).HasMaxLength(200);

        builder.HasOne(x => x.Session)
               .WithMany(s => s.Items)
               .HasForeignKey(x => x.SessionId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Category)
               .WithMany(c => c.EvaluationItems)
               .HasForeignKey(x => x.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.SessionId);
        builder.HasIndex(x => x.CategoryId);
        builder.HasIndex(x => x.Score);
    }
}

public class AppConfigConfiguration : IEntityTypeConfiguration<AppConfig>
{
    public void Configure(EntityTypeBuilder<AppConfig> builder)
    {
        builder.ToTable("AppConfigs");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ConfigKey).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Description).HasMaxLength(300);
        builder.HasIndex(x => x.ConfigKey).IsUnique();

        // Seed: cấu hình mặc định app
        builder.HasData(
            new AppConfig { Id = 1, ConfigKey = "welcome_title", ConfigValue = "Đánh Giá Chất Lượng Dịch Vụ", Description = "Tiêu đề màn hình chào", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new AppConfig { Id = 2, ConfigKey = "welcome_subtitle", ConfigValue = "Xin chào! Hãy chia sẻ trải nghiệm của bạn với chúng tôi.", Description = "Phụ đề màn hình chào", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new AppConfig { Id = 3, ConfigKey = "thankyou_message", ConfigValue = "Cảm ơn bạn đã đánh giá! Chúng tôi sẽ cải thiện dịch vụ tốt hơn.", Description = "Thông điệp cảm ơn", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new AppConfig { Id = 4, ConfigKey = "reset_timeout_seconds", ConfigValue = "10", Description = "Thời gian tự reset app về màn hình chào (giây)", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new AppConfig { Id = 5, ConfigKey = "primary_color", ConfigValue = "#1976D2", Description = "Màu chủ đạo của app", CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
