using MangoDB.DTO;
using MangoDB.Services;
using Microsoft.AspNetCore.Mvc;


namespace MangoDB.Controllers
{

    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserService _authService;

        public UserController(UserService authService)
        {
            _authService = authService;
        }

        // 📌 Registro de usuario
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _authService.Register(request.Email, request.Password, request.FullName);
            if (user == null)
                return BadRequest(new { message = "El usuario ya existe" });

            return Ok(new { message = "Usuario registrado con éxito", user.Id, user.Email, user.FullName });
        }

        // 📌 Iniciar sesión
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            string? token = await _authService.Login(request.Email, request.Password);
            if (token == null)
                return Unauthorized(new { message = "Credenciales inválidas" });

            return Ok(new { token });
        }

        // 📌 Validar usuario por token
        [HttpGet("validate")]
        public async Task<IActionResult> Validate([FromHeader(Name = "Authorization")] string token)
        {
            var user = await _authService.ValidateToken(token);
            if (user == null)
                return Unauthorized(new { message = "Token inválido" });

            return Ok(new { user.Id, user.Email, user.FullName, user.Role });
        }

        // 📌 Cerrar sesión
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromHeader(Name = "Authorization")] string token)
        {
            bool success = await _authService.Logout(token);
            if (!success)
                return BadRequest(new { message = "Token inválido o ya cerrado" });

            return Ok(new { message = "Sesión cerrada exitosamente" });
        }
    }


}
