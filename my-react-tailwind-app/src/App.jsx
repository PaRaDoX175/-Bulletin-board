import React, {useEffect, useRef, useState} from "react";
import { Search, Plus } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdCard from "./components/AdCard";
import CreateAdModal from "./components/CreateAdModal";
import { seedAds } from "./data/seedAds";
import { categories } from "./data/categories";
import { fileToDataUrl } from "./utils/fileToDataUrl";
import AuthenticateComponent from "./components/AuthenticateComponent.jsx";

export default function App() {
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [showCreate, setShowCreate] = useState(false);
  const [showAuthentication, setShowAuthentication] = useState(false);
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


  const fetchAds = async(params = {}) => {
      const query = new URLSearchParams({
          pageIndex: params.pageIndex ?? 1,
          pageSize: params.pageSize ?? 6,
          search: params.search ?? "",
          sort: params.sort ?? "",
          category: params.category ?? ""
      })

      try {
          const res = await fetch(
              baseUrl + `/ads/get_all?${query.toString()}`, {
                  method: "GET",
                  headers: {'Content-Type': 'application/json'}
              })


          const data = await res.json();
          console.log(data)
          setTotalCount(data.count)
          if (data) {
              setAds(data.data);
          } else {
              setAds(seedAds);
          }
      }
      catch {
          setAds(seedAds);
      }

    }

  useEffect(() => {
        (async() => {
            await fetchAds(pagination);
        })()
    }, [pagination]);

  const removeAd = (id) => {
    if (!confirm("Delete ad?")) return;
    setAds((s) => s.filter((a) => a.id !== id));
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
      <Header setShowAuthentication={setShowAuthentication} openCreate={() => setShowCreate(true)} />

        <div className="container mx-auto px-4 py-6 flex gap-6 pt-20">
            <aside className="w-full lg:w-72">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-semibold mb-3 text-gray-800">Categories</h3>
                    <ul className="flex flex-col gap-2">
                        {categories.map((c) => (
                            <li key={c}>
                                <button
                                    onClick={() => setPagination({...pagination, category: c})}
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
                        {/*<option value="dateDesc">Newest</option>*/}
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
                                onChange={(e) => setPagination({...pagination, search: e.target.value})}
                                placeholder="Search ads..."
                                className="w-full pl-10 pr-3 py-2 border rounded text-gray-700"
                            />
                        </div>
                        <button onClick={() => setShowCreate(true)}
                                className="hidden md:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
                            <Plus/> Create ad
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => setActiveTab("home")}
                                className={`px-3 py-1 rounded ${activeTab === "home" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}>All
                        </button>
                        <button onClick={() => setActiveTab("myads")}
                                className={`px-3 py-1 rounded ${activeTab === "myads" ? "bg-blue-600 text-white" : "bg-white border text-gray-700"}`}>My
                            Ads
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-600 bg-white rounded shadow">
                            No ads found.
                        </div>
                    ) : (
                        ads.map((ad) => (
                            <AdCard key={ad.id} ad={ad} onDelete={() => removeAd(ad.id)}/>
                        ))
                    )}
                </div>

                    <div className="flex items-center justify-center space-x-2 mt-6">
                        <button
                            onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
                            disabled={pagination.pageIndex === 1}
                            className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ‹
                        </button>

                        {Array.from({ length: Math.ceil(totalCount / pagination.pageSize) }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setPagination({ ...pagination, pageIndex: page })}
                                className={`px-3 py-1 rounded-lg border ${
                                    pagination.pageIndex === page
                                        ? "bg-blue-500 text-white font-medium hover:bg-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
                            disabled={pagination.pageIndex === Math.ceil(totalCount / pagination.pageSize)}
                            className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ›
                        </button>
                    </div>

            </section>


        </div>

        <Footer/>

        {showCreate && (
            <CreateAdModal
                onClose={() => setShowCreate(false)}
                setAds={setAds}
            />
        )}

        {showAuthentication && (
            <AuthenticateComponent setShowAuthentication={setShowAuthentication}></AuthenticateComponent>
        )
        }
    </div>
  );
}
