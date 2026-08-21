import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export function useCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Firestore'dagi 'cars' kolleksiyasini real vaqtda eshitish
    const carsRef = collection(db, "cars");
    const q = query(carsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const carList = [];
        snapshot.forEach((doc) => {
          carList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setCars(carList);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Firebase Firestore yuklashda xatolik:", error);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const refresh = () => {
    setRefreshing(true);
    // Firestore realtime bo'lgani uchun, bu tugma indicator uchun ishlaydi
    setTimeout(() => setRefreshing(false), 500);
  };

  return { cars, loading, refreshing, refresh };
}
