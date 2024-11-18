using System.ComponentModel.DataAnnotations;

namespace Login.Models
{
    public class Product
    {
        public int Id { get; set; }               // Jedinstveni identifikator proizvoda

        [Required(ErrorMessage = "Ime proizvoda je obavezno.")]
        [StringLength(100, ErrorMessage = "Ime proizvoda ne može biti duže od 100 karaktera.")]
        public string Name { get; set; }           // Ime proizvoda (npr. "Air Max 90")

        [Required(ErrorMessage = "Brend je obavezan.")]
        [StringLength(50, ErrorMessage = "Brend ne može biti duži od 50 karaktera.")]
        public string Brand { get; set; }          // Brend proizvoda (npr. "Nike")

        [Required(ErrorMessage = "Cena je obavezna.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Cena mora biti veća od 0.")]
        public decimal Price { get; set; }         // Cena proizvoda

        [Url(ErrorMessage = "URL slike nije u validnom formatu.")]
        public string ImageUrl { get; set; }       // URL slike proizvoda (za prikaz slike)

        [Range(0, int.MaxValue, ErrorMessage = "Količina ne može biti manja od 0.")]
        public int Quantity { get; set; }          // Količina proizvoda na skladištu

        [Required(ErrorMessage = "Velicina je obavezna.")]
        [StringLength(3, ErrorMessage = "Velicina može imati maksimalno 3 karaktera.")]
        [RegularExpression(@"^\d+$", ErrorMessage = "Velicina mora biti broj.")]
        public string Size { get; set; }           // Velicina proizvoda (npr. "42", "44")

        public bool InStock => Quantity > 0; // Automatski svojstvo 
    }
}
