using MangoDB.Context;
using MangoDB.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace MangoDB.Services
{
    public class UserService
    {
        private readonly MangoDBcontext _context;

        public UserService(MangoDBcontext context)
        {
            _context = context;
        }

        // Generar un token seguro
        public string GenerateToken()
        {
            byte[] tokenBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(tokenBytes);
            }
            return Convert.ToBase64String(tokenBytes);
        }

        // Generar un salt aleatorio
        private string GenerateSalt()
        {
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }

        // Hashear una contraseña con un salt proporcionado
        private string HashPassword(string password, string salt)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: saltBytes,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 32
            ));
        }

        // Verificar la contraseña con el hash y salt almacenados
        public bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            string hashedInput = HashPassword(password, storedSalt);
            return hashedInput == storedHash;
        }

        // Registrar un nuevo usuario con contraseña hasheada
<<<<<<< HEAD
        public async Task<User?> Register(string email, string password, string name, string lastName, string role = "User")
=======
        public async Task<User?> Register(string email, string password, string nombre, string apellido, string role = "User")
>>>>>>> 2ef0f83c00854a1cad5e9881f0ef649c5fa7d615
        {
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return null; // Usuario ya existe

            string salt = GenerateSalt();
            string hashedPassword = HashPassword(password, salt);

            var user = new User
            {
                Email = email,
                PasswordHash = hashedPassword,
                Salt = salt, // Guardamos el salt
<<<<<<< HEAD
                Nombre = name,
                Apellido = lastName,
=======
                Nombre = nombre,
                Apellido = apellido,
>>>>>>> 2ef0f83c00854a1cad5e9881f0ef649c5fa7d615
                Role = role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // Iniciar sesión y guardar el token en la base de datos
        public async Task<string?> Login(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !VerifyPassword(password, user.PasswordHash, user.Salt))
                return null;

            string token = GenerateToken();

            var userToken = new UserToken
            {
                UserId = user.Id,
                Token = token
            };

            _context.UserTokens.Add(userToken);
            await _context.SaveChangesAsync();

            return token;
        }

        // Validar si un token pertenece a un usuario
        public async Task<User?> ValidateToken(string token)
        {
            var userToken = await _context.UserTokens
                .Include(ut => ut.User)
                .FirstOrDefaultAsync(ut => ut.Token == token);

            return userToken?.User;
        }

        // Cerrar sesión eliminando el token
        public async Task<bool> Logout(string token)
        {
            var userToken = await _context.UserTokens.FirstOrDefaultAsync(ut => ut.Token == token);
            if (userToken == null)
                return false;

            _context.UserTokens.Remove(userToken);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
