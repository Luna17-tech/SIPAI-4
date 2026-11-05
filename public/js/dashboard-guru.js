/* ========================================
   DASHBOARD GURU - TEACHER MONITORING
   Student Progress Monitoring System
======================================== */

// Data siswa untuk pengurutan dashboard
let dashboardStudentsData = [];

// Urutan default
let studentSortMode = 'activity';

// ========================================
// LOAD DASHBOARD GURU
// ========================================
async function loadTeacherDashboard() {

    try {

        const usersSnapshot =
            await firebase.database()
                .ref('users')
                .once('value');

        const materiSnapshot =
            await firebase.database()
                .ref('materi-kelas4')
                .once('value');

        const allUsers =
            usersSnapshot.val() || {};

        const totalMateri =
            materiSnapshot.numChildren();


        // Ambil siswa saja
        const students =
            Object.entries(allUsers)

                .filter(([id, user]) =>
                    user.role === 'student' ||
                    user.role === 'siswa'
                )

                .map(([id, user]) => ({
                    id,
                    ...user
                }));


        const studentPromises =
            students.map(async student => {

                const [
                    progressSnapshot,
                    quizSnapshot,
                    xpSnapshot
                ] = await Promise.all([

                    firebase.database()
                        .ref(
                            'progress/' +
                            student.id
                        )
                        .once('value'),

                    firebase.database()
                        .ref(
                            'quiz-results/' +
                            student.id
                        )
                        .once('value'),

                    firebase.database()
                        .ref(
                            'xp/' +
                            student.id
                        )
                        .once('value')

                ]);


                const progressData =
                    progressSnapshot.val() || {};

                const materialProgress =
                    progressData.materi || {};

                const quizResults =
                    quizSnapshot.val() || {};

                const xpData =
                    xpSnapshot.val() || {};


                // ==========================
                // MATERI
                // ==========================

                const materials =
                    Object.values(
                        materialProgress
                    );

                const completedMaterials =
                    materials.filter(
                        item =>
                            item.completed === true
                    ).length;

                const viewedMaterials =
                    materials.filter(
                        item =>
                            item.lastViewedAt ||
                            item.completed
                    ).length;


                // ==========================
                // KUIS
                // ==========================

                const quizArray =
                    Object.values(
                        quizResults
                    );

                const completedQuizzes =
                    getUniqueQuizCount(
                        quizArray
                    );

                const avgScore =
                    quizArray.length > 0

                        ? Math.round(
                            quizArray.reduce(
                                (sum, quiz) =>
                                    sum +
                                    Number(
                                        quiz.score || 0
                                    ),
                                0
                            ) /
                            quizArray.length
                        )

                        : 0;


                // ==========================
                // XP
                // ==========================

                const totalXP =
                    typeof xpData === 'object'

                        ? Number(
                            xpData.total || 0
                        )

                        : Number(
                            xpData || 0
                        );


                // ==========================
                // AKTIVITAS TERAKHIR
                // ==========================

                const lastActive =
                    getLatestLearningActivity(
                        materialProgress,
                        quizArray
                    );


                return {

                    ...student,

                    completedMaterials,

                    viewedMaterials,

                    completedQuizzes,

                    avgScore,

                    totalXP,

                    totalMaterials:
                        totalMateri,

                    lastActive

                };

            });


        const studentsWithProgress =
            await Promise.all(
                studentPromises
            );

            // Simpan data siswa agar bisa diurutkan
            dashboardStudentsData =
                studentsWithProgress;


        updateOverallStats(
            studentsWithProgress
        );

        displayStudentTable(
            studentsWithProgress
        );

        displayTopPerformers(
            studentsWithProgress
        );

        displayRecentActivities(
            studentsWithProgress
        );


    } catch (error) {

        console.error(
            'Error loading teacher dashboard:',
            error
        );

    }
}

// ========================================
// HELPER MONITORING SISWA
// ========================================

// Hitung jumlah kuis yang berbeda
function getUniqueQuizCount(quizArray) {

    return new Set(

        quizArray
            .map(quiz =>
                quiz.quizId ||
                quiz.materiId ||
                quiz.quizType
            )
            .filter(Boolean)

    ).size;
}


// Cari aktivitas belajar terbaru
function getLatestLearningActivity(
    materialProgress,
    quizArray
) {

    const timestamps = [];


    // Aktivitas materi
    Object.values(
        materialProgress || {}
    ).forEach(item => {

        if (item.lastViewedAt) {
            timestamps.push(
                Number(item.lastViewedAt)
            );
        }

        if (item.completedAt) {
            timestamps.push(
                Number(item.completedAt)
            );
        }

        if (item.lastActivityAt) {
            timestamps.push(
                Number(item.lastActivityAt)
            );
        }

    });


    // Aktivitas kuis
    (quizArray || []).forEach(
        quiz => {

            if (quiz.timestamp) {
                timestamps.push(
                    Number(quiz.timestamp)
                );
            }

        }
    );


    if (timestamps.length === 0) {
        return 0;
    }


    return Math.max(
        ...timestamps
    );
}


// Cek apakah siswa aktif hari ini
function isActiveToday(timestamp) {

    if (!timestamp) {
        return false;
    }

    const aktivitas =
        new Date(timestamp);

    const hariIni =
        new Date();

    return (
        aktivitas.getFullYear() ===
            hariIni.getFullYear() &&

        aktivitas.getMonth() ===
            hariIni.getMonth() &&

        aktivitas.getDate() ===
            hariIni.getDate()
    );
}


// Format tanggal aktivitas
function formatAktivitas(timestamp) {

    if (!timestamp) {
        return 'Belum ada aktivitas';
    }

    return new Date(timestamp)
        .toLocaleString(
            'id-ID',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        );
}


// Level siswa berdasarkan XP
function getStudentLevel(totalXP) {

    const xp =
        Number(totalXP) || 0;

    if (xp >= 700) {
        return {
            level: 5,
            title: '👑 Bintang PAI'
        };
    }

    if (xp >= 450) {
        return {
            level: 4,
            title: '🕌 Santri Hebat'
        };
    }

    if (xp >= 250) {
        return {
            level: 3,
            title: '✨ Siswa Rajin'
        };
    }

    if (xp >= 100) {
        return {
            level: 2,
            title: '📖 Pelajar PAI'
        };
    }

    return {
        level: 1,
        title: '🌱 Pemula PAI'
    };
}


// Mengamankan teks dari Firebase
function safeGuruText(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function updateOverallStats(students) {

    const totalStudents =
        students.length;


    // Aktif karena kegiatan belajar,
    // bukan hanya login
    const activeToday =
        students.filter(
            student =>
                isActiveToday(
                    student.lastActive
                )
        ).length;


    const avgScore =
        students.length > 0

            ? Math.round(
                students.reduce(
                    (sum, student) =>
                        sum +
                        Number(
                            student.avgScore || 0
                        ),
                    0
                ) /
                students.length
            )

            : 0;


    const totalCompleted =
        students.reduce(
            (sum, student) =>
                sum +
                student.completedMaterials,
            0
        );


    const totalMaterials =
        students.reduce(
            (sum, student) =>
                sum +
                student.totalMaterials,
            0
        );


    const completionRate =
        totalMaterials > 0

            ? Math.round(
                (
                    totalCompleted /
                    totalMaterials
                ) * 100
            )

            : 0;


    const setText =
        (id, value) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.textContent =
                    value;
            }

        };


    setText(
        'totalStudents',
        totalStudents
    );

    setText(
        'totalSiswa',
        totalStudents
    );

    setText(
        'activeStudents',
        activeToday
    );

    setText(
        'avgScore',
        avgScore
    );

    setText(
        'completionRate',
        `${completionRate}%`
    );
}

// ========================================
// LOAD MATERI & SOAL KUIS SECARA DINAMIS
// ========================================

function loadDynamicContentStats() {

    const materiRef =
        firebase.database().ref('materi-kelas4');

    const kuisRef =
        firebase.database().ref('kuis-kelas4');


    // ========================================
    // HITUNG JUMLAH MATERI
    // ========================================

    materiRef.on('value', snapshot => {

        const totalMateri = snapshot.numChildren();

        const materiElement =
            document.getElementById('totalMateriAktif');

        if (materiElement) {
            materiElement.textContent = totalMateri;
        }

        console.log(
            '📚 Total materi aktif:',
            totalMateri
        );

    });


    // ========================================
    // HITUNG TOTAL SOAL DARI SEMUA KUIS
    // ========================================

    kuisRef.on('value', snapshot => {

        let totalSoal = 0;

        snapshot.forEach(quizSnapshot => {

            const quiz = quizSnapshot.val() || {};

            // Jika questions disimpan sebagai array
            if (Array.isArray(quiz.questions)) {

                totalSoal += quiz.questions
                    .filter(question => question != null)
                    .length;

            }

            // Jika questions disimpan sebagai object
            else if (
                quiz.questions &&
                typeof quiz.questions === 'object'
            ) {

                totalSoal +=
                    Object.keys(quiz.questions).length;

            }

            // Cadangan jika questions tidak tersedia
            else if (
                typeof quiz.totalSoal === 'number'
            ) {

                totalSoal += quiz.totalSoal;

            }

        });


        const soalElement =
            document.getElementById('totalSoalKuis');

        if (soalElement) {
            soalElement.textContent = totalSoal;
        }


        console.log(
            '🎯 Total soal kuis:',
            totalSoal
        );

    });

}

// ========================================
// URUTKAN DAFTAR SISWA
// ========================================
function sortStudents(
    students,
    mode = 'activity'
) {

    return [...students].sort(
        (a, b) => {

            const activeA =
                isActiveToday(
                    a.lastActive
                );

            const activeB =
                isActiveToday(
                    b.lastActive
                );


            const scoreA =
                Number(
                    a.avgScore || 0
                );

            const scoreB =
                Number(
                    b.avgScore || 0
                );


            const viewedA =
                Number(
                    a.viewedMaterials || 0
                );

            const viewedB =
                Number(
                    b.viewedMaterials || 0
                );


            const completedA =
                Number(
                    a.completedMaterials || 0
                );

            const completedB =
                Number(
                    b.completedMaterials || 0
                );


            const timeA =
                Number(
                    a.lastActive || 0
                );

            const timeB =
                Number(
                    b.lastActive || 0
                );


            const nameA =
                String(
                    a.name ||
                    a.email ||
                    ''
                ).toLowerCase();

            const nameB =
                String(
                    b.name ||
                    b.email ||
                    ''
                ).toLowerCase();


            // ====================================
            // URUT BERDASARKAN SKOR
            // ====================================

            if (mode === 'score') {

                // Skor tertinggi
                if (scoreA !== scoreB) {
                    return scoreB - scoreA;
                }

                // Jika skor sama,
                // progress materi tertinggi
                if (completedA !== completedB) {
                    return completedB - completedA;
                }

                // Jika masih sama,
                // aktivitas terbaru
                return timeB - timeA;
            }

            // ====================================
            // URUT BERDASARKAN PROGRESS MATERI
            // ====================================

            if (mode === 'progress') {

                // Materi selesai terbanyak
                if (completedA !== completedB) {
                    return completedB - completedA;
                }

                // Jika progress sama,
                // skor tertinggi
                if (scoreA !== scoreB) {
                    return scoreB - scoreA;
                }

                // Jika masih sama,
                // aktivitas terbaru
                return timeB - timeA;
            }


            // ====================================
            // URUT NAMA A-Z
            // ====================================

            if (mode === 'name') {

                return nameA.localeCompare(
                    nameB,
                    'id'
                );
            }


            // ====================================
            // DEFAULT: KEAKTIFAN
            // ====================================

            // Aktif hari ini paling atas
            if (activeA && !activeB) {
                return -1;
            }

            if (!activeA && activeB) {
                return 1;
            }


            // Aktivitas terbaru
            if (timeA !== timeB) {
                return timeB - timeA;
            }


            // Jika waktu sama,
            // skor tertinggi
            if (scoreA !== scoreB) {
                return scoreB - scoreA;
            }


            // Jika skor sama,
            // progress materi tertinggi
            if (completedA !== completedB) {
                return completedB - completedA;
            }


            // Terakhir nama A-Z
            return nameA.localeCompare(
                nameB,
                'id'
            );

        }
    );
}

// Display Student Table
function displayStudentTable(students) {

    const container =
        document.getElementById(
            'studentsList'
        );

    if (!container) return;

    const sortedStudents =
        sortStudents(
        students,
        studentSortMode
    );


    if (students.length === 0) {

        container.innerHTML = `
            <div class="modern-card">
                <p style="color:#718096;">
                    Belum ada siswa terdaftar
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        sortedStudents.map((student, index) => {

            const active =
                isActiveToday(
                    student.lastActive
                );

            const level =
                getStudentLevel(
                    student.totalXP
                );


            return `

                <div
                    class="modern-card student-card"
                    style="
                        display:grid;
                        grid-template-columns:
                            auto auto 1fr auto;
                        gap:24px;
                        align-items:center;
                    "
                >

                    <div style="
                        width:50px;
                        height:50px;
                        min-width:36px;
                        border-radius:50%;
                        background:#f1edff;
                        color:#6c55d9;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:20px;
                        font-weight:700;
                    ">
                        ${index + 1}
                    </div>

                    <div style="
                        width:60px;
                        height:60px;
                        border-radius:50%;
                        background:
                            var(--gradient-primary);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:28px;
                    ">
                        👦
                    </div>


                    <div>

                        <div style="
                            display:flex;
                            gap:10px;
                            align-items:center;
                            flex-wrap:wrap;
                            margin-bottom:4px;
                        ">

                            <h3 style="
                                font-family:'Fredoka',
                                sans-serif;
                                font-size:20px;
                                color:#2d3748;
                            ">
                                ${
                                    safeGuruText(
                                        student.name ||
                                        'Siswa'
                                    )
                                }
                            </h3>


                            <span style="
                                padding:4px 9px;
                                border-radius:20px;
                                font-size:11px;
                                font-weight:600;
                                background:
                                ${
                                    active
                                        ? '#c6f6d5'
                                        : '#edf2f7'
                                };
                                color:
                                ${
                                    active
                                        ? '#276749'
                                        : '#718096'
                                };
                            ">

                                ${
                                    active
                                        ? '🟢 Aktif Hari Ini'
                                        : '⚪ Tidak Aktif Hari Ini'
                                }

                            </span>

                        </div>


                        <p style="
                            color:#718096;
                            margin-bottom:8px;
                        ">
                            ${
                                safeGuruText(
                                    student.email ||
                                    '-'
                                )
                            }
                        </p>


                        <div style="
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                            margin-bottom:8px;
                        ">

                            <span
                                class="badge-modern"
                                style="
                                    background:
                                    var(--gradient-success);
                                    font-size:12px;
                                "
                            >
                                📚 Progress Materi:
                                ${student.completedMaterials}/
                                ${student.totalMaterials}
                            </span>

                            <span
                                class="badge-modern"
                                style="
                                    background:
                                    var(--gradient-warning);
                                    font-size:12px;
                                "
                            >
                                ⭐ Skor:
                                ${student.avgScore}
                            </span>


                            <span
                                class="badge-modern"
                                style="
                                    background:
                                    var(--gradient-info);
                                    font-size:12px;
                                "
                            >
                                🎯
                                ${student.completedQuizzes}
                                Kuis
                            </span>


                            <span
                                class="badge-modern"
                                style="
                                    background:#805ad5;
                                    font-size:12px;
                                    color:white;
                                "
                            >
                                🏅 Level
                                ${level.level}
                            </span>

                        </div>


                        <p style="
                            color:#a0aec0;
                            font-size:12px;
                        ">
                            Aktivitas terakhir:
                            ${
                                formatAktivitas(
                                    student.lastActive
                                )
                            }
                        </p>

                    </div>


                    <button
                        onclick="
                            viewStudentDetail(
                                '${student.id}'
                            )
                        "
                        class="btn-modern btn-primary"
                        style="
                            padding:10px 20px;
                            font-size:14px;
                            border:none;
                            cursor:pointer;
                        "
                    >
                        Lihat Detail →
                    </button>

                </div>

            `;

        }).join('');
}

// Display Top Performers
function displayTopPerformers(students) {
    const container = document.getElementById('topPerformers');
    if (!container) return;
    
    const topStudents = students
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 5);
    
    if (topStudents.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Belum ada data</p></div>';
        return;
    }
    
    container.innerHTML = topStudents.map((student, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[index] || '🏅';
        
        return `
            <div class="top-performer-item">
                <span class="rank">${medal}</span>
                <div class="performer-info">
                    <strong>${student.name || student.email}</strong>
                    <span class="score">${student.avgScore} poin</span>
                </div>
            </div>
        `;
    }).join('');
}

// Display Recent Activities
function displayRecentActivities(students) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    const activities = students
        .filter(s => s.lastActive)
        .sort((a, b) => b.lastActive - a.lastActive)
        .slice(0, 10)
        .map(student => {
            const date = new Date(student.lastActive);
            const timeAgo = getTimeAgo(date);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">👨‍🎓</div>
                    <div class="activity-content">
                        <p><strong>${student.name || student.email}</strong> aktif belajar</p>
                        <span class="activity-time">${timeAgo}</span>
                    </div>
                </div>
            `;
        }).join('');
    
    container.innerHTML = activities || '<div class="empty-state"><p>Belum ada aktivitas</p></div>';
}

// View Student Detail (Modal)
async function viewStudentDetail(studentId) {

    try {

        const [
            userSnapshot,
            progressSnapshot,
            quizSnapshot,
            xpSnapshot,
            materiSnapshot
        ] = await Promise.all([

            firebase.database()
                .ref(
                    'users/' +
                    studentId
                )
                .once('value'),

            firebase.database()
                .ref(
                    'progress/' +
                    studentId
                )
                .once('value'),

            firebase.database()
                .ref(
                    'quiz-results/' +
                    studentId
                )
                .once('value'),

            firebase.database()
                .ref(
                    'xp/' +
                    studentId
                )
                .once('value'),

            firebase.database()
                .ref('materi-kelas4')
                .once('value')

        ]);


        const student =
            userSnapshot.val();

        if (!student) {

            alert(
                'Data siswa tidak ditemukan'
            );

            return;
        }


        const progressData =
            progressSnapshot.val() || {};

        const materialProgress =
            progressData.materi || {};

        const quizResults =
            quizSnapshot.val() || {};

        const xpData =
            xpSnapshot.val() || {};

        const materiMaster =
            materiSnapshot.val() || {};


        const materiEntries =
    Object.entries(
        materiMaster
    )
    .sort(
        ([idA], [idB]) => {

            const progressA =
                materialProgress[idA] || {};

            const progressB =
                materialProgress[idB] || {};


            const waktuA =
                Number(
                    progressA.lastViewedAt ||
                    progressA.completedAt ||
                    0
                );

            const waktuB =
                Number(
                    progressB.lastViewedAt ||
                    progressB.completedAt ||
                    0
                );


            // Materi terakhir digunakan
            // berada paling atas
            return waktuB - waktuA;
        }
    );


        const completedMaterials =
            materiEntries.filter(
                ([id]) =>
                    materialProgress[id]
                        ?.completed === true
            ).length;


        const viewedMaterials =
            materiEntries.filter(
                ([id]) => {

                    const progress =
                        materialProgress[id];

                    return Boolean(
                        progress?.lastViewedAt ||
                        progress?.completed
                    );

                }
            ).length;


        const totalMaterials =
            materiEntries.length;


        const progressPercent =
            totalMaterials > 0

                ? Math.round(
                    (
                        completedMaterials /
                        totalMaterials
                    ) * 100
                )

                : 0;


        const quizArray =
            Object.values(
                quizResults
            );


        const completedQuizzes =
            getUniqueQuizCount(
                quizArray
            );


        const avgScore =
            quizArray.length > 0

                ? Math.round(
                    quizArray.reduce(
                        (sum, quiz) =>
                            sum +
                            Number(
                                quiz.score || 0
                            ),
                        0
                    ) /
                    quizArray.length
                )

                : 0;


        const totalXP =
            typeof xpData === 'object'

                ? Number(
                    xpData.total || 0
                )

                : Number(
                    xpData || 0
                );


        const level =
            getStudentLevel(
                totalXP
            );


        const lastActive =
            getLatestLearningActivity(
                materialProgress,
                quizArray
            );


        const activeToday =
            isActiveToday(
                lastActive
            );


        const modal =
            document.getElementById(
                'studentModal'
            );

        const content =
            document.getElementById(
                'studentDetailContent'
            );


        if (!modal || !content) {
            return;
        }


        content.innerHTML = `

            <div class="student-detail">

                <!-- IDENTITAS SISWA -->

                <div style="
                    margin-bottom:24px;
                    padding-bottom:20px;
                    border-bottom:
                        1px solid #e2e8f0;
                ">

                    <h3 style="
                        font-family:'Fredoka',
                        sans-serif;
                        font-size:26px;
                        color:#2d3748;
                        margin-bottom:6px;
                    ">
                        👦
                        ${
                            safeGuruText(
                                student.name ||
                                student.email
                            )
                        }
                    </h3>


                    <p style="
                        color:#718096;
                        margin-bottom:10px;
                    ">
                        ${
                            safeGuruText(
                                student.email ||
                                '-'
                            )
                        }
                    </p>


                    <span style="
                        display:inline-block;
                        padding:6px 12px;
                        border-radius:20px;
                        background:
                            ${
                                activeToday
                                    ? '#c6f6d5'
                                    : '#edf2f7'
                            };
                        color:
                            ${
                                activeToday
                                    ? '#276749'
                                    : '#718096'
                            };
                        font-size:12px;
                        font-weight:600;
                    ">

                        ${
                            activeToday
                                ? '🟢 Aktif Belajar Hari Ini'
                                : '⚪ Belum Aktif Hari Ini'
                        }

                    </span>

                </div>


                <!-- STATISTIK -->

                <div style="
                    display:grid;
                    grid-template-columns:
                        repeat(
                            auto-fit,
                            minmax(145px,1fr)
                        );
                    gap:12px;
                    margin-bottom:28px;
                ">

                    <div
                        class="modern-card"
                        style="
                            padding:16px;
                            text-align:center;
                        "
                    >
                        <div style="font-size:25px;">
                            📅
                        </div>

                        <strong>
                            Aktivitas Terakhir
                        </strong>

                        <p style="
                            font-size:11px;
                            color:#718096;
                            margin-top:5px;
                        ">
                            ${
                                formatAktivitas(
                                    lastActive
                                )
                            }
                        </p>
                    </div>


                    <div
                        class="modern-card"
                        style="
                            padding:16px;
                            text-align:center;
                        "
                    >
                        <div style="font-size:25px;">
                            👀
                        </div>

                        <strong>
                            ${viewedMaterials}/
                            ${totalMaterials}
                        </strong>

                        <p style="
                            font-size:12px;
                            color:#718096;
                        ">
                            Materi Dibuka
                        </p>
                    </div>


                    <div
                        class="modern-card"
                        style="
                            padding:16px;
                            text-align:center;
                        "
                    >
                        <div style="font-size:25px;">
                            📚
                        </div>

                        <strong>
                            ${completedMaterials}/
                            ${totalMaterials}
                        </strong>

                        <p style="
                            font-size:12px;
                            color:#718096;
                        ">
                            Materi Selesai
                        </p>
                    </div>


                    <div
                        class="modern-card"
                        style="
                            padding:16px;
                            text-align:center;
                        "
                    >
                        <div style="font-size:25px;">
                            🎯
                        </div>

                        <strong>
                            ${completedQuizzes}
                        </strong>

                        <p style="
                            font-size:12px;
                            color:#718096;
                        ">
                            Kuis Dikerjakan
                        </p>
                    </div>


                    <div
                        class="modern-card"
                        style="
                            padding:16px;
                            text-align:center;
                        "
                    >
                        <div style="font-size:25px;">
                            ⭐
                        </div>

                        <strong>
                            ${totalXP} XP
                        </strong>

                        <p style="
                            font-size:12px;
                            color:#718096;
                        ">
                            Total XP
                        </p>
                    </div>


                    <div
                        class="modern-card"
                        style="
                            padding:16px;
                            text-align:center;
                        "
                    >
                        <div style="font-size:25px;">
                            🏅
                        </div>

                        <strong>
                            Level ${level.level}
                        </strong>

                        <p style="
                            font-size:12px;
                            color:#718096;
                        ">
                            ${level.title}
                        </p>
                    </div>

                </div>


                <!-- PROGRESS -->

                <div style="
                    margin-bottom:28px;
                ">

                    <div style="
                        display:flex;
                        justify-content:
                            space-between;
                        margin-bottom:8px;
                    ">

                        <strong>
                            📊 Progress Belajar
                        </strong>

                        <strong>
                            ${progressPercent}%
                        </strong>

                    </div>


                    <div style="
                        height:10px;
                        background:#edf2f7;
                        border-radius:20px;
                        overflow:hidden;
                    ">

                        <div style="
                            height:100%;
                            width:${progressPercent}%;
                            background:
                                linear-gradient(
                                    90deg,
                                    #667eea,
                                    #764ba2
                                );
                        ">
                        </div>

                    </div>

                </div>


                <!-- PENGGUNAAN MATERI -->

                <h3 style="
                    font-family:'Fredoka',
                    sans-serif;
                    font-size:20px;
                    color:#2d3748;
                    margin-bottom:14px;
                ">
                    📚 Penggunaan Materi
                </h3>


                <div style="
                    display:grid;
                    gap:10px;
                    margin-bottom:30px;
                ">

                    ${
                        materiEntries.length > 0

                        ? materiEntries
                            .map(
                                ([id, materi]) => {

                                    const progress =
                                        materialProgress[id] ||
                                        {};

                                    const selesai =
                                        progress.completed ===
                                        true;

                                    const dibuka =
                                        Boolean(
                                            progress.lastViewedAt ||
                                            progress.completed
                                        );

                                    const jumlahBuka =
                                        Number(
                                            progress.viewCount ||
                                            (
                                                selesai
                                                    ? 1
                                                    : 0
                                            )
                                        );

                                    const terakhir =
                                        progress.lastViewedAt ||
                                        progress.completedAt ||
                                        0;


                                    return `

                                        <div style="
                                            padding:14px;
                                            border:
                                                1px solid #e2e8f0;
                                            border-radius:12px;
                                            background:white;
                                        ">

                                            <div style="
                                                display:flex;
                                                justify-content:
                                                    space-between;
                                                align-items:center;
                                                gap:10px;
                                                flex-wrap:wrap;
                                            ">

                                                <strong style="
                                                    color:#2d3748;
                                                ">

                                                    ${
                                                        safeGuruText(
                                                            materi.ikon ||
                                                            '📚'
                                                        )
                                                    }

                                                    ${
                                                        safeGuruText(
                                                            materi.judul ||
                                                            id
                                                        )
                                                    }

                                                </strong>


                                                <span style="
                                                    font-size:12px;
                                                    font-weight:600;
                                                ">

                                                    ${
                                                        selesai
                                                            ? '✅ Selesai'
                                                            : dibuka
                                                                ? '👀 Sudah Dibuka'
                                                                : '⭕ Belum Dibuka'
                                                    }

                                                </span>

                                            </div>


                                            <div style="
                                                display:flex;
                                                gap:16px;
                                                flex-wrap:wrap;
                                                margin-top:8px;
                                                color:#718096;
                                                font-size:12px;
                                            ">

                                                <span>
                                                    Dibuka:
                                                    ${jumlahBuka}
                                                    kali
                                                </span>

                                                <span>
                                                    Terakhir:
                                                    ${
                                                        terakhir
                                                            ? formatAktivitas(
                                                                terakhir
                                                              )
                                                            : '-'
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join('')

                        : '<p>Belum ada materi.</p>'
                    }

                </div>


                <!-- RIWAYAT KUIS -->

                <h3 style="
                    font-family:'Fredoka',
                    sans-serif;
                    font-size:20px;
                    color:#2d3748;
                    margin-bottom:14px;
                ">
                    🎯 Riwayat Kuis
                </h3>


                <div style="
                    display:grid;
                    gap:10px;
                ">

                    ${
                        quizArray.length > 0

                        ? [...quizArray]

                            .sort(
                                (a, b) =>
                                    Number(
                                        b.timestamp || 0
                                    ) -
                                    Number(
                                        a.timestamp || 0
                                    )
                            )

                            .slice(0, 10)

                            .map(
                                quiz => `

                                    <div style="
                                        padding:14px;
                                        border:
                                            1px solid #e2e8f0;
                                        border-radius:12px;
                                        background:white;
                                        display:flex;
                                        justify-content:
                                            space-between;
                                        gap:15px;
                                        align-items:center;
                                    ">

                                        <div>

                                            <strong style="
                                                color:#2d3748;
                                            ">
                                                ${
                                                    safeGuruText(
                                                        quiz.quizType ||
                                                        quiz.materiJudul ||
                                                        quiz.quizId ||
                                                        'Kuis'
                                                    )
                                                }
                                            </strong>

                                            <p style="
                                                color:#718096;
                                                font-size:12px;
                                                margin-top:4px;
                                            ">
                                                ${
                                                    formatAktivitas(
                                                        quiz.timestamp
                                                    )
                                                }
                                            </p>

                                        </div>


                                        <span style="
                                            font-size:18px;
                                            font-weight:700;
                                            color:
                                                ${
                                                    Number(
                                                        quiz.score ||
                                                        0
                                                    ) >= 80
                                                        ? '#38a169'
                                                        : '#dd6b20'
                                                };
                                        ">
                                            ${
                                                Number(
                                                    quiz.score ||
                                                    0
                                                )
                                            }
                                        </span>

                                    </div>

                                `
                            )
                            .join('')

                        : `
                            <p style="
                                color:#718096;
                            ">
                                Belum ada kuis
                                yang dikerjakan.
                            </p>
                          `
                    }

                </div>

            </div>
        `;


        modal.style.display =
            'flex';

        modal.classList.add(
            'active'
        );


    } catch (error) {

        console.error(
            'Error viewing student detail:',
            error
        );

        alert(
            'Gagal memuat detail siswa'
        );

    }
}

// ========================================
// DROPDOWN URUTKAN SISWA
// ========================================

const studentSortSelect =
    document.getElementById(
        'studentSort'
    );

if (studentSortSelect) {

    studentSortSelect.addEventListener(
        'change',
        function () {

            // Simpan pilihan pengurutan
            studentSortMode =
                this.value;


            // Tampilkan ulang daftar siswa
            displayStudentTable(
                dashboardStudentsData
            );


            // Jika sedang melakukan pencarian,
            // terapkan kembali filter pencarian
            const searchBox =
                document.getElementById(
                    'searchStudent'
                );

            if (
                searchBox &&
                searchBox.value.trim() !== ''
            ) {

                searchBox.dispatchEvent(
                    new Event('input')
                );

            }

        }
    );
}

// ========================================
// SEARCH SISWA
// ========================================

const searchInput = document.getElementById('searchStudent');

if (searchInput) {

    searchInput.addEventListener('input', function () {

        const keyword = this.value
            .toLowerCase()
            .trim();

        const studentCards =
            document.querySelectorAll(
                '#studentsList .student-card'
            );

        let jumlahDitemukan = 0;

        studentCards.forEach(card => {

            const isiCard =
                card.textContent.toLowerCase();

            if (isiCard.includes(keyword)) {

                card.style.display = 'grid';
                jumlahDitemukan++;

            } else {

                card.style.display = 'none';

            }

        });


        // Pesan jika siswa tidak ditemukan
        let emptySearch =
            document.getElementById(
                'emptySearchResult'
            );

        if (
            jumlahDitemukan === 0 &&
            keyword !== ''
        ) {

            if (!emptySearch) {

                emptySearch =
                    document.createElement('div');

                emptySearch.id =
                    'emptySearchResult';

                emptySearch.className =
                    'modern-card';

                emptySearch.style.textAlign =
                    'center';

                emptySearch.style.padding =
                    '30px';

                emptySearch.innerHTML = `
                    <div style="font-size:40px;
                                margin-bottom:10px;">
                        🔍
                    </div>

                    <h3 style="
                        font-family:'Fredoka',
                        sans-serif;
                        color:#2d3748;
                        margin-bottom:5px;
                    ">
                        Siswa tidak ditemukan
                    </h3>

                    <p style="color:#718096;">
                        Tidak ada siswa yang cocok
                        dengan pencarian
                        "<strong>${escapeHTML(keyword)}</strong>"
                    </p>
                `;

                document
                    .getElementById('studentsList')
                    .appendChild(emptySearch);
            }

        } else {

            if (emptySearch) {
                emptySearch.remove();
            }

        }

    });

}

// Export Data

async function exportStudentData() {
    try {
        const usersSnapshot = await usersRef.once('value');
        const allUsers = usersSnapshot.val() || {};

        const students = Object.entries(allUsers)
            .filter(([id, user]) =>
                user.role === 'student' ||
                user.role === 'siswa'
            )
            .map(([id, user]) => ({ id, ...user }));

        const rows = [
            ['Nama', 'Email', 'Materi Selesai', 'Kuis Dikerjakan', 'Rata-rata Nilai']
        ];

        for (const student of students) {
            const progressSnapshot = await progressRef.child(student.id).once('value');
            const quizSnapshot = await quizzesRef.child(student.id).once('value');

            const progressData = progressSnapshot.val() || {};
            const materialProgress = progressData.materi || {};
            const quizResults = quizSnapshot.val() || {};

            const completedMaterials = Object.values(materialProgress)
                .filter(m => m.completed === true)
                .length;

            const quizArray = Object.values(quizResults);
            const completedQuizzes = quizArray.length;

            const avgScore = completedQuizzes > 0
                ? Math.round(quizArray.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes)
                : 0;

            rows.push([
                student.name || 'Siswa',
                student.email || '-',
                completedMaterials,
                completedQuizzes,
                avgScore
            ]);
        }

        const csvContent = rows
            .map(row => row.map(value => `"${value}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'data-siswa-pai.csv';
        link.click();

        URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Gagal export data:', error);
        alert('Gagal export data siswa.');
    }
}

// Logout Guru
async function logoutGuru() {
    const yakin = confirm('Yakin ingin logout?');

    if (!yakin) return;

    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Gagal logout:', error);
        alert('Gagal logout. Silakan coba lagi.');
    }
}

// Helper function available from utils.js

// Initialize on page load
if (window.location.pathname.includes('dashboard-guru.html')) {

    auth.onAuthStateChanged(user => {

        if (user) {

            loadTeacherDashboard();

            // Load jumlah materi dan soal kuis
            loadDynamicContentStats();

        }

    });

}

// Dashboard Guru module initialized