using Microsoft.AspNetCore.Mvc;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;

namespace ServiceQuality.API.Controllers;

/// <summary>
/// Tiêu chí đánh giá — Public API cho Flutter App
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;
    public CategoriesController(ICategoryService service) => _service = service;

    /// <summary>Lấy danh sách tiêu chí đang active — Flutter App gọi để render form động</summary>
    [HttpGet]
    public async Task<IActionResult> GetActive()
    {
        var result = await _service.GetActiveCategoriesAsync();
        return Ok(new { success = true, data = result });
    }
}
