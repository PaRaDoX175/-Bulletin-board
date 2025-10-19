import AdCard from "./AdCard.jsx";
import Pagination from "./Pagination.jsx";
import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useMantineColorScheme} from "@mantine/core";
import api from "../interceptors/tokenValidity.interceptor.jsx";
import {jwtDecode} from "jwt-decode";

export default function AdListComponent({ ads, removeAd, pagination, setPagination, totalCount, isMine }) {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const [favorites, setFavorites] = useState([]);
    const l = localStorage.getItem('accessToken')


    const getFavorites = async () => {
        const req = await api.get('http://localhost:5197/api/basket/get_basket')
        setFavorites(await req.data.items);
    }

    useEffect(() => {
        (async () => {
            await getFavorites();
        })()
    }, [favorites, l]);

    useEffect(() => {
        (async () => {
            await getFavorites();
        })()
    }, [])

    return (
        <>

            <>
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`${pagination.pageIndex}-${isMine}-${pagination.category}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {ads.length === 0 ? (
                            <div
                                className={`col-span-full text-center py-12 rounded-md shadow ${
                                    dark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-600"
                                }`}
                            >
                                No ads found.
                            </div>
                        ) : (
                            ads.map((ad) => <AdCard key={ad.id} ad={ad} onDelete={() => removeAd(ad.id)} favorites={favorites} />)
                        )}
                    </motion.div>
                </AnimatePresence>

                <Pagination
                    pagination={pagination}
                    setPagination={setPagination}
                    totalCount={totalCount}
                />
            </>
        </>
    )
}