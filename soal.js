
function cekStatus(){
    if(localStorage.getItem("statusUjian") !== "aktif"){
        window.location.replace("index.html");
    }
}

window.addEventListener("load", cekStatus);
window.addEventListener("pageshow", cekStatus);


function tampilnama(){
document.getElementById("namaMahasiswa").innerHTML = localStorage.getItem("nama");
}


function mulaiTimer(){

    let selesai = Number(localStorage.getItem("waktuSelesai"));

    setInterval(function(){

        let sisa = selesai - Date.now();

        if(sisa <= 0){

            koreksi();

            return;

        }

        let menit = Math.floor(sisa / 60000);

        let detik = Math.floor((sisa % 60000)/1000);

        if(detik < 10){

            detik = "0"+detik;

        }

        document.getElementById("timer").innerHTML =
        menit + ":" + detik;

    },1000);

}

function tampilkanSoal(){

    let html="";

    for(let i=0;i<bankSoal.length;i++){

        let gambar="";

        if(bankSoal[i].gambar){

            gambar=`
            <div style="text-align:center;margin:15px 0;">
                <img src="${bankSoal[i].gambar}" style="max-width:100%;max-height:300px;">
            </div>
            `;

        }

        html+=`

        <div class="card-soal">

            <h3>${i+1}. ${bankSoal[i].pertanyaan}</h3>

            ${gambar}

            <label>
                <input type="radio" name="soal${i}" value="0">
                ${bankSoal[i].pilihan[0]}
            </label><br>

            <label>
                <input type="radio" name="soal${i}" value="1">
                ${bankSoal[i].pilihan[1]}
            </label><br>

            <label>
                <input type="radio" name="soal${i}" value="2">
                ${bankSoal[i].pilihan[2]}
            </label><br>

            <label>
                <input type="radio" name="soal${i}" value="2">
                ${bankSoal[i].pilihan[3]}
            </label><br>

            <label>
                <input type="radio" name="soal${i}" value="3">
                ${bankSoal[i].pilihan[4]}
            </label>

        </div>

        `;

    }

    document.getElementById("tempatSoal").innerHTML=html;
    mulaiTimer();

}

tampilnama();
tampilkanSoal();
function konfirmasiKirim(){

    document.getElementById("modalKonfirmasi").style.display="flex";

}

function batalKirim(){

    document.getElementById("modalKonfirmasi").style.display="none";

}

async function koreksi(){

    document.getElementById("modalKonfirmasi").style.display="none";

    let benar = 0;

    for(let i=0; i<bankSoal.length; i++){

        let jawaban = document.querySelector('input[name="soal'+i+'"]:checked');

        if(jawaban){

            if(parseInt(jawaban.value) == bankSoal[i].jawaban){

                benar++;

            }

        }

    }

    let salah = bankSoal.length - benar;

    let nilai = benar / bankSoal.length * 100;

    localStorage.setItem("nilai", nilai);
    localStorage.setItem("benar", benar);
    localStorage.setItem("salah", salah);

    let kontri = document.getElementById("kontribusi").value.trim();
    let kontri_anggota = document.getElementById("kontri_anggota").value.trim();
    let nokontri_anggota = document.getElementById("nokontri_anggota").value.trim();

    let data = {
        nama: localStorage.getItem("nama"),
        nim: localStorage.getItem("nim"),
        nilai: nilai,
        benar: benar,
        salah: salah,
        tanggal: new Date().toLocaleString(),
        kontribusi: kontri,
        kontribusi_anggota: kontri_anggota,
        nokontribusi_anggota: nokontri_anggota

    };

    document.getElementById("loading_selesai").style.display = "flex";

    await fetch("https://script.google.com/macros/s/AKfycby2qB51BFH0FKxUhW7tGMTVNIEzjSvn8KNLzyrVfHrSCNqKkYlll9McggZqVl_gIZRJ/exec",{
        method:"POST",
        body:JSON.stringify(data)
    });

    document.getElementById("loading_selesai").style.display = "none";

    localStorage.setItem("statusUjian", "selesai");
    window.location.href = "hasil.html";

}

history.pushState(null, null, location.href);

window.addEventListener("popstate", function () {
    history.pushState(null, null, location.href);
    cekStatus();
});