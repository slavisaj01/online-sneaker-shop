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

    $(document).on('click', '.delete-product', function (e) {
        e.preventDefault();

        var productId = $(this).data('id'); // Uzmi ID proizvoda iz data-id atributa

        // Prikazivanje modala za potvrdu brisanja
        $("#deleteModal").fadeIn();

        // Kada korisnik klikne "Obriši" u modal prozoru
        $("#confirm-yes").click(function () {
            $.ajax({
                url: '/api/homeapi/deleteproduct/' + productId,
                type: 'DELETE',
                success: function (response) {
                    // Prikazivanje notifikacije
                    $("#notification-message").text(response.message);
                    $("#notification").css("background-color", "#28a745");
                    $("#notification").fadeIn();

                    // Uklanja proizvod iz prikaza bez osvežavanja stranice
                    $(`#product-row-${productId}`).remove();

                    // Zatvaranje modala nakon uspešnog brisanja
                    $("#deleteModal").fadeOut();

                    // Ako želiš da odmah preusmeriš korisnika na HomePage
                    $("#okButton").click(function () {
                        window.location.href = "/Home/HomePage";
                    });
                },
                error: function (xhr, status, error) {
                    // Prikazivanje greške ako dođe do problema sa brisanjem
                    alert("Došlo je do greške pri brisanju proizvoda. Pokušajte ponovo.");
                }
            });
        });

        // Kada korisnik klikne "Otkaži" u modal prozoru
        $("#confirm-no").click(function () {
            // Zatvaranje modala bez brisanja
            $("#deleteModal").fadeOut();
        });
        // Kada korisnik klikne na dugme za zatvaranje (X) modala
        $(".btn-close").click(function () {
            // Zatvaranje modala s fadeOut efektom
            $("#deleteModal").fadeOut();
        });
    });

    $(document).on('click', '.edit-product', function (e) {
        e.preventDefault();

        var productId = $(this).data('id'); // Uzima ID proizvoda iz data-id atributa

        // Proveri da li productId postoji
        if (!productId) {
            alert('Proizvod ID nije postavljen!');
            return;
        }

        // Pozivaš AJAX poziv da dobiješ podatke o proizvodu
        $.ajax({
            url: '/api/homeapi/getproduct/' + productId, // API ruta za uzimanje podataka o proizvodu
            type: 'GET',
            success: function (response) {
                // Ako proizvod nije pronađen
                if (response.message) {
                    alert(response.message);
                    return;
                }

                // Popunjavaš modal sa podacima proizvoda
                $('#updateProductName').val(response.productName);
                $('#updateProductBrand').val(response.productBrand);
                $('#updateProductPrice').val(response.productPrice);
                $('#updateProductImageUrl').val(response.productImageUrl);
                $('#updateProductQuantity').val(response.productQuantity);
                $('#updateProductSize').val(response.productSize);

                // Postavi ID proizvoda u skriveni input (ako je to potrebno)
                $('#productId').val(productId);  // Dodajte ovu liniju ako imate hidden input za ID

                // Otvori modal
                $('#updateProductModal').modal('show');
            },
            error: function (xhr, status, error) {
                alert('Došlo je do greške prilikom učitavanja proizvoda.');
            }
        });
    });

    $("#updateProductForm").validate({
        rules: {
            updateProductName: {
                required: true,
                maxlength: 100
            },
            updateProductBrand: {
                required: true,
                maxlength: 50
            },
            updateProductPrice: {
                required: true,
                positiveNumber: true
            },
            updateProductImageUrl: {
                validUrl: true
            },
            updateProductQuantity: {
                required: true,
                min: 0
            },
            updateProductSize: {
                required: true,
                maxlength: 3,
                digits: true
            }
        },
        messages: {
            updateProductName: {
                required: "Ime proizvoda je obavezno.",
                maxlength: "Ime proizvoda ne može biti duže od 100 karaktera."
            },
            updateProductBrand: {
                required: "Brend je obavezan.",
                maxlength: "Brend ne može biti duži od 50 karaktera."
            },
            updateProductPrice: {
                required: "Cena je obavezna.",
                positiveNumber: "Cena mora biti veća od 0."
            },
            updateProductImageUrl: {
                validUrl: "URL slike nije u validnom formatu."
            },
            updateProductQuantity: {
                required: "Količina je obavezna.",
                min: "Količina ne može biti manja od 0."
            },
            updateProductSize: {
                required: "Velicina je obavezna.",
                maxlength: "Velicina može imati maksimalno 3 karaktera.",
                digits: "Velicina mora biti broj."
            }
        },
        submitHandler: function (form) {
            // Ako je forma validna, šaljemo podatke na server
            var productId = $('#productId').val(); // Uzmi ID proizvoda iz skrivenog inputa
            var productData = {
                name: $('#updateProductName').val(),
                brand: $('#updateProductBrand').val(),
                price: $('#updateProductPrice').val(),
                imageUrl: $('#updateProductImageUrl').val(),
                quantity: $('#updateProductQuantity').val(),
                size: $('#updateProductSize').val()
            };

            $.ajax({
                url: '/api/homeapi/editproduct/' + productId, // API ruta za ažuriranje proizvoda
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(productData), // Slanje podataka u JSON formatu
                success: function (response) {
                    if (response.message) {
                        $('#updateProductModal').modal('hide'); // Zatvori modal
                        $("#notification-message").text(response.message);
                        $("#notification").css("background-color", "#28a745"); // Uspeh
                        $("#notification").fadeIn();

                        $("#okButton").click(function () {
                            window.location.href = "/Home/HomePage";
                        });
                    }
                },
                error: function (xhr, status, error) {
                    alert('Došlo je do greške prilikom izmene proizvoda.');
                }
            });
        }
    });
    $(document).on('click', '.btnView', function (e) {
        e.preventDefault();  // Sprečava podrazumevani klik na link

        var productId = $(this).data('id');  // Preuzimamo ID proizvoda

        // Pozivamo metodu koja vraća proizvod prema ID-u putem AJAX-a
        $.ajax({
            url: '/api/homeapi/getproduct/' + productId,  // API ruta za uzimanje podataka o proizvodu
            type: 'GET',
            success: function (response) {
                // Ako proizvod nije pronađen, prikazujemo poruku
                if (response.message) {
                    alert(response.message);
                    return;
                }

                // Popunjavaš modal sa podacima
                $('#productTitle').text(response.productName);
                $('#productDescription').html(`
                <strong>Brend:</strong> ${response.productBrand} <br>
                <strong>Cena:</strong> ${response.productPrice}€ <br>
                <strong>Veličina:</strong> ${response.productSize} <br>
                <strong>Dostupnost:</strong> ${response.productQuantity> 0 ? 'Na skladištu' : 'Nema na skladištu'} <br>
            `);
                $('#productImage').attr('src', response.productImageUrl);  // Dodajemo sliku u modal

                // Prikazujemo modal
                $('#infoProduct').fadeIn();
            },
            error: function () {
                alert('Došlo je do greške prilikom učitavanja proizvoda.');
            }
        });
    });

    // Zatvaranje modala
    $(document).on('click', '.close, .close-btn', function () {
        $('#infoProduct').fadeOut();  // Zatvori modal
    });

});
//ovde