using Login.Data;
using Login.Models;
using Microsoft.AspNetCore.Authentication.Cookies;  // Dodaj za kolačiće
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Login
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            builder.Services.AddControllersWithViews(); // Add support for MVC views

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Configure the cookie settings for authentication
            builder.Services.ConfigureApplicationCookie(options =>
            {
                // Obezbeđuje da kolačić bude dostupan samo serveru
                options.Cookie.HttpOnly = true;

                // Kolačić je siguran samo kada je zahtev preko HTTPS-a
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

                // Podešava politiku SameSite (Lax omogućava neke cross-site zahteve)
                options.Cookie.SameSite = SameSiteMode.Lax;

                // Putanja ka login stranici
                options.LoginPath = "/Public/Index";

                // Putanja za logout
                options.LogoutPath = "/Account/Logout";

                // Putanja koja se prikazuje kada korisnik pokušava pristupiti resursima bez odgovarajućih prava
                //options.AccessDeniedPath = "/Account/AccessDenied";

                // Omogućava obnavljanje kolačića tokom sesije
                options.SlidingExpiration = true;

                // Vreme trajanja kolačića (npr. 30 minuta)
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles(); // Enables static files like CSS, JS, images

            app.UseRouting();

            // Dodaj Middleware za autentifikaciju i autorizaciju
            app.UseAuthentication();  // Ovdje mora biti
            app.UseAuthorization();   // Ovdje mora biti

            app.UseStatusCodePagesWithReExecute("/Error/{0}");

            // Default MVC routing
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}
