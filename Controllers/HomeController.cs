using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Login.Controllers
{
    public class HomeController : Controller
    {
        private readonly ProductService _productService;

        public HomeController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [Authorize]
        public IActionResult HomePage()
        {
            var products = _productService.GetAllProducts();
            return View(products);
        }
    }
}
