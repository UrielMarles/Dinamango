using MangoDB.Context;
using MangoDB.DTO;
using MangoDB.Models;
using MangoDB.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace MangoDB.Controllers
{

    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly MangoDBcontext _context;
        private readonly UserService _userService;

        public UserController(IWebHostEnvironment environment, MangoDBcontext context, UserService userService)
        {
            _environment = environment;
            _context = context;
            _userService = userService;
        }

        [HttpPost("login/google")]
        public async Task<IActionResult> LoginGoogle([FromBody] GoogleLoginRequest request)
        {
            string token = await _userService.GoogleLogin(
                request.UID,
                request.Nombre,
                request.Apellido,
                request.Email,
                request.ProfilePictureUrl
            );

            if (string.IsNullOrEmpty(token))
                return Unauthorized(new { message = "No se pudo generar el token" });

            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _userService.Register(request.Email, request.Password, request.Nombre, request.Apellido);

            if (user == null)
                return BadRequest(new { message = "El usuario ya existe" });

            return Ok(new { message = "Usuario registrado con éxito", user.Id, user.Email, user.Nombre, user.Apellido });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            string? token = await _userService.Login(request.Email, request.Password);
            if (token == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            return Ok(new { token });
        }

        [HttpGet("validate")]
        public async Task<IActionResult> Validate([FromHeader(Name = "Authorization")] string token)
        {
            var user = await _userService.ValidateToken(token);
            if (user == null)
                return Unauthorized(new { message = "Token inválido" });

            return Ok(new { user.Id, user.Email, user.Nombre, user.Apellido, user.ProfilePictureUrl, user.Role, user.isGoogleUser });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromHeader(Name = "Authorization")] string token)
        {
            bool success = await _userService.Logout(token);
            if (!success)
                return BadRequest(new { message = "Token inválido o ya cerrado" });

            return Ok(new { message = "Sesión cerrada exitosamente" });
        }

        [HttpPost("profile-picture")]
        public async Task<IActionResult> UploadProfilePicture([FromHeader(Name = "Authorization")] string token, IFormFile file)
        {
            string? serverURL = $"{Request.Scheme}://{Request.Host}";
            User? user = await _userService.ValidateToken(token);
            if (user == null)
            {
                return Unauthorized(new { message = "Token inválido" });
            }
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Archivo inválido" });
            }
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Formato de imagen no permitido" });
            }
            var solutionFolder = Directory.GetParent(AppContext.BaseDirectory)?.Parent?.Parent?.Parent?.FullName;
            var uploadsFolder = Path.Combine(solutionFolder, "ProfilePictures");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            string fileName = $"{user.Id}{extension}";
            string filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            user.ProfilePictureUrl = $"{serverURL}/api/user/getImages/profile/{user.Id}";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Foto de perfil actualizada", profilePictureUrl = user.ProfilePictureUrl });
        }

        [HttpGet("getImages/profile/{id}")]
        public async Task<IActionResult> GetProfilePicture(Guid id)
        {
            string? folder = Directory.GetParent(AppContext.BaseDirectory)?.Parent?.Parent?.Parent?.FullName;
            string folderImages = Path.Combine(folder, "ProfilePictures");

            if (!Directory.Exists(folderImages))
            {
                return NotFound("Directorio de imágenes no existe");
            }

            string? file = Directory.GetFiles(folderImages)
                .FirstOrDefault(f => Path.GetFileNameWithoutExtension(f).Equals(id.ToString(), StringComparison.OrdinalIgnoreCase));

            if (file == null)
            {
                return NotFound("Imagen no encontrada");
            }

            string ext = Path.GetExtension(file).ToLower();
            string mime = ext == ".png" ? "image/png" : ext == ".gif" ? "image/gif" : "image/jpeg";
            FileStream archivo = System.IO.File.OpenRead(file);

            return File(archivo, mime);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromHeader(Name = "Authorization")] string token, [FromBody] ResultGetUsuarioDTO userDto)
        {
            var user = await _userService.ValidateToken(token);
            if (user == null)
                return Unauthorized(new { message = "Token inválido" });

            user.Nombre = string.IsNullOrEmpty(userDto.Nombre) ? user.Nombre : userDto.Nombre;
            user.Apellido = string.IsNullOrEmpty(userDto.Apellido) ? user.Apellido : userDto.Apellido;
            user.Email = string.IsNullOrEmpty(userDto.Email) ? user.Email : userDto.Email;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario actualizado", user = new { user.Nombre, user.Apellido, user.Email } });
        }

    }
}
