using ServiceQuality.Application.DTOs;

namespace ServiceQuality.Application.Interfaces;

public interface IEvaluationService
{
    /// <summary>Flutter App submit đánh giá</summary>
    Task<SubmitEvaluationResponseDto> SubmitAsync(SubmitEvaluationDto dto, string? ipAddress);

    /// <summary>Admin lấy danh sách đánh giá (có filter + phân trang)</summary>
    Task<PagedResult<EvaluationSessionListDto>> GetPagedAsync(EvaluationFilterDto filter);

    /// <summary>Admin xem chi tiết một phiên đánh giá</summary>
    Task<EvaluationSessionDetailDto?> GetDetailAsync(long id);
}
