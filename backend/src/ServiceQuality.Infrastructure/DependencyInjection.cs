using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ServiceQuality.Application.Interfaces;
using ServiceQuality.Infrastructure.Data;
using ServiceQuality.Infrastructure.Services;

namespace ServiceQuality.Infrastructure;

/// <summary>
/// Extension method để đăng ký toàn bộ Infrastructure dependencies vào DI container
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // === EF Core + Pomelo MySQL ===
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString),
                mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorNumbersToAdd: null)
            )
        );

        // === Services ===
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IEvaluationService, EvaluationService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppConfigService, AppConfigService>();
        services.AddScoped<IReportService, ReportService>();

        return services;
    }
}
