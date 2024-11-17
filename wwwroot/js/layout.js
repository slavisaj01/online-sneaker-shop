$(document).ready(function () {
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

    // Funkcija za prikazivanje notifikacije sa specifičnim porukama
    function showLayoutNotification(message) {
        $(".notification.layout #notification-message").text(message);  // Postavljanje poruke
        $(".notification.layout").fadeIn();  // Prikazivanje notifikacije
    }
});
