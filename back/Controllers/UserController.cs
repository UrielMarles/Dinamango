using MangoDB.Context;
using MangoDB.DTO;
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

        // 📌 Registro de usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
<<<<<<< HEAD
            var user = await _userService.Register(request.Email, request.Password, request.Name, request.LastName);
=======
            var user = await _userService.Register(request.Email, request.Password, request.Nombre, request.Apellido);
>>>>>>> 2ef0f83c00854a1cad5e9881f0ef649c5fa7d615
            if (user == null)
                return BadRequest(new { message = "El usuario ya existe" });

            return Ok(new { message = "Usuario registrado con éxito", user.Id, user.Email, user.Nombre, user.Apellido });
        }

        // 📌 Iniciar sesión
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            string? token = await _userService.Login(request.Email, request.Password);
            if (token == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            return Ok(new { token });
        }

        // 📌 Validar usuario por token
        [HttpGet("validate")]
        public async Task<IActionResult> Validate([FromHeader(Name = "Authorization")] string token)
        {
            var user = await _userService.ValidateToken(token);
            if (user == null)
                return Unauthorized(new { message = "Token inválido" });

            return Ok(new { user.Id, user.Email, user.Nombre, user.Apellido, user.Role });
        }

        // 📌 Cerrar sesión
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
            var user = await _userService.ValidateToken(token);
            if (user == null)
                return Unauthorized(new { message = "Token inválido" });

            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Archivo inválido" });

            // 📌 Validar tipo de archivo (solo imágenes permitidas)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Formato de imagen no permitido" });

            // 📌 Definir la carpeta donde se guardarán las imágenes (misma altura que la solución)
            var solutionFolder = Directory.GetParent(AppContext.BaseDirectory)?.FullName;
            var uploadsFolder = Path.Combine(solutionFolder, "ProfilePictures");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 📌 Generar el nombre del archivo
            string fileName = $"{user.Id}{extension}";
            string filePath = Path.Combine(uploadsFolder, fileName);

            // 📌 Guardar el archivo
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 📌 Guardar la ruta relativa en la base de datos
            user.ProfilePictureUrl = filePath;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Foto de perfil actualizada", profilePictureUrl = user.ProfilePictureUrl });
        }

    }


}
