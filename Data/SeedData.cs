using Login.Data;
using Login.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider, 
                                        UserManager<User> userManager, 
                                        RoleManager<IdentityRole> roleManager)
    {
        var roleName = "Admin";
        var userName = "Admin";
        var gmail = "admin@gmail.com";
        var password = "Admin2001.";

        // Proveravamo da li postoji uloga "Admin", ako ne, kreiramo je
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }

        // Proveravamo da li već postoji korisnik sa tim email-om
        var user = await userManager.FindByEmailAsync(userName);
        if (user == null)
        {
            // Ako korisnik ne postoji, kreiramo ga
            user = new User { UserName = userName, Email = gmail };
            var result = await userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                // Dodajemo korisnika u "Admin" ulogu
                await userManager.AddToRoleAsync(user, roleName);
            }
        }
        
    }
}

