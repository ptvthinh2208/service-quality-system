using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ServiceQuality.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AdminUsers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FullName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(191)", maxLength: 191, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminUsers", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AppConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ConfigKey = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ConfigValue = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppConfigs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EvaluationSessions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SessionCode = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DeviceId = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DevicePlatform = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AppVersion = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IpAddress = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GeneralComment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TotalScore = table.Column<decimal>(type: "decimal(5,2)", precision: 5, scale: 2, nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ConfigSnapshot = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluationSessions", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EvaluationCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Icon = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    AllowComment = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    CommentLabel = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CommentRequired = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    MinScore = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    MaxScore = table.Column<int>(type: "int", nullable: false, defaultValue: 5),
                    IsRequired = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluationCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluationCategories_AdminUsers_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "AdminUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EvaluationItems",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SessionId = table.Column<long>(type: "bigint", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    CategoryName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Score = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluationItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EvaluationItems_EvaluationCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "EvaluationCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EvaluationItems_EvaluationSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "EvaluationSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AdminUsers",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "LastLogin", "Password", "Role", "UpdatedAt", "Username" },
                values: new object[] { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@atlink.asia", "Super Administrator", true, null, "$2a$11$xJ3Y9z8K.mNpQ2vR7wL4guHdE5fT1oUiA6kC9bX0nWsM3qDrPyZeO", "SuperAdmin", null, "admin" });

            migrationBuilder.InsertData(
                table: "AppConfigs",
                columns: new[] { "Id", "ConfigKey", "ConfigValue", "CreatedAt", "Description", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "welcome_title", "Đánh Giá Chất Lượng Dịch Vụ", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tiêu đề màn hình chào", null },
                    { 2, "welcome_subtitle", "Xin chào! Hãy chia sẻ trải nghiệm của bạn với chúng tôi.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Phụ đề màn hình chào", null },
                    { 3, "thankyou_message", "Cảm ơn bạn đã đánh giá! Chúng tôi sẽ cải thiện dịch vụ tốt hơn.", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thông điệp cảm ơn", null },
                    { 4, "reset_timeout_seconds", "10", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Thời gian tự reset app về màn hình chào (giây)", null },
                    { 5, "primary_color", "#1976D2", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Màu chủ đạo của app", null }
                });

            migrationBuilder.InsertData(
                table: "EvaluationCategories",
                columns: new[] { "Id", "AllowComment", "CommentLabel", "CreatedAt", "CreatedBy", "Description", "DisplayOrder", "Icon", "IsActive", "IsRequired", "MaxScore", "MinScore", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, true, "Bạn muốn chia sẻ thêm điều gì?", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Nhân viên có thân thiện và nhiệt tình phục vụ?", 1, "👤", true, true, 5, 1, "Thái độ nhân viên", null },
                    { 2, true, "Sản phẩm bạn sử dụng hôm nay là gì?", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Sản phẩm có đạt chất lượng như kỳ vọng của bạn?", 2, "⭐", true, true, 5, 1, "Chất lượng sản phẩm", null }
                });

            migrationBuilder.InsertData(
                table: "EvaluationCategories",
                columns: new[] { "Id", "CommentLabel", "CreatedAt", "CreatedBy", "Description", "DisplayOrder", "Icon", "IsActive", "IsRequired", "MaxScore", "MinScore", "Name", "UpdatedAt" },
                values: new object[] { 3, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Không gian cửa hàng có sạch sẽ và thoải mái?", 3, "🏬", true, true, 5, 1, "Không gian & Môi trường", null });

            migrationBuilder.CreateIndex(
                name: "IX_AdminUsers_Email",
                table: "AdminUsers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AdminUsers_Username",
                table: "AdminUsers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppConfigs_ConfigKey",
                table: "AppConfigs",
                column: "ConfigKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationCategories_CreatedBy",
                table: "EvaluationCategories",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationCategories_DisplayOrder_IsActive",
                table: "EvaluationCategories",
                columns: new[] { "DisplayOrder", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationItems_CategoryId",
                table: "EvaluationItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationItems_Score",
                table: "EvaluationItems",
                column: "Score");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationItems_SessionId",
                table: "EvaluationItems",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationSessions_DeviceId",
                table: "EvaluationSessions",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationSessions_SessionCode",
                table: "EvaluationSessions",
                column: "SessionCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EvaluationSessions_SubmittedAt",
                table: "EvaluationSessions",
                column: "SubmittedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppConfigs");

            migrationBuilder.DropTable(
                name: "EvaluationItems");

            migrationBuilder.DropTable(
                name: "EvaluationCategories");

            migrationBuilder.DropTable(
                name: "EvaluationSessions");

            migrationBuilder.DropTable(
                name: "AdminUsers");
        }
    }
}
