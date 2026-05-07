using Microsoft.EntityFrameworkCore;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;
using ServiceQuality.Domain.Entities;
using ServiceQuality.Infrastructure.Data;
using System.Text.Json;

namespace ServiceQuality.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _db;
    public CategoryService(AppDbContext db) => _db = db;

    public async Task<List<CategoryDto>> GetActiveCategoriesAsync()
    {
        return await _db.EvaluationCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id, Name = c.Name, Description = c.Description,
                Icon = c.Icon, DisplayOrder = c.DisplayOrder,
                AllowComment = c.AllowComment, CommentLabel = c.CommentLabel,
                CommentRequired = c.CommentRequired,
                MinScore = c.MinScore, MaxScore = c.MaxScore, IsRequired = c.IsRequired
            })
            .ToListAsync();
    }

    public async Task<List<CategoryAdminDto>> GetAllCategoriesForAdminAsync()
    {
        return await _db.EvaluationCategories
            .Include(c => c.Creator)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryAdminDto
            {
                Id = c.Id, Name = c.Name, Description = c.Description,
                Icon = c.Icon, DisplayOrder = c.DisplayOrder, IsActive = c.IsActive,
                AllowComment = c.AllowComment, CommentLabel = c.CommentLabel,
                CommentRequired = c.CommentRequired,
                MinScore = c.MinScore, MaxScore = c.MaxScore, IsRequired = c.IsRequired,
                CreatedAt = c.CreatedAt, UpdatedAt = c.UpdatedAt,
                CreatorName = c.Creator != null ? c.Creator.FullName : null
            })
            .ToListAsync();
    }

    public async Task<CategoryAdminDto?> GetByIdAsync(int id)
    {
        var c = await _db.EvaluationCategories
            .Include(x => x.Creator)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (c == null) return null;
        return MapToAdminDto(c);
    }

    public async Task<CategoryAdminDto> CreateAsync(CreateCategoryDto dto, int createdBy)
    {
        var entity = new EvaluationCategory
        {
            Name = dto.Name, Description = dto.Description, Icon = dto.Icon,
            DisplayOrder = dto.DisplayOrder, IsActive = dto.IsActive,
            AllowComment = dto.AllowComment, CommentLabel = dto.CommentLabel,
            CommentRequired = dto.CommentRequired,
            MinScore = dto.MinScore, MaxScore = dto.MaxScore, IsRequired = dto.IsRequired,
            CreatedBy = createdBy, CreatedAt = DateTime.UtcNow
        };
        _db.EvaluationCategories.Add(entity);
        await _db.SaveChangesAsync();
        return MapToAdminDto(entity);
    }

    public async Task<CategoryAdminDto?> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var entity = await _db.EvaluationCategories.FindAsync(id);
        if (entity == null) return null;

        entity.Name = dto.Name; entity.Description = dto.Description;
        entity.Icon = dto.Icon; entity.DisplayOrder = dto.DisplayOrder;
        entity.IsActive = dto.IsActive; entity.AllowComment = dto.AllowComment;
        entity.CommentLabel = dto.CommentLabel; entity.CommentRequired = dto.CommentRequired;
        entity.MinScore = dto.MinScore; entity.MaxScore = dto.MaxScore;
        entity.IsRequired = dto.IsRequired; entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToAdminDto(entity);
    }

    public async Task<bool> ToggleActiveAsync(int id)
    {
        var entity = await _db.EvaluationCategories.FindAsync(id);
        if (entity == null) return false;
        entity.IsActive = !entity.IsActive;
        entity.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ReorderAsync(ReorderCategoriesDto dto)
    {
        foreach (var item in dto.Items)
        {
            var entity = await _db.EvaluationCategories.FindAsync(item.Id);
            if (entity != null)
            {
                entity.DisplayOrder = item.DisplayOrder;
                entity.UpdatedAt = DateTime.UtcNow;
            }
        }
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _db.EvaluationCategories.FindAsync(id);
        if (entity == null) return false;
        _db.EvaluationCategories.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }

    private static CategoryAdminDto MapToAdminDto(EvaluationCategory c) => new()
    {
        Id = c.Id, Name = c.Name, Description = c.Description, Icon = c.Icon,
        DisplayOrder = c.DisplayOrder, IsActive = c.IsActive,
        AllowComment = c.AllowComment, CommentLabel = c.CommentLabel,
        CommentRequired = c.CommentRequired,
        MinScore = c.MinScore, MaxScore = c.MaxScore, IsRequired = c.IsRequired,
        CreatedAt = c.CreatedAt, UpdatedAt = c.UpdatedAt,
        CreatorName = c.Creator?.FullName
    };
}
