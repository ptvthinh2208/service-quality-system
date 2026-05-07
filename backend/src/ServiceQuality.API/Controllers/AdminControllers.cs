using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;
using System.Security.Claims;

namespace ServiceQuality.API.Controllers;

/// <summary>
/// Admin API — Quản lý tiêu chí đánh giá (JWT required)
/// </summary>
[Authorize]
[ApiController]
[Route("api/admin/categories")]
public class AdminCategoriesController : ControllerBase
{
    private readonly ICategoryService _service;
    public AdminCategoriesController(ICategoryService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllCategoriesForAdminAsync();
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(new { success = true, data = result });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var adminId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.CreateAsync(dto, adminId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, new { success = true, data = result });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return result == null ? NotFound() : Ok(new { success = true, data = result });
    }

    [HttpPatch("{id:int}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        var ok = await _service.ToggleActiveAsync(id);
        return ok ? Ok(new { success = true }) : NotFound();
    }

    [HttpPut("reorder")]
    public async Task<IActionResult> Reorder([FromBody] ReorderCategoriesDto dto)
    {
        await _service.ReorderAsync(dto);
        return Ok(new { success = true });
    }

    [Authorize(Roles = "SuperAdmin,Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? Ok(new { success = true }) : NotFound();
    }
}

/// <summary>
/// Admin API — Xem danh sách + chi tiết đánh giá
/// </summary>
[Authorize]
[ApiController]
[Route("api/admin/evaluations")]
public class AdminEvaluationsController : ControllerBase
{
    private readonly IEvaluationService _service;
    public AdminEvaluationsController(IEvaluationService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] EvaluationFilterDto filter)
    {
        var result = await _service.GetPagedAsync(filter);
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetDetail(long id)
    {
        var result = await _service.GetDetailAsync(id);
        return result == null ? NotFound() : Ok(new { success = true, data = result });
    }
}

/// <summary>
/// Admin API — Dashboard thống kê
/// </summary>
[Authorize]
[ApiController]
[Route("api/admin/dashboard")]
public class AdminDashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    public AdminDashboardController(IDashboardService service) => _service = service;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _service.GetStatsAsync();
        return Ok(new { success = true, data = result });
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends([FromQuery] int days = 30)
    {
        var result = await _service.GetDailyTrendsAsync(days);
        return Ok(new { success = true, data = result });
    }
}

/// <summary>
/// Admin API — Xuất báo cáo Excel
/// </summary>
[Authorize]
[ApiController]
[Route("api/admin/reports")]
public class AdminReportsController : ControllerBase
{
    private readonly IReportService _service;
    public AdminReportsController(IReportService service) => _service = service;

    [HttpGet("export")]
    public async Task<IActionResult> ExportExcel([FromQuery] EvaluationFilterDto filter)
    {
        var bytes = await _service.ExportEvaluationsToExcelAsync(filter);
        var fileName = $"DanhGia_DichVu_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}

/// <summary>
/// Auth Controller — Đăng nhập Admin
/// </summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;
    public AuthController(IAuthService service) => _service = service;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _service.LoginAsync(dto);
        if (result == null)
            return Unauthorized(new { success = false, message = "Tên đăng nhập hoặc mật khẩu không đúng" });
        return Ok(new { success = true, data = result });
    }
}
