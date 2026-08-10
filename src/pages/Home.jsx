import React from "react";
import Navbar from "../comps/Navbar";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";
import CarCard from "./CarCard";

const Home = () => {
  // Vaqtinchalik sinov ma'lumotlari (Mock Data)
  const MOCK_CARS = [
    {
      id: 1,
      name: "Chevrolet Lacetti",
      price: 5000,
      year: 2009,
      mileage: 240000,
      location: "Toshkent sh.",
      date: "11.08.2026",
      image: "https://via.placeholder.com/400x300?text=Lacetti", // vaqtinchalik rasm
    },
    {
      id: 2,
      name: "Chevrolet Nexia 3",
      price: 7800,
      year: 2019,
      mileage: 110000,
      location: "Samarqand",
      date: "10.08.2026",
      image: "https://via.placeholder.com/400x300?text=Nexia+3",
    },
    {
      id: 3,
      name: "Denza N8 EV",
      price: 45000,
      year: 2025,
      mileage: 6400,
      location: "Toshkent sh.",
      date: "10.08.2026",
      image: "https://via.placeholder.com/400x300?text=Denza+N8",
    },
    {
      id: 4,
      name: "Chevrolet Cobalt",
      price: 11500,
      year: 2023,
      mileage: 22000,
      location: "Andijon",
      date: "09.08.2026",
      image: "https://via.placeholder.com/400x300?text=Cobalt",
    },
    {
      id: 5,
      name: "Chevrolet Lacetti",
      price: 5000,
      year: 2009,
      mileage: 240000,
      location: "Toshkent sh.",
      date: "11.08.2026",
      image: "https://via.placeholder.com/400x300?text=Lacetti", // vaqtinchalik rasm
    },
    {
      id: 6,
      name: "Chevrolet Nexia 3",
      price: 7800,
      year: 2019,
      mileage: 110000,
      location: "Samarqand",
      date: "10.08.2026",
      image: "https://via.placeholder.com/400x300?text=Nexia+3",
    },
    {
      id: 7,
      name: "Denza N8 EV",
      price: 45000,
      year: 2025,
      mileage: 6400,
      location: "Toshkent sh.",
      date: "10.08.2026",
      image: "https://via.placeholder.com/400x300?text=Denza+N8",
    },
    {
      id: 8,
      name: "Chevrolet Cobalt",
      price: 11500,
      year: 2023,
      mileage: 22000,
      location: "Andijon",
      date: "09.08.2026",
      image: "https://via.placeholder.com/400x300?text=Cobalt",
    },
  ];

  return (
    <div>
      {/* Components */}
      <div>
        <Navbar />
        <MenuBar />
        <SearchBar />

        {/* Avtomobillar paneli */}
        <div className="px-3 mt-2">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Kun takliflari
          </h2>

          {/* Mobilda 2 ta, planshetda 3-4 ta kartochka bir qatorda ko'rinadi */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {MOCK_CARS.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
