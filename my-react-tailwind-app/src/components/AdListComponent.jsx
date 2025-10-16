import AdCard from "./AdCard.jsx";
import Pagination from "./Pagination.jsx";
import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import {useMantineColorScheme} from "@mantine/core";

export default function AdListComponent({ ads, removeAd, pagination, setPagination, totalCount, isMine }) {
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

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
                            ads.map((ad) => <AdCard key={ad.id} ad={ad} onDelete={() => removeAd(ad.id)} />)
                        )}
                    </motion.div>
                </AnimatePresence>

                <Pagination
                    pagination={pagination}
                    setPagination={setPagination}
                    totalCount={totalCount}
                />
            </>

            {/*<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">*/}
            {/*    {ads.length === 0 ? (*/}
            {/*        <div className="col-span-full text-center py-12 text-gray-600 bg-white rounded shadow">*/}
            {/*            No ads found.*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        ads.map((ad) => (*/}
            {/*            <AdCard key={ad.id} ad={ad} onDelete={() => removeAd(ad.id)} />*/}
            {/*        ))*/}
            {/*    )}*/}
            {/*</div>*/}

            {/*<Pagination pagination={pagination} setPagination={setPagination} totalCount={totalCount}></Pagination>*/}
        </>
    )
}