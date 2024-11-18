using Login.Data;
using Login.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class HomeApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HomeApiController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST api/homeapi/addproduct
    [HttpPost("addproduct")]
    public IActionResult AddProduct([FromBody] Product product)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Došlo je do greške prilikom dodavanja proizvoda.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
        }

        try
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return Ok(new { message = "Proizvod je uspešno dodat." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Došlo je do greške prilikom dodavanja proizvoda.", error = ex.Message });
        }
    }
}
