$(document).ready(function () {
    // Dodavanje validacije za cenu proizvoda (samo pozitivni brojevi)
    $.validator.addMethod("positiveNumber", function (value, element) {
        return this.optional(element) || value > 0;
    }, "Cena mora biti veća od 0.");

    // Dodavanje validacije za URL slike (validacija URL formata)
    $.validator.addMethod("validUrl", function (value, element) {
        var urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
        return this.optional(element) || urlPattern.test(value);
    }, "URL slike nije u validnom formatu.");
    // Kada korisnik klikne na dugme za logout
    $('#logoutButton').click(function () {
        // Pošaljemo POST zahtev za logout
        $.ajax({
            url: '/api/Account/Logout',  // URL za logout akciju
            type: 'POST',                // POST metoda
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
            error: function () {
                // Ako dođe do greške, obavesti korisnika
                showLayoutNotification("Došlo je do greške pri logout-u");  // Pozivamo funkciju za grešku
            }
        });
    });

    // Kada korisnik klikne na dugme za dodavanje proizvoda
    // Inicijalizacija validacije forme za proizvod
    $("#productForm").validate({
        rules: {
            productName: {
                required: true,
                maxlength: 100
            },
            productBrand: {
                required: true,
                maxlength: 50
            },
            productPrice: {
                required: true,
                positiveNumber: true
            },
            productImageUrl: {
                validUrl: true
            },
            productQuantity: {
                required: true,
                min: 0
            },
            productSize: {
                required: true,
                maxlength: 3,
                digits: true
            }
        },
        messages: {
            productName: {
                required: "Ime proizvoda je obavezno.",
                maxlength: "Ime proizvoda ne može biti duže od 100 karaktera."
            },
            productBrand: {
                required: "Brend je obavezan.",
                maxlength: "Brend ne može biti duži od 50 karaktera."
            },
            productPrice: {
                required: "Cena je obavezna.",
                positiveNumber: "Cena mora biti veća od 0."
            },
            productImageUrl: {
                validUrl: "URL slike nije u validnom formatu."
            },
            productQuantity: {
                required: "Količina je obavezna.",
                min: "Količina ne može biti manja od 0."
            },
            productSize: {
                required: "Velicina je obavezna.",
                maxlength: "Velicina može imati maksimalno 3 karaktera.",
                digits: "Velicina mora biti broj."
            }
        },
        submitHandler: function (form) {
            // Ako je forma validna, šaljemo podatke na server
            var formData = JSON.stringify({
                Name: $("#productName").val(),
                Brand: $("#productBrand").val(),
                Price: $("#productPrice").val(),
                ImageUrl: $("#productImageUrl").val(),
                Quantity: $("#productQuantity").val(),
                Size: $("#productSize").val()
            });

            $.ajax({
                url: '/api/homeapi/addproduct',  
                type: 'POST',
                contentType: 'application/json',
                data: formData,  // Podaci iz forme
                success: function (response) {
                    $("#notification-message").text(response.message);
                    $("#notification").css("background-color", "#28a745"); // Uspeh
                    $("#notification").fadeIn();

                    $("#okButton").click(function () {
                        window.location.href = "/Home/HomePage";
                    });
                },
                error: function (xhr, status, error) {
                    console.log("Greška:", error);
                    console.log("Status odgovora:", xhr.status);
                    console.log("JSON odgovor:", xhr.responseJSON);

                    if (xhr.responseJSON) {
                        var errorsHtml = '';
                        if (xhr.responseJSON.message) {
                            errorsHtml += `<span class="text-danger">${xhr.responseJSON.message}</span><br/>`;
                        } else if (xhr.responseJSON.errors) {
                            $.each(xhr.responseJSON.errors, function (key, value) {
                                errorsHtml += `<span class="text-danger">${value}</span><br/>`;
                            });
                        }
                        $("#message").html(errorsHtml).fadeIn();
                    } else {
                        alert("Došlo je do greške, pokušajte ponovo.");
                    }
                }
            });
        }
    });
});