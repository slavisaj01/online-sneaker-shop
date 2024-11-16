
using Microsoft.AspNetCore.Mvc;

namespace Login.Controllers
{
    public class PublicController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
