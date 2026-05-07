using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using ServiceQuality.Application.DTOs;
using ServiceQuality.Application.Interfaces;
using ServiceQuality.Infrastructure.Data;

namespace ServiceQuality.Infrastructure.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _db;
    public ReportService(AppDbContext db) => _db = db;

    public async Task<byte[]> ExportEvaluationsToExcelAsync(EvaluationFilterDto filter)
    {
        var query = _db.EvaluationSessions
            .Include(s => s.Items)
            .AsQueryable();

        if (filter.FromDate.HasValue)
            query = query.Where(s => s.SubmittedAt >= filter.FromDate.Value.ToUniversalTime());
        if (filter.ToDate.HasValue)
            query = query.Where(s => s.SubmittedAt <= filter.ToDate.Value.ToUniversalTime());
        if (filter.MinScore.HasValue)
            query = query.Where(s => s.TotalScore >= filter.MinScore.Value);
        if (filter.MaxScore.HasValue)
            query = query.Where(s => s.TotalScore <= filter.MaxScore.Value);

        var sessions = await query.OrderByDescending(s => s.SubmittedAt).ToListAsync();

        // Lấy danh sách tiêu chí để làm cột
        var categories = await _db.EvaluationCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Đánh Giá Dịch Vụ");

        // ---- HEADER ----
        var headerRow = 1;
        var headers = new List<string>
        {
            "STT", "Mã Phiên", "Thời Gian", "Thiết Bị", "Điểm TB", "Bình Luận Chung"
        };
        foreach (var cat in categories) headers.Add(cat.Name);
        foreach (var cat in categories) headers.Add($"Bình luận - {cat.Name}");

        for (int i = 0; i < headers.Count; i++)
        {
            var cell = ws.Cell(headerRow, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#1976D2");
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // ---- DATA ROWS ----
        for (int rowIdx = 0; rowIdx < sessions.Count; rowIdx++)
        {
            var session = sessions[rowIdx];
            var row = rowIdx + 2;
            var col = 1;

            ws.Cell(row, col++).Value = rowIdx + 1;
            ws.Cell(row, col++).Value = session.SessionCode[..8] + "...";
            ws.Cell(row, col++).Value = session.SubmittedAt.ToLocalTime().ToString("dd/MM/yyyy HH:mm");
            ws.Cell(row, col++).Value = session.DevicePlatform ?? "-";
            ws.Cell(row, col++).Value = session.TotalScore.HasValue ? (double)session.TotalScore.Value : 0;
            ws.Cell(row, col++).Value = session.GeneralComment ?? string.Empty;

            // Điểm từng tiêu chí
            foreach (var cat in categories)
            {
                var item = session.Items.FirstOrDefault(i => i.CategoryId == cat.Id);
                ws.Cell(row, col++).Value = item?.Score ?? 0;
            }
            // Bình luận từng tiêu chí
            foreach (var cat in categories)
            {
                var item = session.Items.FirstOrDefault(i => i.CategoryId == cat.Id);
                ws.Cell(row, col++).Value = item?.Comment ?? string.Empty;
            }

            // Màu xen kẽ
            if (rowIdx % 2 == 1)
            {
                ws.Row(row).Cells(1, headers.Count).Style.Fill.BackgroundColor = XLColor.FromHtml("#F5F5F5");
            }
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}
