/* ========================================
   MATERI PEMBELAJARAN - INTERACTIVE LOGIC
======================================== */

// Material Data
const materiData = {
  bab1: {
    title: "📖 Q.S. Al-Hujurat dan Keragaman",
    description: "Belajar membaca, memahami, dan meneladani pesan Q.S. Al-Hujurat ayat 13.",
    content: `
      <div class="materi-content">
        <h2>Q.S. Al-Hujurat Ayat 13</h2>
        <p>Allah menciptakan manusia berbeda suku, bangsa, dan budaya agar saling mengenal.</p>
        <h3>Pesan Utama</h3>
        <ul>
          <li>Manusia memiliki derajat yang sama di hadapan Allah.</li>
          <li>Yang paling mulia adalah orang yang paling bertakwa.</li>
          <li>Kita harus saling menghargai perbedaan.</li>
        </ul>
      </div>
    `,
    questions: 5
  },

  bab2: {
    title: "✨ Teladan Mulia Asmaulhusna",
    description: "Mengenal nama-nama Allah dan meneladaninya dalam kehidupan.",
    content: `
      <div class="materi-content">
        <h2>Asmaulhusna</h2>
        <p>Asmaulhusna adalah nama-nama Allah yang indah dan baik.</p>
        <ul>
          <li><strong>Al-Malik</strong>: Allah Maha Merajai.</li>
          <li><strong>Al-Aziz</strong>: Allah Maha Perkasa.</li>
          <li><strong>Al-Quddus</strong>: Allah Maha Suci.</li>
          <li><strong>As-Salam</strong>: Allah Maha Memberi Keselamatan.</li>
          <li><strong>Al-Mu'min</strong>: Allah Maha Memberi Keamanan.</li>
        </ul>
        <p>Kita dapat meneladani Asmaulhusna dengan berbuat baik, menjaga kebersihan, memberi rasa aman, dan tidak sombong.</p>
      </div>
    `,
    questions: 5
  },

  bab3: {
    title: "🤝 Saling Menghargai dalam Keragaman",
    description: "Belajar hidup rukun dengan orang yang berbeda.",
    content: `
      <div class="materi-content">
        <h2>Keragaman sebagai Sunnatullah</h2>
        <p>Keragaman adalah ketetapan Allah. Manusia berbeda suku, bahasa, budaya, dan agama.</p>
        <h3>Sikap yang Baik</h3>
        <ul>
          <li>Menghormati teman yang berbeda.</li>
          <li>Tidak mengejek agama, suku, atau budaya orang lain.</li>
          <li>Menolong siapa saja yang membutuhkan.</li>
          <li>Menjaga persatuan dan kerukunan.</li>
        </ul>
      </div>
    `,
    questions: 5
  },

  bab4: {
    title: "🌱 Menyambut Usia Balig",
    description: "Memahami tanda-tanda balig dan kewajiban setelah balig.",
    content: `
      <div class="materi-content">
        <h2>Apa Itu Balig?</h2>
        <p>Balig adalah masa ketika seorang anak mulai memasuki usia dewasa menurut ajaran Islam.</p>
        <h3>Tanda-Tanda Balig</h3>
        <ul>
          <li>Mengalami perubahan fisik.</li>
          <li>Mulai bertanggung jawab atas perbuatan sendiri.</li>
          <li>Wajib melaksanakan ibadah seperti salat dan puasa.</li>
        </ul>
        <p>Setelah balig, seorang muslim harus semakin rajin beribadah dan menjaga akhlak.</p>
      </div>
    `,
    questions: 5
  },

  bab5: {
    title: "🕌 Kisah Hijrah Nabi Muhammad saw.",
    description: "Mengenal perjalanan hijrah Nabi Muhammad saw. ke Madinah.",
    content: `
      <div class="materi-content">
        <h2>Hijrah ke Madinah</h2>
        <p>Nabi Muhammad saw. berhijrah dari Makkah ke Madinah karena dakwah Islam mendapat banyak gangguan.</p>
        <h3>Hikmah Hijrah</h3>
        <ul>
          <li>Berani berjuang demi kebaikan.</li>
          <li>Sabar menghadapi kesulitan.</li>
          <li>Bertawakal kepada Allah.</li>
          <li>Menjaga persaudaraan sesama muslim.</li>
        </ul>
      </div>
    `,
    questions: 5
  },

  bab6: {
    title: "📜 Q.S. At-Tin dan Silaturahmi",
    description: "Belajar pesan Q.S. At-Tin dan pentingnya silaturahmi.",
    content: `
      <div class="materi-content">
        <h2>Q.S. At-Tin</h2>
        <p>Surah At-Tin mengajarkan bahwa manusia diciptakan Allah dalam bentuk yang sebaik-baiknya.</p>
        <h3>Pesan Penting</h3>
        <ul>
          <li>Bersyukur atas ciptaan Allah.</li>
          <li>Menjaga iman dan amal saleh.</li>
          <li>Mempererat silaturahmi dengan keluarga dan teman.</li>
        </ul>
      </div>
    `,
    questions: 5
  },

  bab7: {
    title: "🕋 Beriman kepada Rasul Allah",
    description: "Mengenal makna iman kepada rasul-rasul Allah.",
    content: `
      <div class="materi-content">
        <h2>Iman kepada Rasul</h2>
        <p>Beriman kepada rasul berarti percaya bahwa Allah mengutus para rasul untuk membimbing manusia.</p>
        <h3>Sifat Rasul</h3>
        <ul>
          <li><strong>Siddiq</strong>: benar.</li>
          <li><strong>Amanah</strong>: dapat dipercaya.</li>
          <li><strong>Tablig</strong>: menyampaikan wahyu.</li>
          <li><strong>Fatanah</strong>: cerdas.</li>
        </ul>
      </div>
    `,
    questions: 5
  },

  bab8: {
    title: "😊 Aku Anak Saleh",
    description: "Belajar menjadi anak yang sopan, jujur, dan suka menolong.",
    content: `
      <div class="materi-content">
        <h2>Ciri Anak Saleh</h2>
        <p>Anak saleh adalah anak yang taat kepada Allah, hormat kepada orang tua, dan berbuat baik kepada sesama.</p>
        <ul>
          <li>Mengucapkan salam.</li>
          <li>Suka menolong orang lain.</li>
          <li>Berkata jujur.</li>
          <li>Menjauhi sifat munafik.</li>
        </ul>
      </div>
    `,
    questions: 5
  },

  bab9: {
    title: "🙏 Salat Jumat, Duha, dan Tahajud",
    description: "Mengenal beberapa salat dalam ajaran Islam.",
    content: `
      <div class="materi-content">
        <h2>Macam-Macam Salat</h2>
        <ul>
          <li><strong>Salat Jumat</strong>: salat wajib bagi laki-laki muslim pada hari Jumat.</li>
          <li><strong>Salat Duha</strong>: salat sunah yang dikerjakan pada pagi hari.</li>
          <li><strong>Salat Tahajud</strong>: salat sunah yang dikerjakan pada malam hari setelah tidur.</li>
        </ul>
        <p>Salat melatih kita menjadi disiplin, sabar, dan dekat kepada Allah.</p>
      </div>
    `,
    questions: 5
  },

  bab10: {
    title: "🌆 Nabi Muhammad saw. Membangun Madinah",
    description: "Belajar teladan Nabi Muhammad saw. dalam membangun masyarakat.",
    content: `
      <div class="materi-content">
        <h2>Membangun Kota Madinah</h2>
        <p>Setelah hijrah, Nabi Muhammad saw. membangun masyarakat Madinah dengan penuh kasih sayang dan persaudaraan.</p>
        <h3>Teladan Nabi</h3>
        <ul>
          <li>Membangun masjid sebagai pusat ibadah.</li>
          <li>Mempersaudarakan kaum Muhajirin dan Ansar.</li>
          <li>Menjaga kerukunan antarumat.</li>
          <li>Mengajarkan hidup damai dan saling membantu.</li>
        </ul>
      </div>
    `,
    questions: 5
  }
};

// Category Tab Switching
const categoryTabs = document.querySelectorAll('.tab-btn');
categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.category-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        const category = tab.getAttribute('data-category');
        document.getElementById(category).classList.add('active');
    });
});

// Open Material Detail
function openMateri(materiId) {
    if (!materiId) {
        showError('ID materi tidak valid!');
        return;
    }
    
    const materi = materiData[materiId];
    if (!materi) {
        showError('Materi belum tersedia!');
        return;
    }
    
    const modal = document.getElementById('materiModal');
    const materiContent = document.getElementById('materiContent');
    
    if (!modal || !materiContent) {
        console.error('Modal elements not found');
        return;
    }
    
    materiContent.innerHTML = `
        <h1>${materi.title}</h1>
        <p class="materi-desc">${materi.description}</p>
        ${materi.content}
        <div class="materi-actions">
            <button class="btn btn-success" onclick="completeMateri('${materiId}')">✓ Selesai</button>
            <button class="btn btn-primary" onclick="goToQuiz('${materiId}')">Latihan Soal →</button>
        </div>
    `;
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Track that user started this material
    trackMaterialView(materiId);
}

// Close Modal
const closeButtons = document.querySelectorAll('.close');
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
    });
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
        e.target.style.display = 'none';
    }
});

// Complete Material
async function addXP(userId, amount) {
    console.log('XP ditambahkan:', userId, amount);

    const xpRef = firebase.database().ref('xp/' + userId);

    const snapshot = await xpRef.once('value');
    const data = snapshot.val() || { total: 0 };

    console.log('XP lama:', data.total);

    await xpRef.set({
        total: (data.total || 0) + amount
    });

    console.log('XP baru:', (data.total || 0) + amount);
}
async function completeMateri(materiId) {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        await updateProgress(userId, materiId, 100);

        // Tambah XP otomatis saat materi selesai
        await addXP(userId, 50);

        showNotification('Materi berhasil diselesaikan! 🎉 +50 XP', 'success');
        
        updateMaterialProgress(materiId, 100);
        
        document.getElementById('materiModal').style.display = 'none';
    } catch (error) {
        console.error('Error completing material:', error);
        showNotification('Gagal menyimpan progress!', 'error');
    }
}

// Go to Quiz
function goToQuiz(materiId) {
    window.location.href = `kuis.html?topic=${materiId}`;
}

// Track Material View
async function trackMaterialView(materiId) {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        const progressSnapshot = await progressRef.child(userId).child(materiId).once('value');
        const currentProgress = progressSnapshot.val();
        
        if (!currentProgress || currentProgress.progress < 50) {
            await updateProgress(userId, materiId, 50);
            updateMaterialProgress(materiId, 50);
        }
    } catch (error) {
        console.error('Error tracking material view:', error);
    }
}

// Update Material Progress in UI
function updateMaterialProgress(materiId, progress) {
    const card = document.querySelector(`[data-topic="${materiId}"]`);
    if (card) {
        const progressFill = card.querySelector('.progress-fill');
        const progressText = card.querySelector('.progress-text');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}% selesai`;
    }
}

// Load User Progress on Page Load
async function loadMaterialProgress() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    try {
        const snapshot = await progressRef.child(userId).once('value');
        const progressData = snapshot.val() || {};
        
        Object.keys(progressData).forEach(materiId => {
            const progress = progressData[materiId].progress || 0;
            updateMaterialProgress(materiId, progress);
        });
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Initialize on page load
if (window.location.pathname.includes('materi.html')) {
    auth.onAuthStateChanged(user => {
        if (user) {
            loadMaterialProgress();
        }
    });
}

// Materi module initialized