import { useEffect, useRef, useState } from "react";
import { fetchCarsFromTelegram } from "../services/telegramService";

// Har necha millisekundda fon rejimida yangilanishi
const AUTO_REFRESH_INTERVAL = 30000; // 30 soniya

// =============================================================
// Telegramdan mashinalar ro'yxatini olish + fon rejimida
// avtomatik yangilanish + qo'lda yangilash imkoni.
//
// Home.jsx va LikedProduct.jsx ikkalasi ham shu hook'dan
// foydalanadi, shunda fetch/polling logikasi bitta joyda turadi.
// =============================================================
export function useCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);

  const load = async (silent = false) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const telegramCars = await fetchCarsFromTelegram();

      if (telegramCars.length === 0 && hasLoadedOnce.current) {
        console.warn("Yangi ma'lumot 0 ta qaytdi — eski ma'lumot saqlanadi.");
      } else {
        setCars(telegramCars);
        hasLoadedOnce.current = true;
      }
    } catch (error) {
      console.error("Telegram avtomobillarini yuklashda xatolik:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load(false);

    const intervalId = setInterval(() => {
      load(true);
    }, AUTO_REFRESH_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        load(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const refresh = () => {
    if (!refreshing) load(true);
  };

  return { cars, loading, refreshing, refresh };
}
