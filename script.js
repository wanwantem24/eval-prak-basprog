function kembali(){
    document.getElementById("nim_sama").style.display = "none";
}

async function mulaiUjian(){

    localStorage.clear();
    localStorage.setItem("statusUjian", "aktif");

    let nama = document.getElementById("nama").value.trim();
    let nim = document.getElementById("nim").value.trim();

    if(nama==""){
        alert("Nama belum diisi");
        return;
    }

    if(nim==""){
        alert("NIM belum diisi");
        return;
    }

    document.getElementById("loading_mulai").style.display = "flex";

    // Cek apakah NIM sudah pernah ujian pada MK yang sama
    let hasil = await periksa(nama, nim);

    document.getElementById("loading_mulai").style.display = "none";

    if(hasil.trim() == "SUDAH"){
        //alert("Anda sudah pernah mengikuti ujian mata kuliah ini.");
        document.getElementById("nim_sama").style.display = "flex";
        return;
    }

    // Simpan ke localStorage jika belum pernah ujian
    localStorage.setItem("nama", nama);
    localStorage.setItem("nim", nim);

    let durasi = 26 * 60 * 1000;
    let waktuSelesai = Date.now() + durasi;
    localStorage.setItem("waktuSelesai", waktuSelesai);

    window.location.href = "soal.html";

}

async function periksa(nama, nim){

    let data = {
        nama: nama,
        nim: nim,
    };

    let response = await fetch("https://script.google.com/macros/s/AKfycbzOP_KRosPyOzx8ht4mzrk8SOA7vAhBWHQTO3nYM2bwLOd53hrWHirFfhp1IvhqqBMS4w/exec",{
        method: "POST",
        body: JSON.stringify(data)
    });

    let hasil = await response.text();

    return hasil;

}