using Login.Data;
using Login.Models;
using Microsoft.AspNetCore.Authorization;
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
    [HttpPut("editproduct/{id}")]
    [Authorize(Roles = "Admin")]

    public IActionResult PutProduct(int id, [FromBody] Product product)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Doslo je do greske prilikom izmene proizvoda.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList() });
        }
        try
        {
            var existingProduct = _context.Products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound(new { message = "Proizvod sa zadatim ID-jem nije pronađen." });
            }

            // Ažuriraj podatke proizvoda
            existingProduct.Name = product.Name;
            existingProduct.Brand = product.Brand;
            existingProduct.Price = product.Price;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.Quantity = product.Quantity;
            existingProduct.Size = product.Size;

            // Spasi promene u bazi
            _context.SaveChanges();

            return Ok(new { message = "Proizvod je uspešno izmenjen." });

        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Došlo je do greške prilikom izmene proizvoda.", error = ex.Message });
        }


    }

    // Akcija za brisanje proizvoda
    [HttpDelete("deleteproduct/{id}")]
    [Authorize(Roles = "Admin")] // Ograničenje za administratore
    public IActionResult DeleteProduct(int id)
    {
        var product = _context.Products.FirstOrDefault(p => p.Id == id);

        if (product == null)
        {
            return BadRequest(new { success = false, message = "Proizvod nije pronađen." });
        }

        _context.Products.Remove(product);
        _context.SaveChanges();

        return Ok(new { message = "Proizvod uspešno obrisan." });
    }
    [HttpGet("getproduct/{id}")]
    [Authorize]
    public IActionResult GetProduct(int id)
    {
        var product = _context.Products.FirstOrDefault(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Proizvod nije pronađen." });
        }

        return Ok(new
        {
            productName = product.Name,
            productBrand = product.Brand,
            productPrice = product.Price,
            productImageUrl = product.ImageUrl,
            productQuantity = product.Quantity,
            productSize = product.Size
        });
    }
}

