using Login.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace Login.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<AccountController> _logger;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        // GET metoda za prikazivanje forme za registraciju
        [HttpGet]
        public IActionResult Register()
        {
            return View(); // Vraća stranicu sa formularom
        }
        
        [HttpGet]
        public IActionResult Login()
        {
            return View(); // Vraća stranicu sa formularom
        }
    }
}
