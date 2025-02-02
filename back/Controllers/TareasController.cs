using MangoDB.Context;
using MangoDB.DTO;
using MangoDB.Models;
using MangoDB.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MangoDB.Controllers
{
    [ApiController]
    [Route("api/tareas")]
    public class TareaController : ControllerBase
    {
        private readonly MangoDBcontext _context;
        private readonly UserService _authService;

        public TareaController(MangoDBcontext context, UserService authService)
        {
            _context = context;
            _authService = authService;
        }

        // Crear una nueva tarea
        [HttpPost]
        public async Task<IActionResult> CreateTarea([FromHeader(Name = "Authorization")] string token, [FromBody] TareaDTO request)
        {
            var user = await _authService.ValidateToken(token);
            if (user == null)
                return Unauthorized(new { message = "Token inválido" });

            var tarea = new Tarea
            {
                Id = Guid.NewGuid(),
                Titulo = request.Titulo,
                Descripcion = request.Descripcion,
                IdCreador = user.Id,
                Ubicacion = request.Ubicacion,
                FechaPublicacion = DateTime.UtcNow,
                HorarioDeseado = request.HorarioDeseado,
                FechaDeseada = request.FechaDeseada,
                DineroOfrecido = request.DineroOfrecido
            };

            _context.Tareas.Add(tarea);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tarea creada exitosamente", tarea.Id });
        }

        // Modificar una tarea existente
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTarea(Guid id, [FromBody] TareaDTO request)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null)
                return NotFound(new { message = "Tarea no encontrada" });

            tarea.Titulo = request.Titulo;
            tarea.Descripcion = request.Descripcion;
            tarea.Ubicacion = request.Ubicacion;
            tarea.HorarioDeseado = request.HorarioDeseado;
            tarea.FechaDeseada = request.FechaDeseada;
            tarea.DineroOfrecido = request.DineroOfrecido;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Tarea actualizada exitosamente" });
        }

        // Eliminar una tarea
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTarea(Guid id)
        {
            var tarea = await _context.Tareas.FindAsync(id);
            if (tarea == null)
                return NotFound(new { message = "Tarea no encontrada" });

            _context.Tareas.Remove(tarea);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Tarea eliminada exitosamente" });
        }

        // Listar tareas con filtros y cantidad de resultados
        [HttpGet]
        public async Task<IActionResult> GetTareas([FromQuery] GetTareasDTO filters)
        {
            var query = _context.Tareas
                .Include(t => t.Creador)
                .AsQueryable();

            if (filters.MinDinero.HasValue)
                query = query.Where(t => t.DineroOfrecido >= filters.MinDinero.Value);

            if (filters.MaxDinero.HasValue)
                query = query.Where(t => t.DineroOfrecido <= filters.MaxDinero.Value);

            if (filters.Cantidad.HasValue && filters.Cantidad > 0)
                query = query.Take(filters.Cantidad.Value);

            var tareas = await query
                .Select(t => new
                {
                    t.Id,
                    t.Titulo,
                    t.Descripcion,
                    t.IdCreador,
                    t.Ubicacion,
                    t.FechaPublicacion,
                    t.HorarioDeseado,
                    t.FechaDeseada,
                    t.DineroOfrecido,
                    Creador = new
                    {
                        t.Creador.Id,
                        t.Creador.FullName,
                        t.Creador.Email
                    }
                })
                .ToListAsync();

            return Ok(tareas);
        }


    }

}


