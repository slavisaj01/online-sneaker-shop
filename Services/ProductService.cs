using Login.Data;
using Login.Models;

public class ProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<Product> GetAllProducts()
    {
        return _context.Products.ToList();  // Pretpostavimo da imate DbSet<Product> u ApplicationDbContext
    }
}
