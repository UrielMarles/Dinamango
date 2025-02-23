﻿using MangoDB.Context;
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

    // 📌 Obtener todas las ofertas de una tarea específica
    [HttpGet("{idTarea}")]
    public async Task<IActionResult> GetOfertasPorTarea(Guid idTarea)
    {
        var tarea = await _context.Tareas
            .Include(t => t.Ofertas)
            .ThenInclude(o => o.CreadorOferta) // Incluir el usuario que hizo la oferta
            .FirstOrDefaultAsync(t => t.Id == idTarea);

        if (tarea == null)
            return NotFound(new { message = "Tarea no encontrada" });

        var ofertas = tarea.Ofertas.Select(o => new OfertaDTO
        {
            Id = o.Id,
            MensajeOferta = o.MensajeOferta,
            FechaCreacion = o.FechaCreacion,
            Creador = new UsuarioDTO
            {
                Id = o.CreadorOferta.Id,
                Nombre = o.CreadorOferta.Nombre,
                Apellido = o.CreadorOferta.Apellido,
                Email = o.CreadorOferta.Email
            }
        }).ToList();

        return Ok(ofertas);
    }
}
