using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;
using ToDoApi.Models;
using ToDoApi.Services;

namespace TodoApi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [EnableCors("AllowSpecificOrigin")]
  public class TodoController(TodoService todoService) : ControllerBase
  {
    private readonly TodoService _todoService = todoService;

    // GET: api/Todo
    [HttpGet]
    public async Task<IActionResult> GetAllTodos([FromQuery] SearchParams searchParams)
    {
      var todos = await _todoService.GetAllTodosAsync(searchParams);
      var todoStats = await _todoService.GetToDoStatsAsync();

      return Ok(new { todos, todoStats });
    }

    // GET: api/Todo/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTodoById(int id)
    {
      var todo = await _todoService.GetTodoByIdAsync(id);
      return Ok(todo);
    }

    // Additional endpoints (POST, PUT, DELETE) go here, using the _todoService methods.

    // POST: api/Todo
    [HttpPost]
    public async Task<IActionResult> CreateTodoAsync(TodoItem todo)
    {
      if (todo.ParentToDoId != null)
      {
        var subTasks = await _todoService.GetSubTasksCountAsync(todo.ParentToDoId.Value);
        if (subTasks > 1)
        {
          return BadRequest("A parent task can have only two subtasks");
        }
      }

      await _todoService.CreateTodoAsync(todo);
      return Ok();
    }

    // PUT: api/Todo/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodoAsync(string id, TodoItem todo)

    {
      try
      {
        await _todoService.UpdateTodoAsync(id, todo);


        // if the parent task is marked as completed and it has subtasks, update the subtasks as completed as well
        if (todo.ParentToDoId == null && todo.IsComplete)
        {
          var subTasks = await _todoService.GetSubTasksCountAsync(todo.Id);
          if (subTasks > 0)
          {
            await _todoService.UpdateSubTasksCompleteAsync(todo.Id, true);
          }
        }

        // if task is marked as completed, update the parent task as completed as well, if all subtasks are completed
        if (todo.ParentToDoId != null && todo.IsComplete)
        {
          var subTasks = await _todoService.GetSubTasksAsync(todo.ParentToDoId.Value);
          var allSubTasksCompleted = false;
          foreach (var subTask in subTasks)
          {
            if (!subTask.IsComplete)
            {
              allSubTasksCompleted = false;
              break;
            }
            allSubTasksCompleted = true;
          }
          if (allSubTasksCompleted)
          {
            await _todoService.UpdateParentTaskCompleteAsync(todo.ParentToDoId.Value, true);
          }

        }
      }
      catch (System.Exception ex)
      {
        return BadRequest(ex.Message);
      }

      return Ok();
    }

    // DELETE: api/Todo/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoAsync(string id)
    {
      await _todoService.DeleteTodoAsync(id);
      return Ok();
    }
  }
}
