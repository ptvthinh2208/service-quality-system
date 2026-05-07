namespace ServiceQuality.Application.DTOs;

// ---- CATEGORY DTOs ----

/// <summary>DTO trả về cho Flutter App — render form động</summary>
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool AllowComment { get; set; }
    public string? CommentLabel { get; set; }
    public bool CommentRequired { get; set; }
    public int MinScore { get; set; }
    public int MaxScore { get; set; }
    public bool IsRequired { get; set; }
}

/// <summary>DTO Admin tạo tiêu chí mới</summary>
public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public bool AllowComment { get; set; } = true;
    public string? CommentLabel { get; set; } = "Chia sẻ thêm ý kiến của bạn...";
    public bool CommentRequired { get; set; } = false;
    public int MinScore { get; set; } = 1;
    public int MaxScore { get; set; } = 5;
    public bool IsRequired { get; set; } = true;
}

/// <summary>DTO Admin sửa tiêu chí</summary>
public class UpdateCategoryDto : CreateCategoryDto { }

/// <summary>DTO đổi thứ tự nhiều tiêu chí (drag & drop)</summary>
public class ReorderCategoriesDto
{
    /// <summary>Danh sách { Id, DisplayOrder } mới</summary>
    public List<CategoryOrderItem> Items { get; set; } = [];
}

public class CategoryOrderItem
{
    public int Id { get; set; }
    public int DisplayOrder { get; set; }
}

/// <summary>DTO Admin view — bao gồm IsActive</summary>
public class CategoryAdminDto : CategoryDto
{
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatorName { get; set; }
}
