using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NorthwindBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            // migrationBuilder.CreateTable(
            //     name: "Categories",
            //     columns: table => new
            //     {
            //         CategoryId = table.Column<int>(type: "int", nullable: false)
            //             .Annotation("SqlServer:Identity", "1, 1"),
            //         CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Categories", x => x.CategoryId);
            //     });
            //
            // migrationBuilder.CreateTable(
            //     name: "Customers",
            //     columns: table => new
            //     {
            //         CustomerId = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
            //         CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         ContactName = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ContactTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         City = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Region = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Fax = table.Column<string>(type: "nvarchar(max)", nullable: true)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Customers", x => x.CustomerId);
            //     });
            //
            // migrationBuilder.CreateTable(
            //     name: "Suppliers",
            //     columns: table => new
            //     {
            //         SupplierId = table.Column<int>(type: "int", nullable: false)
            //             .Annotation("SqlServer:Identity", "1, 1"),
            //         CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         ContactName = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ContactTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         City = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Region = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         PostalCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         Fax = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         HomePage = table.Column<string>(type: "nvarchar(max)", nullable: true)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Suppliers", x => x.SupplierId);
            //     });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // migrationBuilder.CreateTable(
            //     name: "Orders",
            //     columns: table => new
            //     {
            //         OrderId = table.Column<int>(type: "int", nullable: false)
            //             .Annotation("SqlServer:Identity", "1, 1"),
            //         CustomerId = table.Column<string>(type: "nvarchar(5)", nullable: false),
            //         EmployeeId = table.Column<int>(type: "int", nullable: true),
            //         OrderDate = table.Column<DateTime>(type: "datetime2", nullable: true),
            //         RequiredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
            //         ShippedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
            //         ShipVia = table.Column<int>(type: "int", nullable: true),
            //         Freight = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
            //         ShipName = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ShipAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ShipCity = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ShipRegion = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ShipPostalCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
            //         ShipCountry = table.Column<string>(type: "nvarchar(max)", nullable: true)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Orders", x => x.OrderId);
            //         table.ForeignKey(
            //             name: "FK_Orders_Customers_CustomerId",
            //             column: x => x.CustomerId,
            //             principalTable: "Customers",
            //             principalColumn: "CustomerId",
            //             onDelete: ReferentialAction.Cascade);
            //     });
            //
            // migrationBuilder.CreateTable(
            //     name: "Products",
            //     columns: table => new
            //     {
            //         ProductId = table.Column<int>(type: "int", nullable: false)
            //             .Annotation("SqlServer:Identity", "1, 1"),
            //         ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         SupplierId = table.Column<int>(type: "int", nullable: true),
            //         CategoryId = table.Column<int>(type: "int", nullable: true),
            //         UnitPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
            //         UnitsInStock = table.Column<short>(type: "smallint", nullable: true),
            //         UnitsOnOrder = table.Column<short>(type: "smallint", nullable: true),
            //         ReorderLevel = table.Column<short>(type: "smallint", nullable: true),
            //         Discontinued = table.Column<bool>(type: "bit", nullable: false)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Products", x => x.ProductId);
            //         table.ForeignKey(
            //             name: "FK_Products_Categories_CategoryId",
            //             column: x => x.CategoryId,
            //             principalTable: "Categories",
            //             principalColumn: "CategoryId",
            //             onDelete: ReferentialAction.Restrict);
            //         table.ForeignKey(
            //             name: "FK_Products_Suppliers_SupplierId",
            //             column: x => x.SupplierId,
            //             principalTable: "Suppliers",
            //             principalColumn: "SupplierId",
            //             onDelete: ReferentialAction.Restrict);
            //     });
            //
            // migrationBuilder.CreateTable(
            //     name: "Order Details",
            //     columns: table => new
            //     {
            //         OrderId = table.Column<int>(type: "int", nullable: false),
            //         ProductId = table.Column<int>(type: "int", nullable: false),
            //         UnitPrice = table.Column<decimal>(type: "money", nullable: true),
            //         Quantity = table.Column<short>(type: "smallint", nullable: true),
            //         Discount = table.Column<float>(type: "real", nullable: true)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_Order Details", x => new { x.OrderId, x.ProductId });
            //         table.ForeignKey(
            //             name: "FK_Order Details_Orders_OrderId",
            //             column: x => x.OrderId,
            //             principalTable: "Orders",
            //             principalColumn: "OrderId",
            //             onDelete: ReferentialAction.Cascade);
            //         table.ForeignKey(
            //             name: "FK_Order Details_Products_ProductId",
            //             column: x => x.ProductId,
            //             principalTable: "Products",
            //             principalColumn: "ProductId",
            //             onDelete: ReferentialAction.Cascade);
            //     });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Order Details_ProductId",
                table: "Order Details",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_SupplierId",
                table: "Products",
                column: "SupplierId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            // migrationBuilder.DropTable(
            //     name: "Order Details");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            // migrationBuilder.DropTable(
            //     name: "Orders");
            //
            // migrationBuilder.DropTable(
            //     name: "Products");
            //
            // migrationBuilder.DropTable(
            //     name: "Customers");
            //
            // migrationBuilder.DropTable(
            //     name: "Categories");
            //
            // migrationBuilder.DropTable(
            //     name: "Suppliers");
        }
    }
}
