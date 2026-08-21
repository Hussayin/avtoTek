import { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Firebase konfiguratsiyangiz yo'li
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export function useCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firestore 'cars' kolleksiyasini real-vaqt rejimida eshitish
    const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const carsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carsData);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore xatosi:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { cars, loading };
}
