// Vion Bank ATM Projesi
// Başlangıç PIN: 1234

let pin = "1234";
let bakiye = 15000;
let girilenPin = "";
let kalanHak = 3;
let kartTakili = false;
let aktifIslem = "bekleme";
let islemGecmisi = [];

const ekran = document.getElementById("screen");
const kartYuvasi = document.getElementById("card-slot");
const kart = document.getElementById("bank-card");
const para = document.getElementById("cash-money");

const sayiTuslari = document.querySelectorAll(".number-pad button");
const iptalTus = document.querySelector(".cancel");
const duzeltTus = document.querySelector(".correct");
const onayTus = document.querySelector(".confirm");

function paraYaz(miktar) {
    return miktar.toLocaleString("tr-TR") + " TL";
}

function baslangicEkrani() {
    aktifIslem = "bekleme";
    girilenPin = "";
    kartTakili = false;
    kart.classList.remove("kart-takili");

    ekran.innerHTML = `
        <h2>VİON BANK</h2>
        <p>ATM'ye hoş geldiniz.</p>
        <p>Kartınızı takmak için kart yuvasına tıklayın.</p>
        <p class="bilgi">Demo PIN: 1234</p>
    `;
}

function pinEkrani() {
    aktifIslem = "pin";
    girilenPin = "";

    ekran.innerHTML = `
        <h2>PIN GİRİŞİ</h2>
        <p>4 haneli PIN'inizi giriniz.</p>
        <div id="pin-display"></div>
        <p class="bilgi">Kalan deneme hakkı: ${kalanHak}</p>
    `;
}

function pinGoster() {
    const pinAlani = document.getElementById("pin-display");

    if (pinAlani) {
        pinAlani.innerText = "●".repeat(girilenPin.length);
    }
}

function pinKontrol() {
    if (girilenPin.length !== 4) {
        mesajGoster("Uyarı", "PIN 4 haneli olmalıdır.", "pin");
        return;
    }

    if (girilenPin === pin) {
        kalanHak = 3;
        anaMenu();
    } else {
        kalanHak--;
        girilenPin = "";

        if (kalanHak === 0) {
            ekran.innerHTML = `
                <h2>KART BLOKE EDİLDİ</h2>
                <p>3 kez yanlış PIN girdiniz.</p>
                <button id="yeniden-basla">Yeniden Başla</button>
            `;

            document.getElementById("yeniden-basla").onclick = function () {
                kalanHak = 3;
                baslangicEkrani();
            };
        } else {
            ekran.innerHTML = `
                <h2>HATALI PIN</h2>
                <p>PIN'iniz yanlış.</p>
                <p>Kalan hakkınız: ${kalanHak}</p>
                <button id="tekrar-dene">Tekrar Dene</button>
            `;

            document.getElementById("tekrar-dene").onclick = pinEkrani;
        }
    }
}

function anaMenu() {
    aktifIslem = "menu";

    ekran.innerHTML = `
        <h2>ANA MENÜ</h2>
        <p>Yapmak istediğiniz işlemi seçiniz.</p>

        <div class="atm-menu">
            <button onclick="bakiyeGoster()">Bakiye</button>
            <button onclick="paraCekEkrani()">Para Çek</button>
            <button onclick="paraYatirEkrani()">Para Yatır</button>
            <button onclick="transferEkrani()">Para Transferi</button>
            <button onclick="miniEkstre()">Mini Ekstre</button>
            <button onclick="pinDegistirEkrani()">PIN Değiştir</button>
            <button onclick="islemGecmisiGoster()">İşlem Geçmişi</button>
            <button onclick="cikisYap()">Çıkış</button>
        </div>
    `;
}

function bakiyeGoster() {
    aktifIslem = "menu";

    ekran.innerHTML = `
        <h2>BAKİYENİZ</h2>

        <div class="bakiye-karti">
            <p>Güncel Bakiye</p>
            <h1>${paraYaz(bakiye)}</h1>
        </div>

        <button onclick="anaMenu()">Ana Menü</button>
    `;
}

function paraCekEkrani() {
    aktifIslem = "para-cek";

    ekran.innerHTML = `
        <h2>PARA ÇEK</h2>
        <p>Çekmek istediğiniz tutarı giriniz.</p>
        <input type="number" id="miktar" placeholder="Örn: 500">
        <p class="bilgi">Tek işlem limiti: 5.000 TL</p>
        <button onclick="paraCek()">Parayı Çek</button>
        <button onclick="anaMenu()">Geri</button>
    `;
}

function paraCek() {
    const miktar = Number(document.getElementById("miktar").value);

    if (miktar <= 0) {
        mesajGoster("Uyarı", "Geçerli bir tutar giriniz.", "menu");
        return;
    }

    if (miktar > 5000) {
        mesajGoster("Uyarı", "Tek seferde en fazla 5.000 TL çekebilirsiniz.", "menu");
        return;
    }

    if (miktar > bakiye) {
        mesajGoster("Yetersiz Bakiye", "Hesabınızda yeterli bakiye yok.", "menu");
        return;
    }

    bakiye = bakiye - miktar;
    islemEkle("- " + paraYaz(miktar) + " para çekme");

    para.innerText = "💵 " + paraYaz(miktar);
    para.classList.add("para-cikti");

    ekran.innerHTML = `
        <h2>İŞLEM BAŞARILI</h2>
        <p>${paraYaz(miktar)} hazırlandı.</p>
        <p>Paranızı aşağıdaki para çıkışından alınız.</p>
        <p>Yeni bakiye: <strong>${paraYaz(bakiye)}</strong></p>
    `;
}

function paraYatirEkrani() {
    aktifIslem = "para-yatir";

    ekran.innerHTML = `
        <h2>PARA YATIR</h2>
        <p>Yatırmak istediğiniz tutarı giriniz.</p>
        <input type="number" id="miktar" placeholder="Örn: 1000">
        <button onclick="paraYatir()">Parayı Yatır</button>
        <button onclick="anaMenu()">Geri</button>
    `;
}

function paraYatir() {
    const miktar = Number(document.getElementById("miktar").value);

    if (miktar <= 0) {
        mesajGoster("Uyarı", "Geçerli bir tutar giriniz.", "menu");
        return;
    }

    bakiye = bakiye + miktar;
    islemEkle("+ " + paraYaz(miktar) + " para yatırma");

    ekran.innerHTML = `
        <h2>İŞLEM BAŞARILI</h2>
        <p>${paraYaz(miktar)} hesabınıza yatırıldı.</p>
        <p>Yeni bakiye: <strong>${paraYaz(bakiye)}</strong></p>
        <button onclick="anaMenu()">Ana Menü</button>
    `;
}

function transferEkrani() {
    aktifIslem = "transfer";

    ekran.innerHTML = `
        <h2>PARA TRANSFERİ</h2>
        <input type="text" id="iban" placeholder="TR...">
        <input type="number" id="transfer-miktar" placeholder="Tutar">
        <button onclick="paraTransfer()">Transfer Et</button>
        <button onclick="anaMenu()">Geri</button>
    `;
}

function paraTransfer() {
    const iban = document.getElementById("iban").value.trim();
    const miktar = Number(document.getElementById("transfer-miktar").value);

    if (iban === "") {
        mesajGoster("Uyarı", "IBAN giriniz.", "menu");
        return;
    }

    if (miktar <= 0) {
        mesajGoster("Uyarı", "Geçerli bir tutar giriniz.", "menu");
        return;
    }

    if (miktar > bakiye) {
        mesajGoster("Yetersiz Bakiye", "Transfer için bakiyeniz yeterli değil.", "menu");
        return;
    }

    bakiye = bakiye - miktar;
    islemEkle("- " + paraYaz(miktar) + " transfer");

    ekran.innerHTML = `
        <h2>TRANSFER BAŞARILI</h2>
        <p>${paraYaz(miktar)} gönderildi.</p>
        <p>Yeni bakiye: <strong>${paraYaz(bakiye)}</strong></p>
        <button onclick="anaMenu()">Ana Menü</button>
    `;
}

function islemEkle(islem) {
    islemGecmisi.push(islem);
}

function islemGecmisiGoster() {
    let liste = "";

    if (islemGecmisi.length === 0) {
        liste = "<p>Henüz işlem yapılmadı.</p>";
    } else {
        for (let i = islemGecmisi.length - 1; i >= 0; i--) {
            liste += `<p class="islem">${islemGecmisi[i]}</p>`;
        }
    }

    ekran.innerHTML = `
        <h2>İŞLEM GEÇMİŞİ</h2>
        ${liste}
        <button onclick="anaMenu()">Ana Menü</button>
    `;
}

function miniEkstre() {
    let liste = "";
    let baslangic = islemGecmisi.length - 3;

    if (baslangic < 0) {
        baslangic = 0;
    }

    for (let i = baslangic; i < islemGecmisi.length; i++) {
        liste += `<p class="islem">${islemGecmisi[i]}</p>`;
    }

    if (liste === "") {
        liste = "<p>Henüz işlem yapılmadı.</p>";
    }

    ekran.innerHTML = `
        <h2>MİNİ EKSTRE</h2>
        <h1>${paraYaz(bakiye)}</h1>
        ${liste}
        <button onclick="anaMenu()">Ana Menü</button>
    `;
}

function pinDegistirEkrani() {
    ekran.innerHTML = `
        <h2>PIN DEĞİŞTİR</h2>
        <input type="password" id="eski-pin" maxlength="4" placeholder="Mevcut PIN">
        <input type="password" id="yeni-pin" maxlength="4" placeholder="Yeni PIN">
        <input type="password" id="yeni-pin-tekrar" maxlength="4" placeholder="Yeni PIN Tekrar">
        <button onclick="pinDegistir()">Değiştir</button>
        <button onclick="anaMenu()">Geri</button>
    `;
}

function pinDegistir() {
    const eskiPin = document.getElementById("eski-pin").value;
    const yeniPin = document.getElementById("yeni-pin").value;
    const tekrar = document.getElementById("yeni-pin-tekrar").value;

    if (eskiPin !== pin) {
        mesajGoster("Uyarı", "Mevcut PIN yanlış.", "menu");
        return;
    }

    if (yeniPin.length !== 4 || isNaN(yeniPin)) {
        mesajGoster("Uyarı", "Yeni PIN 4 rakamdan oluşmalıdır.", "menu");
        return;
    }

    if (yeniPin !== tekrar) {
        mesajGoster("Uyarı", "Yeni PIN'ler eşleşmiyor.", "menu");
        return;
    }

    pin = yeniPin;
    islemEkle("PIN değiştirildi");

    mesajGoster("Başarılı", "PIN başarıyla değiştirildi.", "menu");
}

function mesajGoster(baslik, mesaj, geriDonus) {
    ekran.innerHTML = `
        <h2>${baslik}</h2>
        <p>${mesaj}</p>
        <button id="geri-btn">Devam Et</button>
    `;

    document.getElementById("geri-btn").onclick = function () {
        if (geriDonus === "pin") {
            pinEkrani();
        } else {
            anaMenu();
        }
    };
}

function cikisYap() {
    ekran.innerHTML = `
        <h2>KART İADE EDİLDİ</h2>
        <p>İyi günler dileriz.</p>
        <button id="yeni-islem">Yeni İşlem</button>
    `;

    kart.classList.remove("kart-takili");
    kartTakili = false;

    document.getElementById("yeni-islem").onclick = baslangicEkrani;
}

kartYuvasi.addEventListener("click", function () {
    if (kartTakili === false) {
        kartTakili = true;
        kart.classList.add("kart-takili");
        pinEkrani();
    }
});

sayiTuslari.forEach(function (button) {

    button.addEventListener("click", function () {

        const tus = button.innerText.trim();

        // PIN ekranındaysak
        if (aktifIslem === "pin") {

            if (tus >= "0" && tus <= "9") {
                if (girilenPin.length < 4) {
                    girilenPin = girilenPin + tus;
                    pinGoster();
                }
            }

            if (tus === "←") {
                girilenPin = girilenPin.slice(0, -1);
                pinGoster();
            }

            if (tus === "✓") {
                pinKontrol();
            }

            return;
        }


        // Para çekme ve yatırma ekranındaysak
        const miktarInput = document.getElementById("miktar");

        if (miktarInput) {

            if (tus >= "0" && tus <= "9") {
                miktarInput.value = miktarInput.value + tus;
            }

            if (tus === "←") {
                miktarInput.value = miktarInput.value.slice(0, -1);
            }

            if (tus === "✓") {

                if (aktifIslem === "para-cek") {
                    paraCek();
                }

                if (aktifIslem === "para-yatir") {
                    paraYatir();
                }
            }
        }


        // Transfer tutarı
        if (aktifIslem === "transfer") {

            const transferInput =
                document.getElementById("transfer-miktar");

            if (transferInput) {

                if (tus >= "0" && tus <= "9") {
                    transferInput.value =
                        transferInput.value + tus;
                }

                if (tus === "←") {
                    transferInput.value =
                        transferInput.value.slice(0, -1);
                }

                if (tus === "✓") {
                    paraTransfer();
                }
            }
        }

    });

});

iptalTus.addEventListener("click", function () {
    if (kartTakili) {
        cikisYap();
    }
});

duzeltTus.addEventListener("click", function () {
    if (aktifIslem === "pin") {
        girilenPin = girilenPin.slice(0, -1);
        pinGoster();
    }
});

onayTus.addEventListener("click", function () {
    if (aktifIslem === "pin") {
        pinKontrol();
    }
});

para.addEventListener("click", function () {
    if (para.classList.contains("para-cikti")) {
        para.classList.remove("para-cikti");
        para.innerText = "💵";

        ekran.innerHTML = `
            <h2>PARA ALINDI</h2>
            <p>Paranızı aldınız.</p>
            <button onclick="anaMenu()">Ana Menü</button>
        `;
    }
});

baslangicEkrani();