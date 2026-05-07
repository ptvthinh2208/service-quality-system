namespace ServiceQuality.Application.DTOs;

// ---- AUTH DTOs ----

public class LoginRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public AdminInfoDto Admin { get; set; } = null!;
}

public class AdminInfoDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Role { get; set; } = string.Empty;
}

// ---- DASHBOARD DTOs ----

public class DashboardStatsDto
{
    public int TodayCount { get; set; }
    public decimal TodayAvgScore { get; set; }
    public int ThisMonthCount { get; set; }
    public decimal ThisMonthAvgScore { get; set; }
    public int TotalCount { get; set; }
    public decimal OverallAvgScore { get; set; }
    public List<CategoryStatsDto> CategoryStats { get; set; } = [];
}

public class CategoryStatsDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal AvgScore { get; set; }
    public int TotalRatings { get; set; }
    public int Star1 { get; set; }
    public int Star2 { get; set; }
    public int Star3 { get; set; }
    public int Star4 { get; set; }
    public int Star5 { get; set; }
}

public class DailyTrendDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
    public decimal AvgScore { get; set; }
}

// ---- APP CONFIG DTOs ----

public class AppConfigDto
{
    public string WelcomeTitle { get; set; } = "Đánh Giá Chất Lượng Dịch Vụ";
    public string WelcomeSubtitle { get; set; } = "Xin chào! Hãy chia sẻ trải nghiệm của bạn";
    public string ThankYouMessage { get; set; } = "Cảm ơn bạn đã đánh giá!";
    public int ResetTimeoutSeconds { get; set; } = 10;
    public string? LogoUrl { get; set; }
    public string PrimaryColor { get; set; } = "#1976D2";
}
