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
        private readonly UserService _userService;

        public TareaController(MangoDBcontext context, UserService authService)
        {
            _context = context;
            _userService = authService;
        }

        // Crear una nueva tarea
        [HttpPost]
        public async Task<IActionResult> CreateTarea([FromHeader(Name = "Authorization")] string token, [FromBody] ParamsCreateTareasDTO request)
        {
            var user = await _userService.ValidateToken(token);
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
                DineroOfrecido = request.DineroOfrecido,
                //isGoogleUser = user.isGoogleUser
            };

            _context.Tareas.Add(tarea);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Tarea creada exitosamente", tarea.Id });
        }

        // Modificar una tarea existente
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTarea(Guid id, [FromBody] ParamsCreateTareasDTO request)
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

        [HttpGet]
        public async Task<IActionResult> GetTareas([FromQuery] ParamsGetTareasDTO filters)
        {
            var query = _context.Tareas
                .Include(t => t.Creador)
                .Include(t => t.Ofertas) // 🔹 Incluir la relación con Ofertas
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
                        t.Creador.Nombre,
                        t.Creador.Apellido,
                        t.Creador.Email,
                        t.Creador.isGoogleUser,
                        t.Creador.ProfilePictureUrl
                    },
                    CantidadOfertas = t.Ofertas.Count // 🔹 Se agrega el contador de ofertas
                })
                .ToListAsync();

            return Ok(tareas);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserTareas([FromHeader(Name = "Authorization")] string token)
        {
            var user = await _userService.ValidateToken(token);
            if (user == null)
            {
                return Unauthorized(new { message = "Token inválido" });
            }

            var tareas = await _context.Tareas
                .Where(t => t.IdCreador == user.Id)
                .Select(t => new
                {
                    t.Id,
                    t.Titulo,
                    t.Descripcion,
                    t.Ubicacion,
                    t.FechaPublicacion,
                    t.HorarioDeseado,
                    t.FechaDeseada,
                    t.DineroOfrecido,
                    CantidadOfertas = t.Ofertas.Count
                })
                .ToListAsync();

            if (tareas == null || tareas.Count == 0)
            {
                return NotFound(new { message = "No se encontraron tareas para este usuario." });
            }
            else
            {
                return Ok(tareas);
            }
        }

        [HttpGet("{idTarea}/ofertas")]
        public async Task<IActionResult> ObtenerTareaConOfertas(Guid idTarea)
        {
            var tarea = await _context.Tareas
                .Include(t => t.Creador)
                .Include(t => t.Ofertas)
                .ThenInclude(o => o.CreadorOferta)
                .FirstOrDefaultAsync(t => t.Id == idTarea);

            if (tarea == null)
                return NotFound(new { message = "Tarea no encontrada" });

            var resultado = new ResultTareaConOfertasDTO
            {
                Id = tarea.Id,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                Ubicacion = tarea.Ubicacion,
                HorarioDeseado = tarea.HorarioDeseado,
                FechaDeseada = tarea.FechaDeseada,
                DineroOfrecido = tarea.DineroOfrecido,
                FechaPublicacion = tarea.FechaPublicacion,
                Creador = new ResultGetUsuarioDTO
                {
                    Id = tarea.Creador.Id,
                    Nombre = tarea.Creador.Nombre,
                    Apellido = tarea.Creador.Apellido,
                    Email = tarea.Creador.Email,
                    ProfilePictureURL = tarea.Creador.ProfilePictureUrl ?? ""
                },
                Ofertas = tarea.Ofertas.Select(o => new OfertaDTO
                {
                    Id = o.Id,
                    MensajeOferta = o.MensajeOferta,
                    FechaCreacion = o.FechaCreacion,
                    Creador = new ResultGetUsuarioDTO
                    {
                        Id = o.CreadorOferta.Id,
                        Nombre = o.CreadorOferta.Nombre,
                        Apellido = o.CreadorOferta.Apellido,
                        Email = o.CreadorOferta.Email,
                        ProfilePictureURL = o.CreadorOferta.ProfilePictureUrl ?? ""
                    }
                }).ToList()
            };

            return Ok(resultado);
        }
    }
}