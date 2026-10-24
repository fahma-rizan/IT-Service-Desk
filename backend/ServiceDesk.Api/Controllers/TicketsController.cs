using System.Linq.Expressions;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceDesk.Api.Authorization;
using ServiceDesk.Api.Data;
using ServiceDesk.Api.DTOs;
using ServiceDesk.Api.Models;

namespace ServiceDesk.Api.Controllers;

[ApiController]
[Route("api/tickets")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public TicketsController(ApplicationDbContext db) => _db = db;

    private static readonly Expression<Func<Ticket, TicketResponse>> ToResponse = t =>
        new TicketResponse(
            t.Id,
            t.Title,
            t.Description,
            t.Type,
            t.Priority,
            t.Status,
            t.CategoryId,
            t.Category.Name,
            t.CreatedById,
            t.CreatedBy.FullName,
            t.Assignee != null ? t.Assignee.FullName : null,
            t.CreatedAt,
            t.UpdatedAt);

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpPost]
    public async Task<ActionResult<TicketResponse>> Create(CreateTicketRequest request)
    {
        if (!await _db.Categories.AnyAsync(c => c.Id == request.CategoryId))
        {
            ModelState.AddModelError(nameof(request.CategoryId), "Category does not exist.");
            return ValidationProblem(ModelState);
        }

        var now = DateTime.UtcNow;
        var ticket = new Ticket
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Type = request.Type,
            Priority = request.Priority,
            CategoryId = request.CategoryId,
            CreatedById = CurrentUserId,
            Status = TicketStatus.Open,
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();

        var created = await _db.Tickets
            .AsNoTracking()
            .Where(t => t.Id == ticket.Id)
            .Select(ToResponse)
            .SingleAsync();

        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, created);
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<TicketResponse>>> My(
        [FromQuery] string? search,
        [FromQuery] TicketStatus? status)
    {
        var userId = CurrentUserId;
        var query = _db.Tickets.AsNoTracking().Where(t => t.CreatedById == userId);

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(t => t.Title.Contains(term) || t.Description.Contains(term));
        }

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(ToResponse)
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TicketResponse>> GetById(int id)
    {
        var userId = CurrentUserId;
        var isStaff = User.IsInRole(AppRoles.Technician) || User.IsInRole(AppRoles.Admin);

        var ticket = await _db.Tickets
            .AsNoTracking()
            .Where(t => t.Id == id && (isStaff || t.CreatedById == userId))
            .Select(ToResponse)
            .SingleOrDefaultAsync();

        if (ticket is null)
        {
            return NotFound();
        }

        return ticket;
    }
}