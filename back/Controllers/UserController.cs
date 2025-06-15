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

        // 📌 Registro o login de usuario en google
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

        // 📌 Registro de usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _userService.Register(request.Email, request.Password, request.Nombre, request.Apellido);

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

            return Ok(new { user.Id, user.Email, user.Nombre, user.Apellido, user.ProfilePictureUrl, user.Role, user.isGoogleUser });
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
            var serverURL = $"{Request.Scheme}://{Request.Host}";
            
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
            var solutionFolder = Directory.GetParent(AppContext.BaseDirectory)?.Parent?.Parent?.Parent?.FullName;
            var uploadsFolder = Path.Combine(solutionFolder, "ProfilePictures");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 📌 Generar el nombre del archivo
            string fileName = $"{user.Id}{extension}";
            string filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.ProfilePictureUrl = $"{serverURL}/getImages/profile/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Foto de perfil actualizada", profilePictureUrl = user.ProfilePictureUrl });
        }

        [HttpGet("getImages/profile/{id}")]
        public async Task<IActionResult> getProfilePicture(Guid id, [FromHeader(Name = "Authorization")] string token)
        {
            var currentUser = await _userService.ValidateToken(token);
            if (currentUser == null)
                return Unauthorized(new { message = "Token inválido" });

            var folder = Directory.GetParent(AppContext.BaseDirectory)?.Parent?.Parent?.Parent?.FullName;
            var folderImages = Path.Combine(folder, "ProfilePictures");

            if (!Directory.Exists(folderImages))
                return NotFound("Directorio de imágenes no existe");

            // Buscar archivo que empiece con el ID
            var file = Directory.GetFiles(folderImages)
                .FirstOrDefault(f => Path.GetFileNameWithoutExtension(f).Equals(id.ToString(), StringComparison.OrdinalIgnoreCase));

            if (file == null)
                return NotFound("Imagen no encontrada");

            var mime = "image/jpeg"; // o usar lógica para detectar MIME
            var archivo = System.IO.File.OpenRead(file);
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
