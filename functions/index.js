const { onCall, HttpsError } =
    require("firebase-functions/v2/https");

const admin =
    require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),

    databaseURL:
        "https://aplikasi-sd-90a5f-default-rtdb.asia-southeast1.firebasedatabase.app"
});


// ========================================
// RESET PASSWORD SISWA
// ========================================

exports.resetStudentPassword =
    onCall(async (request) => {

        // Harus login
        if (!request.auth) {
            throw new HttpsError(
                "unauthenticated",
                "Silakan login terlebih dahulu."
            );
        }

        const guruUid = request.auth.uid;
        const uidSiswa = request.data.uid;
        const passwordBaru = request.data.password;


        // Validasi data
        if (!uidSiswa || !passwordBaru) {
            throw new HttpsError(
                "invalid-argument",
                "UID siswa dan password baru wajib diisi."
            );
        }


        if (passwordBaru.length < 6) {
            throw new HttpsError(
                "invalid-argument",
                "Password minimal 6 karakter."
            );
        }


        // ========================================
        // CEK ROLE GURU
        // ========================================

        const guruSnapshot =
            await admin
                .database()
                .ref("users/" + guruUid)
                .once("value");

        const guruData = guruSnapshot.val();


        if (!guruData || guruData.role !== "guru") {
            throw new HttpsError(
                "permission-denied",
                "Hanya guru yang dapat melakukan reset password."
            );
        }


        // ========================================
        // CEK TARGET SISWA
        // ========================================

        const siswaSnapshot =
            await admin
                .database()
                .ref("users/" + uidSiswa)
                .once("value");

        const siswaData = siswaSnapshot.val();


        if (!siswaData) {
            throw new HttpsError(
                "not-found",
                "Data siswa tidak ditemukan."
            );
        }


        if (siswaData.role !== "siswa") {
            throw new HttpsError(
                "permission-denied",
                "Reset password hanya dapat dilakukan pada akun siswa."
            );
        }


        // ========================================
        // UPDATE PASSWORD
        // ========================================

        await admin.auth().updateUser(
            uidSiswa,
            {
                password: passwordBaru
            }
        );


        return {
            success: true,
            message:
                "Password siswa berhasil direset."
        };

    });


// ========================================
// HAPUS USER
// ========================================

exports.deleteUserAccount = onCall(async (request) => {

    try {

        console.log("=== DELETE USER DIMULAI ===");

        if (!request.auth) {
            console.log("GAGAL: user belum login");

            throw new HttpsError(
                "unauthenticated",
                "Silakan login terlebih dahulu."
            );
        }

        const guruUid = request.auth.uid;
        const uidTarget = request.data.uid;

        console.log("Guru UID:", guruUid);
        console.log("Target UID:", uidTarget);

        if (!uidTarget) {
            throw new HttpsError(
                "invalid-argument",
                "UID user tidak ditemukan."
            );
        }

        if (uidTarget === guruUid) {
            throw new HttpsError(
                "permission-denied",
                "Tidak dapat menghapus akun sendiri."
            );
        }

        console.log("1. Membaca data guru...");

        const guruSnapshot = await admin
            .database()
            .ref("users/" + guruUid)
            .once("value");

        const guruData = guruSnapshot.val();

        console.log("Data guru:", guruData);

        if (!guruData || guruData.role !== "guru") {
            throw new HttpsError(
                "permission-denied",
                "Hanya guru yang dapat menghapus user."
            );
        }

        console.log("2. Membaca user target...");

        const userRef = admin
            .database()
            .ref("users/" + uidTarget);

        const userSnapshot = await userRef.once("value");

        console.log(
            "User target ada:",
            userSnapshot.exists()
        );

        if (!userSnapshot.exists()) {
            throw new HttpsError(
                "not-found",
                "Data user tidak ditemukan."
            );
        }

        console.log("3. Menghapus Authentication...");

        try {

            await admin.auth().deleteUser(uidTarget);

            console.log(
                "Authentication berhasil dihapus"
            );

        } catch (authError) {

            console.error(
                "AUTH ERROR CODE:",
                authError.code
            );

            console.error(
                "AUTH ERROR MESSAGE:",
                authError.message
            );

            if (
                authError.code !==
                "auth/user-not-found"
            ) {

                throw authError;
            }
        }

        console.log(
            "4. Menghapus Realtime Database..."
        );

        await userRef.remove();

        console.log("Database berhasil dihapus");

        console.log(
            "=== DELETE USER SELESAI ==="
        );

        return {
            success: true
        };

    } catch (error) {

        console.error(
            "========== ERROR =========="
        );

        console.error(
            "CODE:",
            error.code
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "STACK:",
            error.stack
        );

        console.error(
            "==========================="
        );

        if (error instanceof HttpsError) {
            throw error;
        }

        throw new HttpsError(
            "internal",
            "Gagal menghapus user.",
            {
                originalCode:
                    error.code || "unknown",

                originalMessage:
                    error.message || "unknown"
            }
        );
    }

});