using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ToDoApi.Models;

namespace ToDoApi.Services
{
  public class TodoService(string connectionString)
  {
    private readonly string _connectionString = connectionString;

    public async Task<List<TodoItem>> GetAllTodosAsync(SearchParams searchParams)
    {
      var todos = new List<TodoItem>();

      using (var connection = new NpgsqlConnection(_connectionString))
      {
        await connection.OpenAsync();
        string sqlQuery = @"
        SELECT
            p.id,
            p.task,
            p.deadline_date,
            p.is_complete,
            p.more_details,
            p.parent_todo_id,
            p.created_at,
            p.updated_at,
            json_agg(json_build_object(
                'Id', c.id,
                'Task', c.task,
                'DeadlineDate', c.deadline_date,
                'IsComplete', c.is_complete,
                'MoreDetails', c.more_details,
                'ParentToDoId', c.parent_todo_id,
                'CreatedAt', c.created_at,
                'UpdatedAt', c.updated_at
            )) FILTER (WHERE c.id IS NOT NULL) AS children
        FROM
            tasks.todos p
        LEFT JOIN
            tasks.todos c ON p.id = c.parent_todo_id
            WHERE
            p.parent_todo_id IS NULL";

        var sqlQueryBuilder = new StringBuilder(sqlQuery);
        if (!string.IsNullOrEmpty(searchParams.FullTextSearch))
        {
          sqlQueryBuilder.Append(" AND p.task ILIKE @FullTextSearch OR p.more_details ILIKE @FullTextSearch OR c.task ILIKE @FullTextSearch OR c.more_details ILIKE @FullTextSearch");
        }

        sqlQueryBuilder.Append(" GROUP BY p.id ORDER BY p.created_at DESC OFFSET @Offset LIMIT @Limit ;");
        sqlQuery = sqlQueryBuilder.ToString();

        using var command = new NpgsqlCommand(sqlQuery, connection);
        command.Parameters.AddWithValue("Offset", searchParams.Offset);
        command.Parameters.AddWithValue("Limit", searchParams.Limit);
        if (searchParams.FullTextSearch != null)
        {
          command.Parameters.AddWithValue("FullTextSearch", $"%{searchParams.FullTextSearch}%");
        }

        using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
          todos.Add(new TodoItem
          {
            Id = reader.GetGuid(reader.GetOrdinal("id")),
            Task = reader.GetString(reader.GetOrdinal("task")),
            DeadlineDate = reader.GetDateTime(reader.GetOrdinal("deadline_date")),
            IsComplete = reader.GetBoolean(reader.GetOrdinal("is_complete")),
            MoreDetails = reader.IsDBNull(reader.GetOrdinal("more_details")) ? null : reader.GetString(reader.GetOrdinal("more_details")),
            ParentToDoId = reader.IsDBNull(reader.GetOrdinal("parent_todo_id")) ? null : reader.GetGuid(reader.GetOrdinal("parent_todo_id")),
            Children = reader.IsDBNull(reader.GetOrdinal("children")) ? null : JsonSerializer.Deserialize<List<TodoItem>>(reader.GetString(reader.GetOrdinal("children"))),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
            UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at")),
          });
        }
      }

      return todos;
    }

    public async Task<TodoStats> GetToDoStatsAsync()
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = @"SELECT
        COUNT(*) AS total_tasks,
        COUNT(CASE WHEN is_complete THEN 1 END) AS total_completed,
        COUNT(CASE WHEN deadline_date < CURRENT_DATE AND NOT is_complete THEN 1 END) AS total_past_due
      FROM
        tasks.todos;
      ";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      using var reader = await command.ExecuteReaderAsync();
      await reader.ReadAsync();
      var totalTodos = reader.GetInt32(reader.GetOrdinal("total_tasks"));
      var completedTodos = reader.GetInt32(reader.GetOrdinal("total_completed"));
      var totalPastDue = reader.GetInt32(reader.GetOrdinal("total_past_due"));

      return new TodoStats
      {
        TotalTodos = totalTodos,
        CompletedTodos = completedTodos,
        TotalPastDue = totalPastDue
      };
    }

    public async Task<TodoItem> GetTodoByIdAsync(int id)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = "SELECT * FROM todos WHERE Id = @Id";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      command.Parameters.AddWithValue("Id", id);
      using var reader = await command.ExecuteReaderAsync();
      await reader.ReadAsync();
      return new TodoItem
      {
        Id = reader.GetGuid(reader.GetOrdinal("uuid")),
        Task = reader.GetString(reader.GetOrdinal("task")),
        DeadlineDate = reader.GetDateTime(reader.GetOrdinal("deadline_date")),
        IsComplete = reader.GetBoolean(reader.GetOrdinal("is_complete")),
        MoreDetails = reader.IsDBNull(reader.GetOrdinal("more_details")) ? null : reader.GetString(reader.GetOrdinal("more_details")),
        ParentToDoId = reader.IsDBNull(reader.GetOrdinal("parent_todo_id")) ? null : reader.GetGuid(reader.GetOrdinal("parent_todo_id"))
      };
    }

    // Implement Create, Update, Delete methods similarly, using SQL commands and Npgsql.

    public async Task CreateTodoAsync(TodoItem todo)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = "INSERT INTO tasks.todos (task, deadline_date, is_complete, more_details, parent_todo_id) VALUES (@task, @deadline_date, @is_complete, @more_details, @parent_todo_id)";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      command.Parameters.AddWithValue("task", todo.Task);
      command.Parameters.AddWithValue("deadline_date", todo.DeadlineDate);
      command.Parameters.AddWithValue("is_complete", todo.IsComplete);
      command.Parameters.AddWithValue("more_details", todo.MoreDetails == null ? DBNull.Value : todo.MoreDetails);
      // command.Parameters.AddWithValue("parent_todo_id", todo.ParentToDoId == null ? DBNull.Value : todo.ParentToDoId);
      if (todo.ParentToDoId == null)
      {
        command.Parameters.AddWithValue("parent_todo_id", DBNull.Value);
      }
      else
      {
        // Explicitly specify the parameter type as UUID
        var parentTodoIdParam = new NpgsqlParameter("parent_todo_id", NpgsqlTypes.NpgsqlDbType.Uuid)
        {
          Value = todo.ParentToDoId // Convert the string ID to a Guid
        };
        command.Parameters.Add(parentTodoIdParam);
      }
      await command.ExecuteNonQueryAsync();
    }

    public async Task<long> GetSubTasksCountAsync(Guid id)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = "SELECT COUNT(*) FROM tasks.todos WHERE parent_todo_id = @id";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      command.Parameters.AddWithValue("id", id);
      var count = Convert.ToInt64(await command.ExecuteScalarAsync());
      return count;
    }

    public async Task<List<TodoItem>> GetSubTasksAsync(Guid id)
    {
      var todos = new List<TodoItem>();
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = @"SELECT id,
            task,
            deadline_date,
            is_complete,
            more_details,
            parent_todo_id,
            created_at,
            updated_at FROM tasks.todos WHERE parent_todo_id = @id";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      command.Parameters.AddWithValue("id", id);

      using var reader = await command.ExecuteReaderAsync();
      while (await reader.ReadAsync())
      {
        todos.Add(new TodoItem
        {
          Id = reader.GetGuid(reader.GetOrdinal("id")),
          Task = reader.GetString(reader.GetOrdinal("task")),
          DeadlineDate = reader.GetDateTime(reader.GetOrdinal("deadline_date")),
          IsComplete = reader.GetBoolean(reader.GetOrdinal("is_complete")),
          MoreDetails = reader.IsDBNull(reader.GetOrdinal("more_details")) ? null : reader.GetString(reader.GetOrdinal("more_details")),
          ParentToDoId = reader.IsDBNull(reader.GetOrdinal("parent_todo_id")) ? null : reader.GetGuid(reader.GetOrdinal("parent_todo_id")),
          CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at")),
          UpdatedAt = reader.GetDateTime(reader.GetOrdinal("updated_at")),
        });
      }
      return todos;
    }

    public async Task UpdateSubTasksCompleteAsync(Guid id, bool isComplete)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = "UPDATE tasks.todos SET is_complete = @is_complete WHERE parent_todo_id = @id";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      command.Parameters.AddWithValue("id", id);
      command.Parameters.AddWithValue("is_complete", isComplete);
      await command.ExecuteNonQueryAsync();
    }

    public async Task UpdateParentTaskCompleteAsync(Guid id, bool isComplete)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = "UPDATE tasks.todos SET is_complete = @is_complete WHERE id = @id";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      command.Parameters.AddWithValue("id", id);
      command.Parameters.AddWithValue("is_complete", isComplete);
      await command.ExecuteNonQueryAsync();
    }

    public async Task UpdateTodoAsync(string id, TodoItem todo)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      // I want the query to update the fields ONLY if they're passed in the request

      const string sqlQuery = "UPDATE tasks.todos SET task = @task, deadline_date = @deadline_date, is_complete = @is_complete, more_details = @more_details, parent_todo_id = @parent_todo_id WHERE id = @id";
      using var command = new NpgsqlCommand(sqlQuery, connection);
      var idParam = new NpgsqlParameter("id", NpgsqlTypes.NpgsqlDbType.Uuid)
      {
        Value = Guid.Parse(id) // Convert the string ID to a Guid
      };
      command.Parameters.Add(idParam);
      command.Parameters.AddWithValue("task", todo.Task);
      command.Parameters.AddWithValue("deadline_date", todo.DeadlineDate);
      command.Parameters.AddWithValue("is_complete", todo.IsComplete);
      command.Parameters.AddWithValue("more_details", todo.MoreDetails == null ? DBNull.Value : todo.MoreDetails);
      command.Parameters.AddWithValue("parent_todo_id", todo.ParentToDoId == null ? DBNull.Value : todo.ParentToDoId);
      await command.ExecuteNonQueryAsync();


      // const string sqlQuery = "UPDATE todos SET Task = @Task, DeadlineDate = @DeadlineDate, IsCompleted = @IsCompleted, MoreDetails = @MoreDetails, ParentToDoId = @ParentToDoId WHERE Id = @Id";
      // using var command = new NpgsqlCommand(sqlQuery, connection);
      // command.Parameters.AddWithValue("Id", id);
      // command.Parameters.AddWithValue("Task", todo.Task);
      // command.Parameters.AddWithValue("DeadlineDate", todo.DeadlineDate);
      // command.Parameters.AddWithValue("IsCompleted", todo.IsCompleted);
      // command.Parameters.AddWithValue("MoreDetails", todo.MoreDetails);
      // command.Parameters.AddWithValue("ParentToDoId", todo.ParentToDoId);
      // await command.ExecuteNonQueryAsync();
    }

    public async Task DeleteTodoAsync(string id)
    {
      using var connection = new NpgsqlConnection(_connectionString);
      await connection.OpenAsync();
      const string sqlQuery = "DELETE FROM tasks.todos WHERE id = @id";
      using var command = new NpgsqlCommand(sqlQuery, connection);

      // Explicitly specify the parameter type as UUID
      var idParam = new NpgsqlParameter("id", NpgsqlTypes.NpgsqlDbType.Uuid)
      {
        Value = Guid.Parse(id) // Convert the string ID to a Guid
      };
      command.Parameters.Add(idParam);

      await command.ExecuteNonQueryAsync();
    }

  }
}
