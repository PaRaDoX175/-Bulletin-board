import {useEffect, useState} from "react";
import { Phone, Mail, Trash2 } from "lucide-react";
import {jwtDecode} from "jwt-decode";

export default function AdCard({ ad, onDelete }) {
  const [showContact, setShowContact] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
      const token = localStorage.getItem('accessToken')
      if (token) {
          const decoded = jwtDecode(token)
          setUserId(decoded.nameid)
      }
      else setUserId('')
  }, [])

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col text-gray-700">
      {ad.image ? (
        <img src={ad.image} alt={ad.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-44 bg-gray-100 grid place-items-center text-gray-400">No image</div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">{ad.title}</h3>
            <p className="text-sm text-gray-600">{ad.category} • {ad.location}</p>
          </div>
          <div className="text-xl font-bold text-blue-600">{ad.price ? `$${ad.price}` : "-"}</div>
        </div>

        <p className="mt-3 text-gray-700 flex-1 break-words">
          {ad.description?.slice(0, 120)}
          {ad.description && ad.description.length > 120 ? "..." : ""}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowContact(true)} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2">
              <Phone size={14} />Contact
            </button>
          </div>

          <div className="flex items-center gap-2">
            {ad.userId === userId && (
              <button onClick={() => onDelete(ad.id)} className="text-red-500 hover:text-red-700 p-2 rounded">
                <Trash2 />
              </button>
            )}
            <span className="text-xs text-gray-600">{ad.date}</span>
          </div>
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4">
          <div className="bg-white rounded p-4 max-w-sm w-full text-gray-700">
            <h3 className="font-semibold text-gray-800">Contact seller</h3>
            <p className="mt-2">{ad.seller}</p>
            <p className="mt-1 text-gray-600">{ad.contact || "No contact provided"}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowContact(false)} className="px-3 py-1 rounded border text-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
