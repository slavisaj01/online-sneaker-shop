using Login.Data;
using Login.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Dodavanje servisa za rad sa bazom podataka koristeći Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Dodavanje Identity servisa za korisnički menadžment (registracija, prijavljivanje, uloge)
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Registrujte ProductService (ako je to servis koji koristite za proizvode)
builder.Services.AddScoped<ProductService>();  // Dodajte ProductService kao servis

builder.Services.AddControllersWithViews(); // Omogućava podršku za MVC poglede (Views)

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Omogućava korišćenje Swagger-a za API dokumentaciju

// Konfiguracija kolačića za autentifikaciju
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;  // Kolačić je dostupan samo serveru
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;  // Kolačić je siguran samo ako je zahtev preko HTTPS-a
    options.Cookie.SameSite = SameSiteMode.Lax;  // Postavljanje SameSite politike (Lax omogućava neke cross-site zahteve)
    options.LoginPath = "/Public/Index";  // Putanja za login stranicu
    options.LogoutPath = "/Account/Logout";  // Putanja za logout
    options.SlidingExpiration = true;  // Omogućava obnavljanje kolačića tokom sesije
    options.ExpireTimeSpan = TimeSpan.FromMinutes(30);  // Vreme trajanja kolačića (30 minuta)
});

var app = builder.Build();

// Konfiguracija HTTP zahteva za razvojnu verziju aplikacije
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Omogućava Swagger u razvojnoj verziji
    app.UseSwaggerUI();  // Prikazuje UI za Swagger
}

app.UseHttpsRedirection();  // Preusmerava HTTP zahteve na HTTPS
app.UseStaticFiles();  // Omogućava korišćenje statičkih fajlova (CSS, JS, slike)
app.UseRouting();  // Omogućava rutiranje zahteva prema odgovarajućim kontrolerima

// Dodavanje middleware-a za autentifikaciju i autorizaciju
app.UseAuthentication();  // Middleware za autentifikaciju (korisnici se prijavljuju)
app.UseAuthorization();   // Middleware za autorizaciju (korisnicima se dodeljuju prava pristupa)


// Pozivanje SeedData klase za inicijalizaciju podataka prilikom pokretanja aplikacije
using (var scope = app.Services.CreateScope())  // Kreira se opseg za servisnu instancu
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<User>>();  // Uzima UserManager servis
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();// Uzima RoleManager servis
    await SeedData.Initialize(services, userManager, roleManager);  // Inicijalizuje podatke (kreira korisnika i rolu ako nisu postojali)
}

app.UseStatusCodePagesWithReExecute("/Error/{0}");  // Prikazuje stranicu za greške ako dođe do problema sa status kodom

// Definisanje default MVC rute
app.MapControllerRoute(
    name: "default",  // Ime rute
    pattern: "{controller=Home}/{action=Index}/{id?}");  // Putanja prema kontrolerima i akcijama (default je Home/Index)

app.Run();  // Pokreće aplikaciju
