$(document).ready(function () {
    // Selektujemo formu
    $('#loginForm').submit(function (event) {
        // Sprečavamo da forma bude odmah poslata
        event.preventDefault();

        // Uzimamo vrednosti iz input polja
        var username = $('#UserName').val();
        var password = $('#Password').val();

        // Proveravamo da li su oba polja popunjena
        if (!username || !password) {
            var errorsHtml = '';
            errorsHtml += `<span class="text-danger">Popunite oba polja.</span><br/>`;
            $("#message").html(errorsHtml).fadeIn();
            //alert('Popunite ova polja.');
            return;
        }

        // Ako su oba polja popunjena, šaljemo formu
        var formData = JSON.stringify({
            UserName: username,
            Password: password
        });

        $.ajax({
            url: '/api/Account/Login',  // MVC ruta za login akciju
            type: 'POST',
            contentType: 'application/json',
            data: formData,  // Posaljite podatke iz forme
            success: function (response) {
                console.log(response); 
                // Prikazivanje poruke u popup-u
                $("#notification-message").text(response.message);  // Koristi response.message koji dolazi sa servera
                $("#notification").css("background-color", "#28a745");  // Siva boja za uspeh

                // Prikazivanje popup-a
                $("#notification").fadeIn();

                // Dodaj funkcionalnost za OK dugme (zatvaranje popup-a i preusmeravanje)
                $("#okButton").click(function () {
                    // Preusmeravanje na početnu stranu
                    window.location.href = "/Home/HomePage";
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