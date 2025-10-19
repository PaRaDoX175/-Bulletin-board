import Header from "./Header.jsx";
import {useMantineColorScheme} from "@mantine/core";
import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";
import api from "../interceptors/tokenValidity.interceptor.jsx";
import { Heart, Trash2, Search } from "lucide-react";
import FavoriteCard from "./FavoriteCard.jsx";

export default function Favorites() {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const res = await api.get("http://localhost:5197/api/basket/get_basket");
                setFavorites(res.data.items || []);
            } catch (err) {
                console.error("Ошибка загрузки избранных:", err);
            }
        };

        loadFavorites();
    }, []);

    const removeFavorite = async (id) => {
        try {
            await api.delete(`http://localhost:5197/api/basket/remove_item?basketItemId=${id}`);
            setFavorites((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("Error while removing:", err);
        }
    };

    return (

        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                dark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
            }`}
        >
            <Header showCreate={false}/>

            <main className="flex-1 container mx-auto px-4 sm:px-8 py-10 sm:py-14 mt-10 sm:mt-16 max-w-7xl">
                <div className="flex justify-center items-center">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Heart
                            className={`${
                                dark ? "text-red-400" : "text-red-500"
                            } fill-current`}
                        />
                        Favorites
                    </h1>
                </div>
                {favorites.length > 0 && (
                    <p className="text-sm opacity-70 text-center">
                        {favorites.length} item{favorites.length !== 1 ? "s" : ""}
                    </p>
                )}

                {favorites.length !== 0 ? (
                    favorites.map((item) => (
                            <FavoriteCard favorite={item} removeFavorite={() => removeFavorite(item.id)} key={item.id} />
                    ))
                ) : (
                    <h2 className="text-center">Your Favorites is Empty</h2>
                )}


            </main>


        </div>
    );
}