using Microsoft.EntityFrameworkCore;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;
using ServiceQuality.Domain.Entities;
using ServiceQuality.Infrastructure.Data;
using System.Text.Json;

namespace ServiceQuality.Infrastructure.Services;

public class EvaluationService : IEvaluationService
{
    private readonly AppDbContext _db;
    public EvaluationService(AppDbContext db) => _db = db;

    public async Task<SubmitEvaluationResponseDto> SubmitAsync(SubmitEvaluationDto dto, string? ipAddress)
    {
        // Lấy config snapshot tại thời điểm gửi
        var categories = await _db.EvaluationCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        var configSnapshot = JsonSerializer.Serialize(categories.Select(c => new
        {
            c.Id, c.Name, c.DisplayOrder, c.AllowComment, c.MinScore, c.MaxScore
        }));

        // Tính điểm trung bình
        decimal? avgScore = dto.Items.Count > 0
            ? Math.Round((decimal)dto.Items.Average(i => i.Score), 2)
            : null;

        var session = new EvaluationSession
        {
            SessionCode = Guid.NewGuid().ToString(),
            DeviceId = dto.DeviceId,
            DevicePlatform = dto.DevicePlatform,
            AppVersion = dto.AppVersion,
            IpAddress = ipAddress,
            GeneralComment = dto.GeneralComment,
            TotalScore = avgScore,
            SubmittedAt = DateTime.UtcNow,
            ConfigSnapshot = configSnapshot
        };

        // Map category names từ snapshot
        var categoryMap = categories.ToDictionary(c => c.Id, c => c.Name);

        session.Items = dto.Items.Select(item => new EvaluationItem
        {
            CategoryId = item.CategoryId,
            CategoryName = categoryMap.TryGetValue(item.CategoryId, out var name) ? name : null,
            Score = item.Score,
            Comment = item.Comment,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        _db.EvaluationSessions.Add(session);
        await _db.SaveChangesAsync();

        return new SubmitEvaluationResponseDto
        {
            SessionId = session.Id,
            SessionCode = session.SessionCode,
            Message = "Cảm ơn bạn đã đánh giá!"
        };
    }

    public async Task<PagedResult<EvaluationSessionListDto>> GetPagedAsync(EvaluationFilterDto filter)
    {
        var query = _db.EvaluationSessions.AsQueryable();

        if (filter.FromDate.HasValue)
            query = query.Where(s => s.SubmittedAt >= filter.FromDate.Value.ToUniversalTime());
        if (filter.ToDate.HasValue)
            query = query.Where(s => s.SubmittedAt <= filter.ToDate.Value.ToUniversalTime());
        if (filter.MinScore.HasValue)
            query = query.Where(s => s.TotalScore >= filter.MinScore.Value);
        if (filter.MaxScore.HasValue)
            query = query.Where(s => s.TotalScore <= filter.MaxScore.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(s => s.SubmittedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(s => new EvaluationSessionListDto
            {
                Id = s.Id,
                SessionCode = s.SessionCode,
                DevicePlatform = s.DevicePlatform,
                GeneralComment = s.GeneralComment,
                TotalScore = s.TotalScore,
                SubmittedAt = s.SubmittedAt,
                ItemCount = s.Items.Count,
                CommentCount = s.Items.Count(i => i.Comment != null && i.Comment != "")
            })
            .ToListAsync();

        return new PagedResult<EvaluationSessionListDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<EvaluationSessionDetailDto?> GetDetailAsync(long id)
    {
        var session = await _db.EvaluationSessions
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null) return null;

        return new EvaluationSessionDetailDto
        {
            Id = session.Id,
            SessionCode = session.SessionCode,
            DeviceId = session.DeviceId,
            DevicePlatform = session.DevicePlatform,
            AppVersion = session.AppVersion,
            IpAddress = session.IpAddress,
            GeneralComment = session.GeneralComment,
            TotalScore = session.TotalScore,
            SubmittedAt = session.SubmittedAt,
            ItemCount = session.Items.Count,
            Items = session.Items.Select(i => new EvaluationItemDetailDto
            {
                CategoryId = i.CategoryId,
                CategoryName = i.CategoryName ?? string.Empty,
                Score = i.Score,
                Comment = i.Comment
            }).ToList()
        };
    }
}
