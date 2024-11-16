using Login.Models;
using Login.Services; // Dodaj servis za generisanje tokena
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly JwtTokenService _jwtTokenService; // Dodaj servis za generisanje tokena

    public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, JwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService; // Injektovanje servisa za token
    }

    // POST /api/account/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        if (ModelState.IsValid)
        {
            if (model.Password != model.ConfirmPassword)
            {
                return BadRequest(new { message = "Lozinke se ne podudaraju." });
            }

            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Username vec postoji." });
            }

            var existingEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingEmail != null)
            {
                return BadRequest(new { message = "Email adresa vec postoji." });
            }

            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { message = "Uspesna registracija." });
            }

            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return BadRequest(ModelState);
    }

    // POST /api/account/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return BadRequest(new { message = "Ne postoji korisnik sa tim korisničkim imenom." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                // Generiši JWT token
                var token = await _jwtTokenService.GenerateTokenAsync(user);

                return Ok(new { message = "Uspesno ste se ulogovali.", token });
            }

            return BadRequest(new { message = "Neuspesno logovanje." });
        }

        return BadRequest(ModelState);
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Odjava korisnika sa servera
        _signInManager.SignOutAsync();

        return Ok(new { message = "Uspesno ste se odjavili." });
    }
}
