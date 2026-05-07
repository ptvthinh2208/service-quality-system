using ServiceQuality.Application.DTOs;

namespace ServiceQuality.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
    Task<List<DailyTrendDto>> GetDailyTrendsAsync(int days = 30);
}

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto);
    Task<LoginResponseDto?> RefreshTokenAsync(string refreshToken);
}

public interface IAppConfigService
{
    Task<AppConfigDto> GetAppConfigAsync();
    Task UpdateConfigAsync(string key, string value);
}

public interface IReportService
{
    /// <summary>Xuất Excel danh sách đánh giá theo bộ lọc</summary>
    Task<byte[]> ExportEvaluationsToExcelAsync(EvaluationFilterDto filter);
}
