using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceDesk.Api.Authorization;
using ServiceDesk.Api.Models;

namespace ServiceDesk.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var db = services.GetRequiredService<ApplicationDbContext>();

        foreach (var role in AppRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Name = "Hardware", Description = "Laptops, desktops, monitors and other devices" },
                new Category { Name = "Software", Description = "Application errors, installs and licences" },
                new Category { Name = "Network", Description = "Wi-Fi, VPN and connectivity problems" },
                new Category { Name = "Email", Description = "Mailbox and email client issues" },
                new Category { Name = "Account Access", Description = "Passwords, lockouts and permissions" },
                new Category { Name = "Printing", Description = "Printers and scanners" },
                new Category { Name = "Other", Description = "Anything that doesn't fit above" }
            );
            await db.SaveChangesAsync();
        }
    }
}