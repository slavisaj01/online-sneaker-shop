using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Login.Data; // Namespace za tvoj DbContext
using System.Linq;

namespace Login.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context; // DbContext za direktan rad sa bazom

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public IActionResult HomePage()
        {
            var products = _context.Products.ToList(); // Dohvata sve proizvode iz baze
            return View(products);
        }
    }
}
