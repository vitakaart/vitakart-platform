using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PaymentStatus = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PaymentMethod = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Subtotal = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    TotalDiscount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    ShippingFee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    TaxAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Total = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CouponCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CouponDiscount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    ShippingFullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ShippingPhone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    ShippingAddressLine1 = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ShippingAddressLine2 = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ShippingLandmark = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ShippingCity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ShippingState = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ShippingPincode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    ShippingCountry = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PaymentTransactionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PaymentGatewayOrderId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PaymentSignature = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CustomerNotes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CancellationReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CancelledBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConfirmedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProcessingAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ShippedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeliveredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExpectedDeliveryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TrackingNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CourierPartner = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IdempotencyKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ProductSlug = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ProductImage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ProductBrand = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ProductSku = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    UnitPrice = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    DiscountPrice = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    EffectivePrice = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    SavedAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_TenantId_ProductId",
                table: "OrderItems",
                columns: new[] { "TenantId", "ProductId" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CreatedAt",
                table: "Orders",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TenantId_PaymentStatus",
                table: "Orders",
                columns: new[] { "TenantId", "PaymentStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TenantId_Status",
                table: "Orders",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TenantId_UserId",
                table: "Orders",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId_IdempotencyKey",
                table: "Orders",
                columns: new[] { "UserId", "IdempotencyKey" },
                unique: true,
                filter: "\"IdempotencyKey\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}
