using System.ComponentModel.DataAnnotations;
using ServiceDesk.Api.Models;

namespace ServiceDesk.Api.DTOs;

public class CreateTicketRequest
{
    [Required, StringLength(200, MinimumLength = 5)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(4000, MinimumLength = 10)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    public TicketType Type { get; set; } = TicketType.Incident;
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;
}

public record CategoryResponse(int Id, string Name, string? Description);

public record TicketResponse(
    int Id,
    string Title,
    string Description,
    TicketType Type,
    TicketPriority Priority,
    TicketStatus Status,
    int CategoryId,
    string CategoryName,
    string CreatedById,
    string CreatedByName,
    string? AssigneeName,
    DateTime CreatedAt,
    DateTime UpdatedAt);