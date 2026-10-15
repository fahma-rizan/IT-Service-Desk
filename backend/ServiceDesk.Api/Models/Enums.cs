namespace ServiceDesk.Api.Models;

public enum TicketType
{
    Incident,
    ServiceRequest
}

public enum TicketPriority
{
    Low,
    Medium,
    High,
    Critical
}

public enum TicketStatus
{
    Open,
    Assigned,
    InProgress,
    Resolved,
    Closed
}