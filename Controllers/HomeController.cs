using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Login.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult HomePage()
        {
            return View();
        }
    }
}
