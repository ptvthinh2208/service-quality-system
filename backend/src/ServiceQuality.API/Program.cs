using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using ServiceQuality.Infrastructure;
using ServiceQuality.Infrastructure.Data;
using System.Text;
using BCrypt.Net;

var builder = WebApplication.CreateBuilder(args);

// ========== SERILOG ==========
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

// ========== SERVICES ==========
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- Infrastructure (EF Core + MySQL + Services) ---
builder.Services.AddInfrastructure(builder.Configuration);

// --- CORS ---
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AppCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });

    // Flutter App: cho phép từ bất kỳ origin (vì là mobile app)
    options.AddPolicy("MobileCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .WithMethods("GET", "POST");
    });
});

// --- JWT Authentication ---
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero,
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256 }
        };
    });

builder.Services.AddAuthorization();

// --- Swagger với JWT support ---
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Service Quality API",
        Version = "v1",
        Description = "API cho hệ thống đánh giá chất lượng dịch vụ - Nutrihealth",
        Contact = new OpenApiContact { Name = "Nutrihealth Dev Team", Email = "dev@atlink.asia" }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Chỉ cần dán Access Token vào đây (không cần gõ 'Bearer ')",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// THIẾT LẬP SUB-FOLDER LINH HOẠT: Đọc từ appsettings.json
var pathBase = app.Configuration["PathBase"];
if (!string.IsNullOrEmpty(pathBase))
{
    app.UsePathBase(pathBase);
}

// ========== MIDDLEWARE PIPELINE ==========

// Auto-migrate và seed database khi khởi động
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Dùng Migrations thay thế khi production

    // // Rescue: Đảm bảo tài khoản admin luôn có mật khẩu mới chuẩn mã hóa
    // var admin = db.AdminUsers.FirstOrDefault(u => u.Username == "admin");
    // if (admin != null)
    // {
    //     admin.Password = BCrypt.Net.BCrypt.HashPassword("admin@Nutrihealth2026");
    //     admin.IsActive = true;
    //     db.SaveChanges();
    // }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Service Quality API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseSerilogRequestLogging();
// app.UseHttpsRedirection(); 

// 1. Phục vụ file tĩnh (Angular)
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AppCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 2. Fallback về index.html nếu không khớp route API (Dành cho Angular Routing)
app.MapFallbackToFile("index.html");

// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
