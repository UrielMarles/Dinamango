namespace MangoDB.DTO
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
<<<<<<< HEAD
        public string Name { get; set; }
        public string LastName { get; set; }
=======
        public string Nombre { get; set; }
        public string Apellido {  get; set; }
>>>>>>> 2ef0f83c00854a1cad5e9881f0ef649c5fa7d615
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UsuarioDTO
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
    }

}
