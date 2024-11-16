$(document).ready(function () {
    // Dodavanje validacije za potvrdu lozinke
    $.validator.addMethod("passwordmatch", function (value, element) {
        return value === $("#Password").val();
    }, "Lozinke se ne poklapaju.");

    // Dodavanje validacije za lozinku prema zahtevima ASP.NET Identity
    $.validator.addMethod("strongPassword", function (value, element) {
        var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/;
        return passwordPattern.test(value);
    }, "Lozinka mora biti dugačka najmanje 8 karaktera, sadržavati bar jedno veliko slovo, jedno malo slovo, jedan broj i jedan specijalan karakter.");

    // Dodavanje validacije za specifične domene, kao što je Gmail
    $.validator.addMethod("gmailEmail", function (value, element) {
        var emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return emailPattern.test(value);
    }, "Unesite validnu Gmail adresu.");

    // Inicijalizacija validacije forme
    $("#registerForm").validate({
        rules: {
            UserName: {
                required: true,
                minlength: 6,
                maxlength: 100
            },
            Email: {
                required: true,
                email: true,
                gmailEmail: true  // Validacija za Gmail
            },
            Password: {
                required: true,
                strongPassword: true  // Validacija za snažnu lozinku
            },
            ConfirmPassword: {
                required: true,
                passwordmatch: true
            }
        },
        messages: {
            UserName: {
                required: "Korisničko ime je obavezno.",
                minlength: "Korisničko ime mora imati najmanje 6 karaktera.",
                maxlength: "Korisničko ime ne može imati više od 100 karaktera."
            },
            Email: {
                required: "Email je obavezan.",
                email: "Unesite validnu email adresu.",
                gmailEmail: "Unesite validnu Gmail adresu."  
            },
            Password: {
                required: "Lozinka je obavezna.",
                strongPassword: "Lozinka mora biti dugačka najmanje 8 karaktera, sadržavati bar jedno veliko slovo, jedno malo slovo, jedan broj i jedan specijalan karakter." // Poruka za snažnu lozinku
            },
            ConfirmPassword: {
                required: "Potvrdite vašu lozinku.",
                passwordmatch: "Lozinke se ne poklapaju."
            }
        }
    });

    


    // Rukovanje sa slanjem forme
    $("#registerForm").submit(function (event) {
        event.preventDefault(); // Zaustavi slanje ako forma nije validna

        if (!$(this).valid()) {
            return; // Zaustavi slanje ako forma nije validna
        }

        var formData = JSON.stringify({
            UserName: $("#UserName").val(),
            Email: $("#Email").val(),
            Password: $("#Password").val(),
            ConfirmPassword: $("#ConfirmPassword").val()
        });

        $.ajax({
            url: '/api/Account/Register',  // MVC ruta za registraciju
            type: 'POST',
            contentType: 'application/json',
            data: formData,  // Posaljite podatke iz forme
            success: function (response) {
                // Prikazivanje poruke u popup-u
                $("#notification-message").text(response.message);  // Koristi response.message koji dolazi sa servera
                $("#notification").css("background-color", "#28a745");  // Siva boja za uspeh

                // Prikazivanje popup-a
                $("#notification").fadeIn();

                // Dodaj funkcionalnost za OK dugme (zatvaranje popup-a i preusmeravanje)
                $("#okButton").click(function () {
                    // Preusmeravanje na početnu stranu
                    window.location.href = "/Public/Index";
                });

               
            },
            error: function (xhr, status, error) {
                console.log("XHR odgovor:", xhr); // Logovanje celog odgovora
                console.log("Greška:", error); // Logovanje greške
                console.log("Status odgovora:", xhr.status); // Provera statusa odgovora
                console.log("JSON odgovor:", xhr.responseJSON); // Logovanje JSON odgovora

                if (xhr.responseJSON) {
                    var errorsHtml = '';  // Inicijalizuj prazan string za greške

                    // Provera da li je greška u 'message' polju, jer se tamo nalazi poruka
                    if (xhr.responseJSON.message) {
                        errorsHtml += `<span class="text-danger">${xhr.responseJSON.message}</span><br/>`;
                    } else if (xhr.responseJSON.errors) {
                        // Ako postoje dodatne greške u 'errors' polju
                        $.each(xhr.responseJSON.errors, function (key, value) {
                            errorsHtml += `<span class="text-danger">${value}</span><br/>`;
                        });
                    }

                    // Prikazivanje grešaka u #message elementu
                    $("#message").html(errorsHtml).fadeIn();
                } else {
                    alert("Došlo je do greške, pokušajte ponovo.");
                }
            }
        });
    });
});
