namespace ServiceDesk.Api.Authorization;

public static class AppRoles
{
    public const string Employee = "Employee";
    public const string Technician = "Technician";
    public const string Admin = "Admin";

    public static readonly string[] All = { Employee, Technician, Admin };
}