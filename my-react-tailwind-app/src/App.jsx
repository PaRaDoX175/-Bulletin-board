import React, {useContext, useEffect, useState} from "react";
import { Search, Plus } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdCard from "./components/AdCard";
import { seedAds } from "./data/seedAds";
import { categories } from "./data/categories";
import { fileToDataUrl } from "./utils/fileToDataUrl";
import {ModalContext} from "./contexts/ModalContext.jsx";
import {getDataWithInterceptor, getDataWithoutInterceptor} from "./utils/requestService.js";
import Pagination from "./components/Pagination.jsx";
import {checkJwt} from "./utils/isJwtValid.js";
import api from "./interceptors/tokenValidity.interceptor.jsx";
import AdListComponent from "./components/AdListComponent.jsx";
import {useMantineColorScheme} from "@mantine/core";
import {motion, AnimatePresence} from "framer-motion";

export default function App() {
  const [ads, setAds] = useState([]);
  const baseUrl = 'http://localhost:5197/api'
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
      pageIndex: 1,
      pageSize: 6,
      search: '',
      category: categories[0],
      sort: '',
      minPrice: '',
      maxPrice: ''
  })
  const [isMine, setIsMine] = useState(false)
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [showFilters, setShowFilters] = useState(false);

  const { openCreate, openAuthentication } = useContext(ModalContext)

  const fetchAds = async(params = {}, path) => {
      const query = new URLSearchParams({
          pageIndex: params.pageIndex ?? 1,
          pageSize: params.pageSize ?? 6,
          search: params.search ?? "",
          sort: params.sort ?? "",
          category: params.category ?? "",
          minPrice: Number(params.minPrice) || '',
          maxPrice: Number(params.maxPrice) || '',
      })

      try {
          let data;
          if (path === 'get_all')
          {
              data = await getDataWithoutInterceptor(baseUrl + `/ads/${path}?${query.toString()}`)
          }
          else if (path === 'get_user_ads')
          {
              data = await getDataWithInterceptor(baseUrl + `/ads/${path}?${query.toString()}`)
          }

          setTotalCount(data.count)
          setAds(data.data);
      }
      catch {
          setAds(seedAds);
      }

    }

  useEffect(() => {
        (async() => {
            if (!isMine) await fetchAds(pagination, 'get_all');
            else await fetchAds(pagination, 'get_user_ads');
        })()
    }, [isMine, pagination]);

  const removeAd = async (adId) => {
    if (!confirm("Delete ad?")) return;
    await api.delete(`${baseUrl}/ads/delete_ad?adId=${adId}`)
    setPagination({...pagination})
  };

  const resetPagination = () => {
      setPagination({
          pageIndex: 1,
          pageSize: 6,
          search: '',
          category: categories[0],
          sort: '',
          minPrice: '',
          maxPrice: '',
      })
  }

    return (
        <div
            className={`min-h-screen flex flex-col transition-colors duration-300 ${
                dark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-700"
            }`}
        >
            <Header
                saveOpenCreate={() =>
                    fetchAds(pagination, isMine ? "get_user_ads" : "get_all")
                }
            />

            <div className="flex-1 container mx-auto px-4 py-8 flex gap-6 pt-20">
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`hidden md:block w-60 lg:w-72 p-4 rounded-2xl shadow-md border transition-colors duration-300 ${
                        dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                >
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <ul className="flex flex-col gap-2">
                        {categories.map((c) => (
                            <li key={c}>
                                <button
                                    onClick={() =>
                                        setPagination({ ...pagination, category: c, pageIndex: 1 })
                                    }
                                    className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                                        pagination.category === c
                                            ? "bg-blue-600 text-white"
                                            : dark
                                                ? "hover:bg-gray-700 text-gray-300"
                                                : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    {c}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <hr
                        className={`my-4 ${dark ? "border-gray-700" : "border-gray-200"}`}
                    />

                    <h3 className="font-semibold mb-2">Price</h3>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="min"
                            value={pagination.minPrice}
                            onChange={(e) =>
                                setPagination({ ...pagination, minPrice: e.target.value })
                            }
                            className={`w-1/2 px-2 py-1 rounded border text-sm ${
                                dark
                                    ? "bg-gray-700 border-gray-600 text-gray-200"
                                    : "bg-white border-gray-300 text-gray-700"
                            }`}
                        />
                        <input
                            type="number"
                            placeholder="max"
                            value={pagination.maxPrice}
                            onChange={(e) =>
                                setPagination({ ...pagination, maxPrice: e.target.value })
                            }
                            className={`w-1/2 px-2 py-1 rounded border text-sm ${
                                dark
                                    ? "bg-gray-700 border-gray-600 text-gray-200"
                                    : "bg-white border-gray-300 text-gray-700"
                            }`}
                        />
                    </div>

                    <hr
                        className={`my-4 ${dark ? "border-gray-700" : "border-gray-200"}`}
                    />

                    <h3 className="font-semibold mb-2">Sorting</h3>
                    <select
                        onChange={(e) =>
                            setPagination({ ...pagination, sort: e.target.value })
                        }
                        className={`w-full px-2 py-1 rounded border text-sm ${
                            dark
                                ? "bg-gray-700 border-gray-600 text-gray-200"
                                : "bg-white border-gray-300 text-gray-700"
                        }`}
                    >
                        <option value="asc">Price ↑</option>
                        <option value="desc">Price ↓</option>
                    </select>

                    <button
                        onClick={resetPagination}
                        className={`mt-4 w-full py-2 rounded-md font-medium transition-colors ${
                            dark
                                ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        Reset filters
                    </button>
                </motion.aside>

                <section className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
                        <div className="hidden md:flex flex items-center gap-2 w-full md:w-1/2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={pagination.search}
                                    onChange={(e) =>
                                        setPagination({
                                            ...pagination,
                                            pageIndex: 1,
                                            search: e.target.value,
                                        })
                                    }
                                    placeholder="Search ads..."
                                    className={`w-full pl-10 pr-3 py-2 rounded border text-sm ${
                                        dark
                                            ? "bg-gray-800 border-gray-700 text-gray-200"
                                            : "bg-white border-gray-300 text-gray-700"
                                    }`}
                                />
                            </div>
                            <button
                                onClick={() =>
                                    openCreate(() =>
                                        fetchAds(pagination, isMine ? "get_user_ads" : "get_all")
                                    )
                                }
                                className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                            >
                                <Plus size={16} /> Create ad
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMine(false)}
                                className={`px-3 py-1 rounded-md transition-colors ${
                                    !isMine
                                        ? "bg-blue-600 text-white"
                                        : dark
                                            ? "bg-gray-800 border border-gray-700 text-gray-300"
                                            : "bg-white border text-gray-700"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() =>
                                    checkJwt()
                                        ? setIsMine(true)
                                        : (setIsMine(false), openAuthentication())
                                }
                                className={`px-3 py-1 rounded-md transition-colors ${
                                    isMine
                                        ? "bg-blue-600 text-white"
                                        : dark
                                            ? "bg-gray-800 border border-gray-700 text-gray-300"
                                            : "bg-white border text-gray-700"
                                }`}
                            >
                                My Ads
                            </button>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-1 rounded-md shadow hover:bg-blue-700 transition w-full justify-center"
                                >
                                    <Search size={18} /> Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <AdListComponent
                        ads={ads}
                        pagination={pagination}
                        setPagination={setPagination}
                        removeAd={removeAd}
                        totalCount={totalCount}
                        isMine={isMine}
                    ></AdListComponent>
                </section>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`fixed inset-0 z-40 ${
                                dark ? "bg-gray-900/70" : "bg-gray-100/60"
                            } backdrop-blur-sm`}
                            onClick={() => setShowFilters(false)}
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className={`fixed top-0 left-0 z-50 w-72 h-full p-4 shadow-lg border-r transition-colors duration-300 ${
                                dark
                                    ? "bg-gray-800 border-gray-700 text-gray-200"
                                    : "bg-white border-gray-200 text-gray-700"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    value={pagination.search}
                                    onChange={(e) =>
                                        setPagination({
                                            ...pagination,
                                            pageIndex: 1,
                                            search: e.target.value,
                                        })
                                    }
                                    placeholder="Search ads..."
                                    className={`w-full pl-10 pr-3 py-2 rounded border text-sm ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 text-gray-200"
                                            : "bg-white border-gray-300 text-gray-700"
                                    }`}
                                />
                            </div>

                            <div className="overflow-y-auto h-[calc(100%-5rem)]">
                                <h3 className="font-semibold mb-3">Categories</h3>
                                <ul className="flex flex-col gap-2">
                                    {categories.map((c) => (
                                        <li key={c}>
                                            <button
                                                onClick={() =>
                                                    setPagination({
                                                        ...pagination,
                                                        category: c,
                                                        pageIndex: 1,
                                                    })
                                                }
                                                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                                                    pagination.category === c
                                                        ? "bg-blue-600 text-white"
                                                        : dark
                                                            ? "hover:bg-gray-700 text-gray-300"
                                                            : "hover:bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <hr
                                    className={`my-4 ${
                                        dark ? "border-gray-700" : "border-gray-200"
                                    }`}
                                />

                                <h3 className="font-semibold mb-2">Price</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="min"
                                        value={pagination.minPrice}
                                        onChange={(e) =>
                                            setPagination({ ...pagination, minPrice: e.target.value })
                                        }
                                        className={`w-1/2 px-2 py-1 rounded border text-sm ${
                                            dark
                                                ? "bg-gray-700 border-gray-600 text-gray-200"
                                                : "bg-white border-gray-300 text-gray-700"
                                        }`}
                                    />
                                    <input
                                        type="number"
                                        placeholder="max"
                                        value={pagination.maxPrice}
                                        onChange={(e) =>
                                            setPagination({ ...pagination, maxPrice: e.target.value })
                                        }
                                        className={`w-1/2 px-2 py-1 rounded border text-sm ${
                                            dark
                                                ? "bg-gray-700 border-gray-600 text-gray-200"
                                                : "bg-white border-gray-300 text-gray-700"
                                        }`}
                                    />
                                </div>

                                <hr
                                    className={`my-4 ${
                                        dark ? "border-gray-700" : "border-gray-200"
                                    }`}
                                />

                                <h3 className="font-semibold mb-2">Sorting</h3>
                                <select
                                    onChange={(e) =>
                                        setPagination({ ...pagination, sort: e.target.value })
                                    }
                                    className={`w-full px-2 py-1 rounded border text-sm ${
                                        dark
                                            ? "bg-gray-700 border-gray-600 text-gray-200"
                                            : "bg-white border-gray-300 text-gray-700"
                                    }`}
                                >
                                    <option value="asc">Price ↑</option>
                                    <option value="desc">Price ↓</option>
                                </select>

                                <button
                                    onClick={resetPagination}
                                    className={`mt-4 w-full py-2 rounded-md font-medium transition-colors ${
                                        dark
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Reset filters
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
