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

export default function App() {
  const [ads, setAds] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const baseUrl = 'http://localhost:5197/api'
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
      pageIndex: 1,
      pageSize: 6,
      search: '',
      category: categories[0],
      sort: '',
  })
  const [isMine, setIsMine] = useState(false)

  const { openCreate, openAuthentication } = useContext(ModalContext)

  const fetchAds = async(params = {}, path) => {
      const query = new URLSearchParams({
          pageIndex: params.pageIndex ?? 1,
          pageSize: params.pageSize ?? 6,
          search: params.search ?? "",
          sort: params.sort ?? "",
          category: params.category ?? ""
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
          sort: ''
      })
  }

  return (
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-700">
          <Header />

          <div className="container mx-auto px-4 py-6 flex gap-6 pt-20">
              <aside className="w-full lg:w-72">
                  <div className="bg-white p-4 rounded-lg shadow">
                      <h3 className="font-semibold mb-3 text-gray-800">Categories</h3>
                      <ul className="flex flex-col gap-2">
                          {categories.map((c) => (
                              <li key={c}>
                                  <button
                                      onClick={() => setPagination({...pagination, category: c, pageIndex: 1})}
                                      className={`text-left w-full px-3 py-2 rounded text-gray-700 ${
                                          pagination.category === c ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                                      }`}
                                  >
                                      {c}
                                  </button>
                              </li>
                          ))}
                      </ul>
                      <hr className="my-4"/>
                      <h3 className="font-semibold mb-2 text-gray-800">Price</h3>
                      <div className="flex gap-2">
                          <input type="number" placeholder="min" value={minPrice}
                                 onChange={e => setMinPrice(e.target.value)}
                                 className="w-1/2 border px-2 py-1 rounded text-gray-700"/>
                          <input type="number" placeholder="max" value={maxPrice}
                                 onChange={e => setMaxPrice(e.target.value)}
                                 className="w-1/2 border px-2 py-1 rounded text-gray-700"/>
                      </div>
                      <hr className="my-4"/>
                      <h3 className="font-semibold mb-2 text-gray-800">Sorting</h3>
                      <select onChange={e => setPagination({...pagination, sort: e.target.value})}
                              className="w-full border px-2 py-1 rounded text-gray-700">
                          <option value="asc">Price ↑</option>
                          <option value="desc">Price ↓</option>
                      </select>
                      <div className="mt-4">
                          <button onClick={resetPagination}
                                  className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 text-gray-700">Reset
                              filters
                          </button>
                      </div>
                  </div>
              </aside>

              <section className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center gap-2 w-full md:w-1/2">
                          <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                              <input
                                  value={pagination.search}
                                  onChange={(e) => setPagination({...pagination, pageIndex: 1, search: e.target.value})}
                                  placeholder="Search ads..."
                                  className="w-full pl-10 pr-3 py-2 border rounded text-gray-700"
                              />
                          </div>
                          <button onClick={() => openCreate(() => fetchAds(pagination, isMine ? "get_user_ads" : "get_all"))}
                                  className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
                              <Plus/> Create ad
                          </button>
                      </div>

                      <div className="flex items-center gap-2">
                          <button onClick={() => setIsMine(false)}
                                  className={`px-3 py-1 rounded ${!isMine ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}>All
                          </button>
                          <button onClick={() => checkJwt() ? setIsMine(true) : (setIsMine(false), openAuthentication())}
                                  className={`px-3 py-1 rounded ${isMine ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}>My
                              Ads
                          </button>
                      </div>
                  </div>

                  <AdListComponent
                      ads={ads}
                      removeAd={removeAd}
                      pagination={pagination}
                      setPagination={setPagination}
                      totalCount={totalCount}></AdListComponent>

              </section>


          </div>

          <Footer/>
      </div>
  );
}
