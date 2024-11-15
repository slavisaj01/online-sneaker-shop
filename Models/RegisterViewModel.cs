using System.ComponentModel.DataAnnotations;

public class RegisterViewModel
{
    [Required]
    [StringLength(100, ErrorMessage = "Username must be between 6 and 100 characters.", MinimumLength = 6)]
    public string UserName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Compare("Password", ErrorMessage = "Password and confirmation do not match.")]
    public string ConfirmPassword { get; set; }
}
