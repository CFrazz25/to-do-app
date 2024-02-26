using System.ComponentModel.DataAnnotations;

namespace ToDoApi.Models
{
  public class TodoItem
  {
    [Key]
    public Guid Id { get; set; }
    public required string Task { get; set; }
    public required DateTime DeadlineDate { get; set; }
    public bool IsComplete { get; set; }
    public string? MoreDetails { get; set; }
    public Guid? ParentToDoId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<TodoItem>? Children { get; set; }

  }

  public class SearchParams
  {
    public int Offset { get; set; } = 0; // Default value
    public int Limit { get; set; } = 10000; // Default value or maximum limit - set this back to 10 or 100 once we implement pagination on the frontend
    public string FullTextSearch { get; set; } = string.Empty;
    public bool? IsComplete { get; set; } = null; // Default value
    public string SortBy { get; set; } = "created_at"; // Default value
    public string SortDirection { get; set; } = "DESC"; // Default value
    // Add other search parameters as needed

    // You can also include default values or validation attributes if necessary
  }

  public class TodoStats
  {
    public int TotalTodos { get; set; }
    public int CompletedTodos { get; set; }
    public int TotalPastDue { get; set; }
  }
}


