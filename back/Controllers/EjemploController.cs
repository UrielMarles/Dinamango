using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerSuly.Data;
using ServerSuly.Models;

namespace ServerSuly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EjemploController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EjemploController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ejemplo>>> GetEjemplos()
        {
            return await _context.Ejemplos.ToListAsync();
        }
    }
}
