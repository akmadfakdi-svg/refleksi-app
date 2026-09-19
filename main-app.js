window.WEB_APP_URL="https://script.google.com/macros/s/AKfycbxQr552AhiEq2F_r4TfjWG0XaPBOKRWaN92fj2eNgUtfpnawHbJe8TfMRjxEtIzwn_aTw/exec";
window.HariPria = {"1":"Minggu","2":"Senin","3":"Selasa","4":"Rabu","5":"Kamis","6":"Jumat","7":"Sabtu"};
window.HariWanita = {"1":"Kamis","2":"Jumat", 
"3":"Sabtu","4":"Minggu","5":"Senin","6":"Selasa","7":"Rabu"};
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("copy",e=>e.preventDefault());
document.addEventListener("cut",e=>e.preventDefault());
function switchTab(t) {
  const e = t === 'refleksi';
  const secRef = document.getElementById('section-refleksi');
  const secPas = document.getElementById('section-pasangan');
  const tabRef = document.getElementById('tab-refleksi');
  const tabPas = document.getElementById('tab-pasangan');
  secRef.classList.toggle('hidden', !e);
  secPas.classList.toggle('hidden', e);
  const activeSec = e ? secRef : secPas;
  activeSec.classList.remove('animate-fade-in');
  void activeSec.offsetWidth;
  activeSec.classList.add('animate-fade-in');
  tabRef.classList.toggle('active', e);
  tabPas.classList.toggle('active', !e);
  document.getElementById('hasilContainer').classList.add('hidden');
  document.getElementById('boxError').classList.add('hidden');
}
function tampilkanError(t) {
  setLoading(false);
  const e = document.getElementById('boxError'), n = document.getElementById('pesanError');
  n.textContent = t;
  e.classList.remove('hidden');
  document.getElementById('hasilContainer').classList.add('hidden');
}
function tutupError() {
  document.getElementById('boxError').classList.add('hidden');
}
function setLoading(t) {
  const btnRefleksi = document.getElementById('btn-proses-refleksi') || document.querySelector('#section-refleksi .btn-primary');
  const btnPasangan = document.getElementById('btn-proses-pasangan') || document.querySelector('#section-pasangan .btn-primary');
  document.getElementById('loading').classList.toggle('hidden', !t);
  if (btnRefleksi) btnRefleksi.disabled = t;
  if (btnPasangan) btnPasangan.disabled = t;
  if (t) {
    document.getElementById('hasilContainer').classList.add('hidden');
    document.getElementById('boxError').classList.add('hidden');
  }
}
function filterInputRealtime(t) {
  let e = t.value;
  e = e.replace(/[^a-wyzA-WYZ\s]/g, '');
  e = e.replace(/\s+/g, ' ');
  let n = e.split(' ');
  if (n.length > 5) {
    n = n.slice(0, 5);
  }
  const maxKarakterPerKata = 20;
  n = n.map(kata => kata.length > maxKarakterPerKata ? kata.substring(0, maxKarakterPerKata) : kata);
  e = n.join(' ');
  if (t.value.endsWith(' ') && !e.endsWith(' ')) {
    e += ' ';
  }
  t.value = e.toUpperCase();
}
function validasiNama(a){if("string"!=typeof a||!a.trim())return{status:"error",valid:!1,inputBersih:a,pesan:"Input tidak valid: Teks tidak boleh kosong."};const b=a.trim().replace(/\s+/g," ");if(/[xX]/.test(b))return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Mengandung huruf X/x yang tidak diizinkan."};if(/\d/.test(b))return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Mengandung angka yang tidak diizinkan."};if(/[^a-zA-Z\s]/.test(b))return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Mengandung simbol, tanda petik, atau karakter khusus."};const c=b.split(" ");if(c.length>5)return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Jumlah kata tidak boleh lebih dari 5 kata."};for(let d of c){const e=d.length>25?d.substring(0,25):d;if(d.length<2||d.length>25)return{status:"error",valid:!1,inputBersih:b,pesan:`Input tidak valid: Kata '${e}' harus berpanjang antara 2 hingga 25 karakter.`};if(2===d.length&&!/[aeiouAEIOU]/i.test(d))return{status:"error",valid:!1,inputBersih:b,pesan:`Input tidak valid: Kata 2 karakter '${e}' tidak boleh berupa dua konsonan beruntun.`}}const f="[aeiouAEIOU]|(?:y|Y)(?=\\s|$)",g="[^aeiouAEIOU\\s]";if(/([^aeiouAEIOU\s])\1{2,}|([aeiouAEIOU])\2{2,}/i.test(b))return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Terdapat 3 atau lebih huruf identik berurutan."};if(new RegExp(`(?:${f}){3,}`,"i").test(b)){if(!new RegExp(`${g}(?:${f}){3,}${g}`,"i").test(b))return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Pola vokal beruntun tidak diapit konsonan (abnormal)."}}if(/(?:[b-df-hj-np-tv-z]|y(?!\s|$)){3,}/i.test(b)){const h=new RegExp(`(?:${f})(?:[b-df-hj-np-tv-z]|y(?!\\s|$)){3,4}(?:${f})`,"i").test(b),i=new RegExp(`(kh|dz|dj|sh|sy|th|ng|ny)[^aeiouAEIOU\\s]{0,2}(?:${f})`,"i").test(b);if(!h&&!i)return{status:"error",valid:!1,inputBersih:b,pesan:"Input tidak valid: Pola konsonan beruntun tidak valid (abnormal)."}}return{status:"success",valid:!0,inputBersih:b,pesan:"Input valid."}}
async function kirimRequest(t) {
  try {
    const e = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      mode: "cors",
      redirect: "follow",
      body: JSON.stringify(t)
    });
    const n = await e.text();
    let resData;
    try {
      resData = JSON.parse(n);
    } catch (err) {
      throw new Error("Server mengembalikan respons bukan JSON (kemungkinan crash script).");
    }
    if (resData.status === "error") {
      throw new Error(resData.pesan || "Terjadi kesalahan di server.");
    }
    return resData;
  } catch (t) {
    throw new Error('Gagal terhubung ke server: ' + t.message);
  }
}
function renderRefleksi(t) {
  setLoading(false);
  document.getElementById('boxError').classList.add('hidden');
  const e = t.profilNama, n = t.orientasiWetonProfesi, a = t.matriks3Angka;
  const totalNeptu = e.totalNeptu || 0;
  const indexHari = ((totalNeptu - 1) % 7) + 1;
  const hariLahir = t.jenisKelamin === 'pria' ? HariPria[indexHari] : HariWanita[indexHari];
  const labelGender = t.jenisKelamin === 'pria' ? 'Laki-laki' : 'Perempuan';
  const o = `
    <h2 class="section-title">Hasil Refleksi Nama</h2>
    <div class="refleksi-summary">
      <div>
        <p style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Nama Bersih (${labelGender})</p>
        <p style="font-weight: 700; font-size: 1.025rem; margin-top: 10px; text-transform: capitalize; 10px; color: #4338ca; letter-spacing: 0.025em;">${e.namaBersih}</p>
      </div>
      <div class="stat-grid-3">
        <div>
          <p style="font-size: 10px; color: #64748b; margin-bottom: 0.25rem;">Total Neptu</p>
          <span class="stat-box-white" style="color: #4f46e5;">${e.totalNeptu}</span>
        </div>
        <div>
          <p style="font-size: 10px; color: #64748b; margin-bottom: 0.25rem;">Total Suku Kata</p>
          <span class="stat-box-white" style="color: #334155;">${e.totalSukuKata}</span>
        </div>
        <div>
          <p style="font-size: 10px; color: #64748b; margin-bottom: 0.25rem;">Hari Lahir (Neptu)</p>
          <span class="stat-box-white" style="color: #334155;">${hariLahir}</span>
        </div>
      </div>
    </div>
  `,
  r = e.rincianKata.map(t => `<div style="display: flex; flex-wrap: wrap; gap: 0.375rem; align-items: center; justify-content: center; margin-bottom: 0.375rem;">${t.rincianSukuKata.map(t => `<span class="badge-tag">${t.teks.toUpperCase()} <span class="badge-val">${t.nilai}</span></span>`).join('')}</div>`).join(''),
  s = o + `
    <div style="margin-top: 1rem; background-color: #f8fafc; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
      <h3 style="font-weight: 600; color: #334155; font-size: 0.875rem; margin-bottom: 0.5rem; text-align: center;">Rincian Suku Kata & Nilai Beban</h3>
      ${r}
    </div>
  ` + `
    <div class="grid-responsive-2" style="margin-top: 1rem;">
      <div class="box-weton">
        <p style="font-size: 0.75rem; color: #d97706; font-weight: 600; text-transform: uppercase;">Weton</p>
        <h4 style="font-weight: 700; color: #78350f; font-size: 1.125rem; margin-top: 0.125rem;">${n.weton.nama}</h4>
        <p style="font-size: 0.75rem; color: rgba(180, 83, 9, 0.8); margin-top: 0.25rem;">${n.weton.ket}</p>
      </div>
      <div class="box-profesi">
        <p style="font-size: 0.75rem; color: #059669; font-weight: 600; text-transform: uppercase;">Profesi</p>
        <h4 style="font-weight: 700; color: #064e3b; font-size: 1.125rem; margin-top: 0.125rem;">${n.profesi.nama}</h4>
        <p style="font-size: 0.75rem; color: rgba(4, 120, 87, 0.8); margin-top: 0.25rem;">${n.profesi.ket}</p>
      </div>
    </div>
  `,
i = (t, e, n, a, borderYasin) => `
  <div class="card-box">
    <div class="card-header ${n}">
      <span style="color: #1e293b;">${t}</span>
      <span class="${a}" style="padding: 0.125rem 0.625rem; border-radius: 0.375rem; font-size: 0.75rem;">${e.key}</span>
    </div>
    <div class="card-body">
      <div>
        <p style="font-size: 0.75rem; color: #94a3b8; font-weight: 500;">Asmaul Husna</p>
        <p style="font-weight: 600; color: #1e293b;">${e.asmaulHusna}</p>
      </div>
      <div>
        <p style="font-size: 0.75rem; color: #94a3b8; font-weight: 500;">Yasin</p>
        <!-- Masukkan class ${borderYasin} di blockquote -->
        <blockquote class="blockquote-yasin ${borderYasin}">${e.yasin}</blockquote>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #f1f5f9; text-align: center;">
        <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 0.5rem;">
          <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Binatang</p>
          <p style="font-weight: 600; color: #1e293b; font-size: 0.75rem; margin-top: 0.125rem;">${e.binatang}</p>
        </div>
        <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 0.5rem;">
          <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Tokoh</p>
          <p style="font-weight: 600; color: #1e293b; font-size: 0.75rem; margin-top: 0.125rem;">${e.tokoh}</p>
        </div>
      </div>
    </div>
  </div>
`,
  l = s + `
    <div style="margin-top: 1.5rem; background-color: #f8fafc; padding: 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="font-weight: 700; color: #334155; font-size: 1rem;">Matriks Angka</h3>
        <span style="background-color: #e0e7ff; color: #4338ca; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">${t.narasiKey}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${i('NEPTU', a.neptu, 'header-emerald', 'badge-emerald', 'border-yasin-emerald')}
${i('TESEN', a.tesen, 'header-amber', 'badge-amber', 'border-yasin-amber')}
${i('PELARIAN', a.pelarian, 'header-rose', 'badge-rose', 'border-yasin-rose')}
      </div>
    </div>
    <div class="disclaimer-box">
      <b>Catatan Disclaimer:</b> Hasil refleksi ini didasarkan pada pembacaan karakter dan angka tradisional sebagai sarana introspeksi diri, bukan sebagai acuan mutlak masa depan.
    </div>
  `;

  const container = document.getElementById('hasilContainer');
  container.innerHTML = l;
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function renderPasangan(t) {
  setLoading(false);
  document.getElementById('boxError').classList.add('hidden');
  const e = t.pasangan, n = t.kalkulasi, a = t.analisis,
        hasilSisaHabis = ["Habis", "Sri", "Lungguh"],
        kategoriKecocokan = { "1": "Kebahagiaan", "2": "Kesedihan", "3": "Pertemuan", "4": "Perpisahan", "5": "Kemudahan", "6": "Kesulitan", "7": "Kesakitan", "8": "Kesehatan" },
        themeMap = {
          "1": { bg: "theme-1-bg", border: "theme-1-border", text: "theme-1-text", badge: "theme-1-badge", mainBg: "theme-1-mainbg", mainBorder: "theme-1-mainborder" },
          "2": { bg: "theme-2-bg", border: "theme-2-border", text: "theme-2-text", badge: "theme-2-badge", mainBg: "theme-2-mainbg", mainBorder: "theme-2-mainborder" },
          "3": { bg: "theme-3-bg", border: "theme-3-border", text: "theme-3-text", badge: "theme-3-badge", mainBg: "theme-3-mainbg", mainBorder: "theme-3-mainborder" },
          "4": { bg: "theme-4-bg", border: "theme-4-border", text: "theme-4-text", badge: "theme-4-badge", mainBg: "theme-4-mainbg", mainBorder: "theme-4-mainborder" },
          "5": { bg: "theme-5-bg", border: "theme-5-border", text: "theme-5-text", badge: "theme-5-badge", mainBg: "theme-5-mainbg", mainBorder: "theme-5-mainborder" },
          "6": { bg: "theme-6-bg", border: "theme-6-border", text: "theme-6-text", badge: "theme-6-badge", mainBg: "theme-6-mainbg", mainBorder: "theme-6-mainborder" },
          "7": { bg: "theme-7-bg", border: "theme-7-border", text: "theme-7-text", badge: "theme-7-badge", mainBg: "theme-7-mainbg", mainBorder: "theme-7-mainborder" },
          "8": { bg: "theme-8-bg", border: "theme-8-border", text: "theme-8-text", badge: "theme-8-badge", mainBg: "theme-8-mainbg", mainBorder: "theme-8-mainborder" }
        },

        o = (t, e, n, a) => `
        <div class="card-box">
          <div class="card-header ${n} ${a}" style="border-bottom: 1px solid #f1f5f9;">
            ${t}
          </div>
          <div class="card-body">
            <div>
              <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 500;">Nama</p>
              <p style="font-weight: 700; color: #1e293b; font-size: 1rem;">${e.nama}</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #f1f5f9; text-align: center;">
              <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 0.5rem;">
                <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Neptu</p>
                <p style="font-weight: 600; color: #1e293b; font-size: 0.75rem; margin-top: 0.125rem;">${e.neptu}</p>
              </div>
              <div style="background-color: #f8fafc; padding: 0.5rem; border-radius: 0.5rem;">
                <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase;">Hari Lahir (Neptu)</p>
                <p style="font-weight: 600; color: #1e293b; font-size: 0.75rem; margin-top: 0.125rem;">${e.hariLahir}</p>
              </div>
            </div>
            <div>
              <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 500; margin-bottom: 0.375rem;">${e.sukuKataList.length} Suku Kata</p>
              <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                ${e.sukuKataList.map(t => `<span style="background-color: #f1f5f9; padding: 0.25rem 0.625rem; border-radius: 0.375rem; border: 1px solid #e2e8f0; font-size: 0.75rem; font-weight: 600; color: #334155;">${t}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `,
      
      currentTheme = themeMap[String(n.kodeKecocokan)] || themeMap["1"],
      r = `
        <h2 class="section-title">Hasil Kecocokan Pasangan</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${o('Pria', e.pria, 'theme-3-mainbg', 'theme-3-text')}
          ${o('Wanita', e.wanita, 'theme-2-mainbg', 'theme-2-text')}
        </div>

        <div style="background-color: rgba(238, 242, 255, 0.6); padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #e0e7ff; margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
          <p style="font-size: 0.875rem; color: #4f46e5; text-transform: uppercase; font-weight: 700;">Statistik Kalkulasi</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.375rem; text-align: center;">
            <div style="background-color: #fff; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #e0e7ff; display: flex; flex-direction: column; justify-content: space-between;">
              <p style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Total Neptu Pasangan</p>
              <span style="font-size: 0.875rem; font-weight: 800; color: #4338ca; margin-top: 0.25rem;">${n.totalNeptuPasangan}</span>
            </div>
            <div style="background-color: #fff; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #e0e7ff; display: flex; flex-direction: column; justify-content: space-between;">
              <p style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Sisa Habis Ambil Tiga</p>
              <span style="font-size: 0.75rem; font-weight: 800; color: #d97706; margin-top: 0.25rem;">${n.sisaHabisAmbilTiga} <span style="font-weight: 500; font-size: 10px;">(${hasilSisaHabis[n.sisaHabisAmbilTiga]})</span></span>
            </div>
            <div style="background-color: #fff; padding: 0.5rem; border-radius: 0.5rem; border: 1px solid #e0e7ff; display: flex; flex-direction: column; justify-content: space-between;">
              <p style="font-size: 9px; color: #94a3b8; text-transform: uppercase; font-weight: 600;">Total Suku Kata Pasangan</p>
              <span style="font-size: 0.875rem; font-weight: 800; color: #334155; margin-top: 0.25rem;">${n.totalSukuKataGabungan}</span>
            </div>
          </div>
        </div>

        <div class="card-box" style="margin-top: 1rem;">
          <div style="background-color: #f1f5f9; padding: 0.625rem 1rem; font-weight: 700; font-size: 0.875rem; color: #334155; border-bottom: 1px solid #e2e8f0;">
            Daftar Kategori Kecocokan
          </div>
          <div class="kategori-grid">
            ${Object.entries(kategoriKecocokan).map(([k, v]) => {
              const isSelected = k === String(n.kodeKecocokan);
              const tStyle = themeMap[k];
              return `
                <div class="kategori-item ${isSelected ? `${tStyle.bg} ${tStyle.border}` : ''}" style="${isSelected ? 'border-width: 1px; border-style: solid;' : 'background-color: #f8fafc; border: 1px solid transparent;'}">
                  <span class="kategori-number ${isSelected ? tStyle.badge : ''}" style="${!isSelected ? 'background-color: #e2e8f0; color: #334155;' : ''}">${k}</span>
                  <span style="font-weight: ${isSelected ? '700' : '500'}; color: ${isSelected ? 'inherit' : '#334155'};" class="${isSelected ? tStyle.text : ''}">${v}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="${currentTheme.mainBg} ${currentTheme.mainBorder}" style="padding: 1rem; border-radius: 0.75rem; text-align: center; margin-top: 1rem; border-width: 1px; border-style: solid;">
          <p class="${currentTheme.text}" style="font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Kategori Kecocokan</p>
          <p class="${currentTheme.text}" style="font-size: 1.875rem; font-weight: 800; margin-top: 0.25rem;">${kategoriKecocokan[String(n.kodeKecocokan)]}</p>
          <p style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem;">Kode Kecocokan: <span style="font-weight: 700; color: #334155; font-size: 0.875rem;">${n.kodeKecocokan}</span></p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem;">
          <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h4 style="font-weight: 600; color: #334155; font-size: 0.875rem; margin-bottom: 0.25rem;">Dinamika Hubungan</h4>
            <p style="font-size: 0.875rem; color: #475569;">${a.dinamika}</p>
          </div>
          <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0;">
            <h4 style="font-weight: 600; color: #334155; font-size: 0.875rem; margin-bottom: 0.25rem;">Saran / Solusi</h4>
            <p style="font-size: 0.875rem; color: #475569;">${a.saran}</p>
          </div>
        </div>

        <div class="disclaimer-box">
          <b>Catatan Disclaimer:</b> Hasil analisis ini disusun berdasarkan metode tradisional (hitung-hitungan nama dan neptu) sebagai bentuk refleksi dan hiburan semata, bukan sebagai kepastian mutlak atas takdir hubungan.
        </div>
      `;
  
  const container = document.getElementById('hasilContainer');
  container.innerHTML = r;
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
async function jalankanPasangan() {
  const inputNamaPria = document.getElementById('inputNamaPria').value;
  const inputNamaWanita = document.getElementById('inputNamaWanita').value;
  const cekPria = validasiNama(inputNamaPria);
  if(!cekPria.valid) {
    tampilkanError("Nama Pria: " + cekPria.pesan);
    return;
  }
  const cekWanita = validasiNama(inputNamaWanita);
  if(!cekWanita.valid) {
    tampilkanError("Nama Wanita: " + cekWanita.pesan);
    return;
  }
  setLoading(true);
  try {
    const t = await kirimRequest({
      action: 'pasangan', 
      namaPria: cekPria.inputBersih, 
      namaWanita: cekWanita.inputBersih,
    });
    if(t.status === 'error'){
      throw new Error(t.pesan);
    }
    const neptuPria = t.pasangan.pria.neptu || 0;
    const neptuWanita = t.pasangan.wanita.neptu || 0;
    t.kalkulasi.totalNeptuPasangan = neptuPria + neptuWanita;
    t.kalkulasi.sisaHabisAmbilTiga = t.kalkulasi.totalNeptuPasangan % 3;
    renderPasangan(t);
  } catch (err) {
    try {
      const hasilLokal = prosesKecocokanPasangan(
        cekPria.inputBersih, 
        cekWanita.inputBersih, 
      );
      const neptuPria = hasilLokal.pasangan.pria.neptu || 0;
      const neptuWanita = hasilLokal.pasangan.wanita.neptu || 0;
      hasilLokal.kalkulasi.totalNeptuPasangan = neptuPria + neptuWanita;
      hasilLokal.kalkulasi.sisaHabisAmbilTiga = hasilLokal.kalkulasi.totalNeptuPasangan % 3;
        renderPasangan(hasilLokal);
    } catch (localErr) {
      tampilkanError("Layanan online dan kalkulasi lokal gagal: " + localErr.message);
    }
  }
}
async function jalankanRefleksi() {
  const inputNama = document.getElementById('inputNamaRefleksi').value;
  const e = validasiNama(inputNama);
  if(!e.valid){tampilkanError(e.pesan);return;}
  const genderSelected = document.querySelector('input[name="genderRefleksi"]:checked');if(!genderSelected){tampilkanError("Silakan pilih jenis kelamin terlebih dahulu.");return;}
  setLoading(true);
  try {
    const t = await kirimRequest({action:'refleksi', nama: e.inputBersih});
    if(t.status === 'error'){
      throw new Error(t.pesan);
    }
    t.jenisKelamin = genderSelected.value;
    renderRefleksi(t);
  } catch (err) {
    try {
      const hasilLokal = prosesRefleksiNama(e.inputBersih);
      hasilLokal.jenisKelamin=genderSelected.value;
      renderRefleksi(hasilLokal);
    } catch (localErr) {
      tampilkanError("Layanan online dan kalkulasi lokal gagal: " + localErr.message);
    }
  }
}
