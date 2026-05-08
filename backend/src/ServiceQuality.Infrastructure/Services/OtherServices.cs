using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;
using ServiceQuality.Infrastructure.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ServiceQuality.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var admin = await _db.AdminUsers
            .FirstOrDefaultAsync(u => u.Username == dto.Username && u.IsActive);

        if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.Password))
            return null;

        // Cập nhật LastLogin
        admin.LastLogin = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var (accessToken, expiresAt) = GenerateAccessToken(admin);
        var refreshToken = Guid.NewGuid().ToString("N");

        return new LoginResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            Admin = new AdminInfoDto
            {
                Id = admin.Id,
                Username = admin.Username,
                FullName = admin.FullName,
                Role = admin.Role.ToString()
            }
        };
    }

    public Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken)
    {
        // Simplified: trong production nên lưu refresh token vào DB/Redis
        throw new NotImplementedException("Refresh token sẽ implement với Redis hoặc DB store");
    }

    private (string token, DateTime expiresAt) GenerateAccessToken(Domain.Entities.AdminUser admin)
    {
        var jwtKey = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTime.UtcNow.AddHours(8);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new Claim(ClaimTypes.Name, admin.Username),
            new Claim(ClaimTypes.Role, admin.Role.ToString()),
            new Claim("fullName", admin.FullName ?? string.Empty)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;
    public DashboardService(AppDbContext db) => _db = db;

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var todaySessions = await _db.EvaluationSessions
            .Where(s => s.SubmittedAt >= today)
            .ToListAsync();

        var monthSessions = await _db.EvaluationSessions
            .Where(s => s.SubmittedAt >= monthStart)
            .ToListAsync();

        var allSessions = await _db.EvaluationSessions.ToListAsync();

        var categoryStats = await _db.EvaluationCategories
            .Where(c => c.IsActive)
            .Select(c => new CategoryStatsDto
            {
                CategoryId = c.Id,
                CategoryName = c.Name,
                TotalRatings = c.EvaluationItems.Count,
                AvgScore = c.EvaluationItems.Any()
                    ? (decimal)c.EvaluationItems.Average(i => i.Score)
                    : 0,
                Star1 = c.EvaluationItems.Count(i => i.Score == 1),
                Star2 = c.EvaluationItems.Count(i => i.Score == 2),
                Star3 = c.EvaluationItems.Count(i => i.Score == 3),
                Star4 = c.EvaluationItems.Count(i => i.Score == 4),
                Star5 = c.EvaluationItems.Count(i => i.Score == 5),
            })
            .ToListAsync();

        return new DashboardStatsDto
        {
            TodayCount = todaySessions.Count,
            TodayAvgScore = todaySessions.Any(s => s.TotalScore.HasValue)
                ? Math.Round((decimal)todaySessions.Where(s => s.TotalScore.HasValue).Average(s => s.TotalScore!.Value), 2)
                : 0,
            ThisMonthCount = monthSessions.Count,
            ThisMonthAvgScore = monthSessions.Any(s => s.TotalScore.HasValue)
                ? Math.Round((decimal)monthSessions.Where(s => s.TotalScore.HasValue).Average(s => s.TotalScore!.Value), 2)
                : 0,
            TotalCount = allSessions.Count,
            OverallAvgScore = allSessions.Any(s => s.TotalScore.HasValue)
                ? Math.Round((decimal)allSessions.Where(s => s.TotalScore.HasValue).Average(s => s.TotalScore!.Value), 2)
                : 0,
            CategoryStats = categoryStats
        };
    }

    public async Task<List<DailyTrendDto>> GetDailyTrendsAsync(int days = 30)
    {
        var fromDate = DateTime.UtcNow.Date.AddDays(-days);

        return await _db.EvaluationSessions
            .Where(s => s.SubmittedAt >= fromDate)
            .GroupBy(s => s.SubmittedAt.Date)
            .OrderBy(g => g.Key)
            .Select(g => new DailyTrendDto
            {
                Date = g.Key,
                Count = g.Count(),
                AvgScore = g.Any(s => s.TotalScore.HasValue)
                    ? Math.Round((decimal)g.Where(s => s.TotalScore.HasValue).Average(s => s.TotalScore!.Value), 2)
                    : 0
            })
            .ToListAsync();
    }
}

public class AppConfigService : IAppConfigService
{
    private readonly AppDbContext _db;
    public AppConfigService(AppDbContext db) => _db = db;

    public async Task<AppConfigDto> GetAppConfigAsync()
    {
        var configs = await _db.AppConfigs
            .ToDictionaryAsync(c => c.ConfigKey, c => c.ConfigValue ?? string.Empty);

        return new AppConfigDto
        {
            WelcomeTitle = configs.GetValueOrDefault("welcome_title", "Đánh Giá Chất Lượng Dịch Vụ"),
            WelcomeSubtitle = configs.GetValueOrDefault("welcome_subtitle", "Xin chào! Hãy chia sẻ trải nghiệm của bạn"),
            ThankYouMessage = configs.GetValueOrDefault("thankyou_message", "Cảm ơn bạn đã đánh giá!"),
            ResetTimeoutSeconds = int.TryParse(configs.GetValueOrDefault("reset_timeout_seconds", "10"), out var t) ? t : 10,
            LogoUrl = configs.GetValueOrDefault("logo_url", null!),
            PrimaryColor = configs.GetValueOrDefault("primary_color", "#1976D2"),
            Hotline = configs.GetValueOrDefault("hotline", "1900 1234")
        };
    }

    public async Task UpdateConfigAsync(string key, string value)
    {
        var config = await _db.AppConfigs.FirstOrDefaultAsync(c => c.ConfigKey == key);
        if (config != null)
        {
            config.ConfigValue = value;
            config.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }
}
