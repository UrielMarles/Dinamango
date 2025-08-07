using MangoDB.Context;
using MangoDB.DTO;
using MangoDB.Models;
using MangoDB.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/ofertas")]
public class OfertaController : ControllerBase
{
    private readonly MangoDBcontext _context;
    private readonly UserService _userService;

    public OfertaController(MangoDBcontext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    // 📌 Crear una nueva oferta para una tarea
    [HttpPost("{idTarea}")]
    public async Task<IActionResult> CrearOferta(Guid idTarea, [FromHeader(Name = "Authorization")] string token, [FromBody] CreateOfertaDTO request)
    {
        var user = await _userService.ValidateToken(token);
        if (user == null)
            return Unauthorized(new { message = "Token inválido" });

        var tarea = await _context.Tareas.FindAsync(idTarea);
        if (tarea == null)
            return NotFound(new { message = "Tarea no encontrada" });

        var oferta = new Oferta
        {
            Id = Guid.NewGuid(),
            IdTarea = idTarea,
            IdCreadorOferta = user.Id,
            MensajeOferta = request.MensajeOferta,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Ofertas.Add(oferta);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Oferta creada exitosamente", oferta.Id });
    }

    [HttpGet("misOfertas")]
    public async Task<IActionResult> GetMisOfertas([FromHeader(Name = "Authorization")] string token)
    {
        var user = await _userService.ValidateToken(token);
        if (user == null)
        {
            return Unauthorized(new { message = "Token inválido" });
        }

        var misOfertas = await _context.Ofertas
            .Include(o => o.Tarea)
            .Where(o => o.IdCreadorOferta == user.Id)
            .Select(o => new
            {
                o.Id,
                o.MensajeOferta,
                o.FechaCreacion,
                Tarea = new
                {
                    o.Tarea.Id,
                    o.Tarea.Titulo,
                    o.Tarea.Descripcion,
                    o.Tarea.FechaPublicacion,
                    o.Tarea.DineroOfrecido
                }
            }).ToListAsync();

        return Ok(misOfertas);
    }
}
