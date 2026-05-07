using ServiceQuality.Application.DTOs;

namespace ServiceQuality.Application.Interfaces;

public interface ICategoryService
{
    /// <summary>Lấy danh sách tiêu chí active cho Flutter App (đã sắp xếp theo DisplayOrder)</summary>
    Task<List<CategoryDto>> GetActiveCategoriesAsync();

    /// <summary>Lấy tất cả tiêu chí cho Admin (bao gồm inactive)</summary>
    Task<List<CategoryAdminDto>> GetAllCategoriesForAdminAsync();

    Task<CategoryAdminDto?> GetByIdAsync(int id);
    Task<CategoryAdminDto> CreateAsync(CreateCategoryDto dto, int createdBy);
    Task<CategoryAdminDto?> UpdateAsync(int id, UpdateCategoryDto dto);
    Task<bool> ToggleActiveAsync(int id);
    Task<bool> ReorderAsync(ReorderCategoriesDto dto);
    Task<bool> DeleteAsync(int id);
}
