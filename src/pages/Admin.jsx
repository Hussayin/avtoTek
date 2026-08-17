import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { LuUsers, LuLock } from "react-icons/lu";

// Admin sahifasiga kirish uchun oddiy parol (kod ichida saqlanadi —
// bu jiddiy xavfsizlik emas, faqat oddiy foydalanuvchilar tasodifan
// kirib qolmasligi uchun).
const ADMIN_PIN = "2026avtotek";

const Admin = () => {
  const [authorized, setAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // PAROLNI TEKSHIRISH
  // =========================================================
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // =========================================================
  // FOYDALANUVCHILARNI FIRESTORE'DAN OLISH
  // =========================================================
  useEffect(() => {
    if (!authorized) return;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("firstSeenAt", "desc"));
        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setUsers(list);
      } catch (error) {
        console.error("Foydalanuvchilarni olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [authorized]);

  // =========================================================
  // FIRESTORE TIMESTAMP'NI O'QILADIGAN SANAGA AYLANTIRISH
  // =========================================================
  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "-";
    return timestamp.toDate().toLocaleString("ru-RU");
  };

  // =========================================================
  // PAROL SO'RASH OYNASI
  // =========================================================
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
        <form
          onSubmit={handlePinSubmit}
          className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-sm border border-slate-100"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 mx-auto">
            <LuLock size={20} className="text-slate-500" />
          </div>
          <h2 className="text-center font-bold text-slate-900 mb-4">
            Admin panel
          </h2>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError(false);
            }}
            placeholder="Parolni kiriting"
            className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none mb-2 ${
              pinError
                ? "border-rose-500 ring-1 ring-rose-500"
                : "border-slate-200 focus:border-blue-500"
            }`}
          />
          {pinError && (
            <p className="text-rose-500 text-xs mb-2">Parol noto'g'ri.</p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold"
          >
            Kirish
          </button>
        </form>
      </div>
    );
  }

  // =========================================================
  // ADMIN PANEL
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-20">
      <div className="flex items-center gap-2 mb-1">
        <LuUsers size={22} className="text-blue-600" />
        <h1 className="text-xl font-bold text-slate-900">Foydalanuvchilar</h1>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Jami: <span className="font-bold text-slate-900">{users.length}</span>{" "}
        ta foydalanuvchi
      </p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 bg-slate-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl p-3 border border-slate-100 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-slate-900 text-sm">
                  {user.firstName} {user.lastName}
                  {user.username && (
                    <span className="text-slate-400 font-normal">
                      {" "}
                      @{user.username}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ID: {user.telegramId}
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400 shrink-0">
                <div>Birinchi: {formatDate(user.firstSeenAt)}</div>
                <div>Oxirgi: {formatDate(user.lastSeenAt)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400 text-sm py-16">
          Hozircha foydalanuvchilar yo'q.
        </div>
      )}
    </div>
  );
};

export default Admin;
