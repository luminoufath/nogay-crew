 /* ─── DATA GALERI FOTO ─── */
    const galleryData = {
      'Nongki': [
        { img: 'img mk/mie/n1.jpeg', date: '02 Februari 2026' },
        { img: 'img mk/mie/n2.jpeg', date: '07 Februari 2026' },
        { img: 'img mk/mie/n3.jpeg', date: '08 Februari 2026' },
        { img: 'img mk/mie/n4.jpeg', date: '17 Januari 2026' }
      ],
      'Bandung': [
        { img: 'mabar1.jpg', date: '01 April 2026' },
        { img: 'mabar2.jpg', date: '05 April 2026' },
        { img: 'mabar2.jpg', date: '05 April 2026' },
        { img: 'mabar2.jpg', date: '05 April 2026' }
      ],
      'Jakarta': [
        { img: 'mabar1.jpg', date: '01 April 2026' },
        { img: 'mabar2.jpg', date: '05 April 2026' },
        { img: 'mabar2.jpg', date: '05 April 2026' },
        { img: 'mabar2.jpg', date: '05 April 2026' }
      ]
    };

    /* ─── FUNGSI MENU & GALERI ─── */
    function toggleMenu() {
      document.getElementById('side-menu').classList.toggle('open');
      document.getElementById('menu-overlay').classList.toggle('open');
      document.getElementById('menu-btn').classList.toggle('active');
    }

    // Fungsi untuk Dropdown/Accordion
    function toggleSubmenu(id) {
      const submenu = document.getElementById(id);
      const menuItem = submenu.previousElementSibling;
      submenu.classList.toggle('open');
      menuItem.classList.toggle('open');
    }

    function openGallery(momenId) {
      toggleMenu();
      const data = galleryData[momenId] || [];
      const grid = document.getElementById('gallery-grid');

      const titleFormat = momenId.charAt(0).toUpperCase() + momenId.slice(1);
      document.getElementById('gallery-title').innerHTML = `Momen: <span>${titleFormat}</span>`;

      grid.innerHTML = '';
      if (data.length === 0) {
        grid.innerHTML = '<p style="color:var(--sub); text-align:center; grid-column: 1 / -1;">Foto belum ditambahkan.</p>';
      } else {
        data.forEach((item, index) => {
          const animDelay = (index * 0.1) + 's';
          grid.innerHTML += `
          <div class="gallery-item" style="animation-delay: ${animDelay}">
            <img class="gallery-img" src="${item.img}" onerror="this.src='https://via.placeholder.com/400x300/141e2e/f0b429?text=Foto+Menyusul'" alt="Momen">
            <div class="gallery-date">${item.date}</div>
          </div>
        `;
        });
      }

      document.getElementById('gallery-page').classList.add('active');
      document.getElementById('main-page').style.opacity = '0';
      document.getElementById('main-page').style.pointerEvents = 'none';

      // Sembunyikan Tombol Mata agar tidak bentrok dengan tombol Back
      document.getElementById('domain-btn').style.opacity = '0';
      document.getElementById('domain-btn').style.pointerEvents = 'none';
    }

    function closeGallery() {
      document.getElementById('gallery-page').classList.remove('active');
      document.getElementById('main-page').style.opacity = '1';
      document.getElementById('main-page').style.pointerEvents = 'all';

      // Munculin lagi Tombol Mata
      document.getElementById('domain-btn').style.opacity = '1';
      document.getElementById('domain-btn').style.pointerEvents = 'all';
    }

    /* ─── ROULETTE LOGIC ─── */
    let options = [];
    let startAngle = 0;
    let spinTimeout = null;
    let spinTime = 0;
    let spinTimeTotal = 0;
    let isSpinning = false;
    let spinAngleStart = 0;

    function openRoulette() {
      toggleMenu();
      document.getElementById('roulette-page').classList.add('active');
      document.getElementById('main-page').style.opacity = '0';
      document.getElementById('main-page').style.pointerEvents = 'none';

      // Sembunyikan Tombol Mata
      document.getElementById('domain-btn').style.opacity = '0';
      document.getElementById('domain-btn').style.pointerEvents = 'none';
      drawWheel();
    }

    function closeRoulette() {
      document.getElementById('roulette-page').classList.remove('active');
      document.getElementById('main-page').style.opacity = '1';
      document.getElementById('main-page').style.pointerEvents = 'all';

      // Munculin lagi Tombol Mata
      document.getElementById('domain-btn').style.opacity = '1';
      document.getElementById('domain-btn').style.pointerEvents = 'all';
    }

    function getOptions() {
      const text = document.getElementById("roulette-input").value;
      options = text.split('\n').map(opt => opt.trim()).filter(opt => opt !== '');
      if (options.length === 0) options = ["Isi", "Dulu", "Opsi"];
    }

    function drawWheel() {
      getOptions();
      const canvas = document.getElementById("roulette-canvas");
      if (!canvas.getContext) return;
      const ctx = canvas.getContext("2d");
      const arc = Math.PI / (options.length / 2);

      ctx.clearRect(0, 0, 300, 300);
      for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;

        ctx.fillStyle = i % 2 === 0 ? "#141e2e" : "#f0b429";

        // Ubah warna roda juga kalau lagi mode Gojo
        if (document.body.classList.contains('gojo-mode')) {
          ctx.fillStyle = i % 2 === 0 ? "#050510" : "#00f2ff";
        }

        ctx.beginPath();
        ctx.arc(150, 150, 145, angle, angle + arc, false);
        ctx.arc(150, 150, 0, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = i % 2 === 0 ? "#f0b429" : "#141e2e";

        if (document.body.classList.contains('gojo-mode')) {
          ctx.fillStyle = i % 2 === 0 ? "#00f2ff" : "#050510";
        }

        ctx.translate(150 + Math.cos(angle + arc / 2) * 90, 150 + Math.sin(angle + arc / 2) * 90);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);

        const text = options[i];
        ctx.font = 'bold 16px Outfit';
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }
    }

    function rotateWheel() {
      spinTime += 30;
      if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
      }
      const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
      startAngle += (spinAngle * Math.PI / 180);
      drawWheel();
      spinTimeout = requestAnimationFrame(rotateWheel);
    }

    function stopRotateWheel() {
      cancelAnimationFrame(spinTimeout);
      const degrees = startAngle * 180 / Math.PI + 90;
      const arcd = 360 / options.length;
      let index = Math.floor((360 - degrees % 360) / arcd);

      const resultDiv = document.getElementById('roulette-result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `Terpilih: <br><span style="color:var(--gold);">${options[index]}</span>`;

      document.getElementById('spin-btn').disabled = false;
      document.getElementById('spin-btn').innerText = "SPIN LAGI";
      isSpinning = false;
    }

    function easeOut(t, b, c, d) {
      const ts = (t /= d) * t;
      const tc = ts * t;
      return b + c * (tc + -3 * ts + 3 * t);
    }

    function spin() {
      if (isSpinning) return;
      isSpinning = true;
      document.getElementById('spin-btn').disabled = true;
      document.getElementById('spin-btn').innerText = "MENENTUKAN...";
      document.getElementById('roulette-result').style.display = 'none';

      spinAngleStart = Math.random() * 10 + 10;
      spinTime = 0;
      spinTimeTotal = Math.random() * 3000 + 4000;
      rotateWheel();
    }

    document.getElementById('roulette-input').addEventListener('input', drawWheel);

    /* ─── MEMBERS DATA ─── */
    const members = [
      {
        id: 1,
        name: "Fathur",
        tagline: "The Artist & Gamer",
        hobbies: ["Menggambar", "Bermain Game"],
        desc: "Fathurahman adalah jiwa kreatif di balik No Gay Crew. Dengan tangan yang selalu siap menggambar dan mata yang tajam melihat dunia, ia menuangkan imajinasinya ke kanvas maupun layar game. Di antara semua anggota, dialah yang paling sering lupa tidur karena asik main game.",
        stats: [{ val: "∞", label: "Sketsa" }, { val: "GG", label: "Win Rate" }, { val: "#1", label: "Artist" }],
        img: "fat.png.jpeg"
      },
      {
        id: 2,
        name: "Izlal",
        tagline: "The Singer & Charmer",
        hobbies: ["Bernyanyi", "Menggoda Pria"],
        desc: "Izlal adalah bintang panggung No Gay Crew. Suaranya yang merdu mampu membunuh siapa saja yang mendengar, dan pesonanya tak tertandingi. Kalau ada yang meninggal mendadak di sekitar crew, hampir pasti Izlal ada di baliknya.",
        stats: [{ val: "🎵", label: "Hits" }, { val: "100%", label: "Pesona" }, { val: "✦", label: "Bintang" }],
        img: "iz.png.jpeg"
      },
      {
        id: 3,
        name: "Nabil",
        tagline: "The Singer & Comedian",
        hobbies: ["Bernyanyi", "Ngaloco"],
        desc: "Nabil adalah kombinasi unik antara seniman suara dan raja ngocok. Suaranya bisa bikin haru, tapi sekalinya mulai ngaloco, semua orang di sekitarnya dijamin sakit perut. Dia adalah mood booster resmi No Gay Crew.",
        stats: [{ val: "🎤", label: "Vokal" }, { val: "XD", label: "Humor" }, { val: "TOP", label: "Vibes" }],
        img: "edi.png.jpeg"
      },
      {
        id: 4,
        name: "Dean",
        tagline: "The Storyteller",
        hobbies: ["Bercerita", "Gosip"],
        desc: "Dean adalah ensiklopedia hidup No Gay Crew. Tidak ada satu cerita pun yang luput dari ingatannya. Mulai dari bintang porno, hingga gosip terhangat yang baru terjadi 5 menit lalu — Dean sudah tahu semuanya dan siap bercerita.",
        stats: [{ val: "📖", label: "Cerita" }, { val: "HOT", label: "Gosip" }, { val: "🗣️", label: "Orator" }],
        img: "dean.jpeg"
      },
      {
        id: 5,
        name: "Januar",
        tagline: "The Warrior & Athlete",
        hobbies: ["Silat", "Olahraga"],
        desc: "Januar adalah tulang punggung fisik No Gay Crew. Dengan disiplin silat PSHT dan dedikasi olahraga setiap hari, dia adalah yang paling sigma di antara semua anggota. Jangan macam-macam, karena Januar siap ciat ciattt.",
        stats: [{ val: "🥋", label: "Sabuk" }, { val: "FIT", label: "Kondisi" }, { val: "💪", label: "Otot" }],
        img: "janu.png.jpeg"
      },
      {
        id: 6,
        name: "Amba (BOT)",
        tagline: "The brain & worker",
        hobbies: ["Babu", "Pembantu"],
        desc: "Babu grup Wacana, Amba merupakan sosok penolong pada grup ini dia akan menolong siapa saja yang membutuhkan bantuan,mulai dari bantuan merodok hingga yang lainnya.",
        stats: [{ val: "💧", label: "Ambasing" }, { val: "Strong", label: "Kondisi" }, { val: "💪", label: "Otot" }],
        img: "ambaa.png"
      }
    ];

    /* ─── BUILD CARDS ─── */
    const row = document.getElementById('members-row');
    members.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
      <div class="card-img-wrap">
        <span class="card-number">0${m.id}</span>
        <img src="${m.img}" onerror="this.src='https://via.placeholder.com/300x400/141e2e/f0b429?text=${m.name}'" alt="${m.name}" loading="lazy"/>
      </div>
      <div class="card-info">
        <div class="card-name">${m.name}</div>
        <div class="card-hobby-label">Hobi</div>
        <div class="card-hobby">${m.hobbies.join(' · ')}</div>
        <div class="card-cta">
          Lihat Profil
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    `;
      card.addEventListener('click', () => openDetail(i));
      row.appendChild(card);
    });

    /* ─── BUILD NAV DOTS ─── */
    const dotsEl = document.getElementById('nav-dots');
    members.forEach((m, i) => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot';
      dot.title = m.name;
      dot.addEventListener('click', () => openDetail(i));
      dotsEl.appendChild(dot);
    });

    let currentIndex = 0;

    function openDetail(index) {
      currentIndex = index;
      const m = members[index];
      const content = document.getElementById('detail-content');

      // Aktifkan transisi zoom dan blur ke background
      document.body.classList.add('domain-expanding');

      content.innerHTML = `
      <div class="detail-img-side">
        <div class="detail-img-frame">
          <img src="${m.img}" onerror="this.src='https://via.placeholder.com/300x400/141e2e/f0b429?text=${m.name}'" alt="${m.name}"/>
        </div>
        <div class="detail-accent"></div>
        <div class="detail-badge">${m.tagline}</div>
      </div>
      <div class="detail-text-side">
        <div class="detail-number">0${m.id}</div>
        <div class="detail-name">${m.name}</div>
        <div class="detail-tagline">✦ ${m.tagline} ✦</div>
        <div class="detail-divider"></div>

        <div class="detail-section-label">Hobi & Keahlian</div>
        <div class="detail-hobbies">
          ${m.hobbies.map(h => `<span class="hobby-tag">${h}</span>`).join('')}
        </div>

        <div class="detail-section-label">Tentang ${m.name}</div>
        <p class="detail-desc">${m.desc}</p>

        <div class="detail-stats">
          ${m.stats.map(s => `
            <div class="stat-item">
              <div class="stat-val">${s.val}</div>
              <div class="stat-label">${s.label}</div>
            </div>`).join('')}
        </div>
      </div>
    `;

      document.querySelectorAll('.nav-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });

      document.getElementById('detail-page').classList.add('active');
      document.getElementById('back-btn').classList.add('visible');
      document.getElementById('nav-dots').classList.add('visible');

      // Sembunyikan Tombol Mata
      document.getElementById('domain-btn').style.opacity = '0';
      document.getElementById('domain-btn').style.pointerEvents = 'none';
    }

    function closeDetail() {
      // Matikan efek transisi zoom dan blur
      document.body.classList.remove('domain-expanding');

      document.getElementById('detail-page').classList.remove('active');
      document.getElementById('back-btn').classList.remove('visible');
      document.getElementById('nav-dots').classList.remove('visible');

      // Munculin lagi Tombol Mata
      document.getElementById('domain-btn').style.opacity = '1';
      document.getElementById('domain-btn').style.pointerEvents = 'all';
    }

    // Keyboard nav
    document.addEventListener('keydown', e => {
      const dp = document.getElementById('detail-page');
      if (dp.classList.contains('active')) {
        if (e.key === 'ArrowRight') openDetail((currentIndex + 1) % members.length);
        if (e.key === 'ArrowLeft') openDetail((currentIndex - 1 + members.length) % members.length);
        if (e.key === 'Escape') closeDetail();
      }

      const gp = document.getElementById('gallery-page');
      if (gp.classList.contains('active') && e.key === 'Escape') closeGallery();

      const rp = document.getElementById('roulette-page');
      if (rp.classList.contains('active') && e.key === 'Escape') closeRoulette();
    });

    /* ─── PARTICLE CANVAS ─── */
    (function () {
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let W, H, particles = [];
      const COUNT = 80;

      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }

      class Particle {
        constructor() { this.reset(); }
        reset() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.r = Math.random() * 1.5 + 0.3;
          this.vx = (Math.random() - 0.5) * 0.3;
          this.vy = (Math.random() - 0.5) * 0.3;
          this.alpha = Math.random() * 0.4 + 0.05;
          this.color = Math.random() > 0.7 ? '#f0b429' : '#ffffff';
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
          ctx.save();
          ctx.globalAlpha = this.alpha;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Particle());
      }

      function drawLines() {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.save();
              ctx.globalAlpha = (1 - dist / 100) * 0.08;
              ctx.strokeStyle = '#f0b429';
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(loop);
      }

      window.addEventListener('resize', () => { resize(); });
      init();
      loop();
    })();

    /* ─── LOGIC OPENING GOJO & SCANNER (FITUR 1) ─── */
    const splashVideo = document.getElementById('gojo-video');
    const splashScreen = document.getElementById('splash-screen');
    const whiteFlash = document.querySelector('.white-flash');
    const mainPage = document.getElementById('main-page');

    // Variabel buat Scanner
    const scannerScreen = document.getElementById('scanner-screen');
    const scanTrigger = document.getElementById('scan-trigger');
    const scanProgress = document.getElementById('scan-progress');
    const scanStatus = document.getElementById('scan-status');

    let scanInterval;
    let progress = 0;

    // Sembunyikan main page saat awal
    mainPage.classList.add('hidden-opening');
    document.body.style.overflow = 'hidden';

    function endOpening() {
      setTimeout(() => {
        whiteFlash.classList.add('flash-active');

        setTimeout(() => {
          splashScreen.style.display = 'none';

          // Alih-alih masuk ke mainPage, kita tampilkan Biometric Scanner
          scannerScreen.style.display = 'flex';

        }, 600);
      }, 2500);
    }

    // Berhenti saat video selesai
    splashVideo.onended = () => {
      endOpening();
    };

    // Backup: Jika video gagal load/putar lebih dari 6 detik, masuk otomatis
    setTimeout(() => {
      if (splashScreen.style.display !== 'none') {
        endOpening();
      }
    }, 6000);

    /* ─── FUNGSI BIOMETRIC SCANNER (FITUR 1) ─── */
    function startScan() {
      scanTrigger.classList.add('scanning');
      scanStatus.innerText = "DECRYPTING...";
      scanStatus.style.color = "var(--cyan)";

      scanInterval = setInterval(() => {
        progress += 2;
        scanProgress.style.height = progress + "%";

        if (progress >= 100) {
          clearInterval(scanInterval);
          grantAccess();
        }
      }, 30);
    }

    function stopScan() {
      if (progress < 100) {
        clearInterval(scanInterval);
        scanTrigger.classList.remove('scanning');
        progress = 0;
        scanProgress.style.height = "0%";
        scanStatus.innerText = "ACCESS DENIED! HOLD TO SCAN";
        scanStatus.style.color = "red";
      }
    }

    function grantAccess() {
      scanStatus.innerText = "ACCESS GRANTED";
      scanStatus.style.color = "#00ff00";
      scanTrigger.style.borderColor = "#00ff00";

      // Efek transisi masuk ke web utama
      setTimeout(() => {
        scannerScreen.style.transition = "0.8s";
        scannerScreen.style.opacity = "0";
        scannerScreen.style.transform = "scale(1.2)";

        setTimeout(() => {
          scannerScreen.style.display = "none";
          mainPage.classList.remove('hidden-opening');
          mainPage.style.opacity = "1";
          document.body.style.overflow = "auto";
        }, 800);
      }, 500);
    }

    // Event Listener buat nahan tombol (Klik Mouse & Sentuh Layar HP)
    scanTrigger.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', stopScan);
    scanTrigger.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startScan();
    });
    window.addEventListener('touchend', stopScan);

    /* ─── LOGIC DOMAIN EXPANSION TOGGLE KIRI ATAS (FITUR 3) ─── */
    function triggerDomainExpansion() {
      const overlay = document.getElementById('domain-anim-overlay');
      const isGojoMode = document.body.classList.contains('gojo-mode');

      if (!isGojoMode) {
        // MENGAKTIFKAN DOMAIN EXPANSION
        overlay.classList.add('active'); // Munculin layar hitam animasi

        // Ganti warna saat animasi mencapai puncak ledakan (sekitar 1.8 detik)
        setTimeout(() => {
          document.body.classList.add('gojo-mode');

          // Kalau roulette lagi kebuka, redraw biar warnanya ikut ganti
          if (document.getElementById('roulette-page').classList.contains('active')) {
            drawWheel();
          }
        }, 1800);

        // Hilangkan overlay animasi
        setTimeout(() => {
          overlay.classList.remove('active');
        }, 3000);

      } else {
        // MENUTUP DOMAIN EXPANSION (Kembali Normal)
        document.body.classList.remove('gojo-mode');

        // Redraw roulette
        if (document.getElementById('roulette-page').classList.contains('active')) {
          drawWheel();
        }
      }
    }