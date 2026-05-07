using Microsoft.AspNetCore.Mvc;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;

namespace ServiceQuality.API.Controllers;

/// <summary>
/// Gửi đánh giá — Public API cho Flutter App (không cần auth)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EvaluationsController : ControllerBase
{
    private readonly IEvaluationService _service;
    public EvaluationsController(IEvaluationService service) => _service = service;

    /// <summary>Flutter App submit đánh giá</summary>
    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitEvaluationDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });

        if (dto.Items == null || !dto.Items.Any())
            return BadRequest(new { success = false, message = "Vui lòng đánh giá ít nhất một tiêu chí" });

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _service.SubmitAsync(dto, ipAddress);
        return Ok(new { success = true, data = result });
    }
}

/// <summary>
/// App-wide config — Public API cho Flutter App
/// </summary>
[ApiController]
[Route("api/app-config")]
public class AppConfigController : ControllerBase
{
    private readonly IAppConfigService _service;
    public AppConfigController(IAppConfigService service) => _service = service;

    /// <summary>Flutter App lấy cấu hình (welcome text, timeout, màu sắc...)</summary>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetAppConfigAsync();
        return Ok(new { success = true, data = result });
    }
}
