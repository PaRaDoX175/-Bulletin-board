import AdCard from "./AdCard.jsx";
import Pagination from "./Pagination.jsx";
import React from "react";

export default function AdListComponent({ ads, removeAd, pagination, setPagination, totalCount }) {
    return (
        <>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ads.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-600 bg-white rounded shadow">
                        No ads found.
                    </div>
                ) : (
                    ads.map((ad) => (
                        <AdCard key={ad.id} ad={ad} onDelete={() => removeAd(ad.id)} />
                    ))
                )}
            </div>

            <Pagination pagination={pagination} setPagination={setPagination} totalCount={totalCount}></Pagination>
        </>
    )
}