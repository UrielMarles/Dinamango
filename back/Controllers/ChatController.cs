using MangoDB.Context;
using MangoDB.Dtos;
using MangoDB.Models;
using MangoDB.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly MangoDBcontext _context;
    private readonly UserService _userService;

    public ChatController(MangoDBcontext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    // Crear chat
    [HttpPost("crear")]
    public async Task<ActionResult<ChatDto>> Crear([FromBody] CreateChatDto dto)
    {
        if (dto == null || dto.UsuarioIds == null || dto.UsuarioIds.Count < 2)
        {
            return BadRequest("Se necesitan al menos dos usuarios para crear un chat.");
        }

        var uniqueUserGuids = dto.UsuarioIds
            .Select(id => Guid.TryParse(id, out var guid) ? guid : Guid.Empty)
            .Where(guid => guid != Guid.Empty)
            .Distinct()
            .ToList();

        if (uniqueUserGuids.Count < 2)
        {
            return BadRequest("Los usuarios deben ser distintos y válidos.");
        }

        var chatExistente = await _context.Chats
            .Where(c => c.ChatUsuarios.Count == uniqueUserGuids.Count)
            .Where(c => uniqueUserGuids.All(userId => c.ChatUsuarios.Any(cu => cu.UsuarioId == userId)))
            .FirstOrDefaultAsync();

        if (chatExistente != null)
        {
            var chatDto = await GetChatDtoById(chatExistente.Id);

            return Ok(chatDto);
        }

        var chat = new Chat
        {
            ChatUsuarios = uniqueUserGuids.Select(userId => new ChatUsuario { UsuarioId = userId }).ToList()
        };

        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();

        var nuevoChatDto = await GetChatDtoById(chat.Id);

        return CreatedAtAction(nameof(ObtenerMensajes), new { chatId = chat.Id }, nuevoChatDto);
    }

    // Chat por usuarios
    [HttpGet("usuario/{usuarioId}/chats")]
    public async Task<ActionResult<IEnumerable<ChatDto>>> ObtenerChatsPorUsuario([FromRoute] string usuarioId)
    {
        if (!Guid.TryParse(usuarioId, out var usuarioGuid))
        {
            return BadRequest("El identificador de usuario no es válido.");
        }

        var chats = await _context.ChatUsuarios
            .Where(cu => cu.UsuarioId == usuarioGuid)
            .Select(cu => new ChatDto
            {
                ChatId = cu.Chat.Id,
                FechaCreacion = cu.Chat.FechaCreacion,
                UsuarioIds = cu.Chat.ChatUsuarios.Select(u => u.UsuarioId.ToString()).ToList(),
                Mensajes = cu.Chat.Mensajes
                                .OrderByDescending(m => m.FechaEnvio)
                                .Take(1)
                                .Select(m => new MensajeDto
                                {
                                    Id = m.Id,
                                    ChatId = m.ChatId,
                                    RemitenteId = m.RemitenteId,
                                    Contenido = m.Contenido,
                                    FechaEnvio = m.FechaEnvio,
                                    Leido = m.Leido
                                }).ToList()
            })
            .ToListAsync();

        return Ok(chats);
    }

    [HttpGet("entre/{usuario1}/{usuario2}")]
    public async Task<ActionResult<ChatDto>> ObtenerChatEntre(string usuario1, string usuario2)
    {
        if (!Guid.TryParse(usuario1, out var a) || !Guid.TryParse(usuario2, out var b))
        {
            return BadRequest("Identificadores inválidos.");
        }
        if (a == b)
        {
            return BadRequest("Los usuarios deben ser distintos.");
        }

        var ids = new HashSet<Guid> { a, b };

        var chat = await _context.Chats
            .Where(c => c.ChatUsuarios.Count == 2)
            .Where(c => ids.All(id => c.ChatUsuarios.Any(cu => cu.UsuarioId == id)))
            .Select(c => c.Id)
            .FirstOrDefaultAsync();

        if (chat == 0)
        {
            return NotFound("No existe chat entre esos usuarios.");
        }

        var dto = await GetChatDtoById(chat);

        return Ok(dto);
    }

    // Enviar mensaje
    [HttpPost("enviar")]
    public async Task<ActionResult<MensajeDto>> Enviar([FromBody] MensajeDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Contenido))
        {
            return BadRequest("El contenido del mensaje es obligatorio.");
        }

        var chat = await _context.Chats
            .Include(c => c.ChatUsuarios)
            .FirstOrDefaultAsync(c => c.Id == dto.ChatId);

        if (chat == null)
        {
            return NotFound("Chat no encontrado.");
        }

        if (!chat.ChatUsuarios.Any(cu => cu.UsuarioId == dto.RemitenteId))
        {
            return Forbid("El remitente proporcionado no es participante de este chat.");
        }

        var mensaje = new Mensaje
        {
            ChatId = dto.ChatId,
            RemitenteId = dto.RemitenteId,
            Contenido = dto.Contenido.Trim(),
            FechaEnvio = DateTime.UtcNow,
            Leido = false
        };

        _context.Mensajes.Add(mensaje);
        await _context.SaveChangesAsync();

        var respuestaDto = new MensajeDto
        {
            Id = mensaje.Id,
            ChatId = mensaje.ChatId,
            RemitenteId = mensaje.RemitenteId,
            Contenido = mensaje.Contenido,
            FechaEnvio = mensaje.FechaEnvio,
            Leido = mensaje.Leido
        };

        return Ok(respuestaDto);
    }

    // Obtener mensajes de un chat específico.
    [HttpGet("{chatId}/mensajes")]
    public async Task<ActionResult<IEnumerable<MensajeDto>>> ObtenerMensajes([FromRoute] int chatId)
    {
        if (!await _context.Chats.AnyAsync(c => c.Id == chatId))
        {
            return NotFound("Chat no encontrado.");
        }

        var mensajes = await _context.Mensajes
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.FechaEnvio)
            .Select(m => new MensajeDto // Proyectamos directamente al DTO
            {
                Id = m.Id,
                ChatId = m.ChatId,
                RemitenteId = m.RemitenteId,
                Contenido = m.Contenido,
                FechaEnvio = m.FechaEnvio,
                Leido = m.Leido
            })
            .ToListAsync();

        return Ok(mensajes);
    }

    // --- Método de ayuda privado ---
    private async Task<ChatDto> GetChatDtoById(int chatId)
    {
        return await _context.Chats
            .Where(c => c.Id == chatId)
            .Select(c => new ChatDto
            {
                ChatId = c.Id,
                FechaCreacion = c.FechaCreacion,
                UsuarioIds = c.ChatUsuarios.Select(cu => cu.UsuarioId.ToString()).ToList(),
                Mensajes = c.Mensajes.OrderBy(m => m.FechaEnvio).Select(m => new MensajeDto
                {
                    Id = m.Id,
                    ChatId = m.ChatId,
                    RemitenteId = m.RemitenteId,
                    Contenido = m.Contenido,
                    FechaEnvio = m.FechaEnvio,
                    Leido = m.Leido
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }
}

public class CreateChatDto
{
    [Required]
    public List<string> UsuarioIds { get; set; }
}