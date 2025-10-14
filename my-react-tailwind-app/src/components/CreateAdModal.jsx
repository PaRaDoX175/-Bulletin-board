import { useState, useRef } from "react";
import { categories } from "../data/categories";
import {fileToDataUrl} from "../utils/fileToDataUrl.js";

export default function CreateAdModal({ onClose, onAdCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const baseUrl = 'http://localhost:5197/api'

  const fileRef = useRef();

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Add title");
      return;
    }

    let img;

    if (imageUrl === null && imageFile === null) img = null;
    else if (imageUrl === null) img = imageFile;
    else img = imageUrl;

    const ad = {
        title,
        description,
        price,
        category,
        location,
        contact,
        imageUrl: img,
    }

    console.log(ad);

    await addAdToDb(ad)
    if (onAdCreated) onAdCreated();
    onClose()
  };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(await fileToDataUrl(file));
    };

  const addAdToDb = async (ad) => {

      const adToDb = {
          title: ad.title,
          description: ad.description,
          price: ad.price,
          category: ad.category,
          location: ad.location,
          contact: ad.contact,
          image: ad.imageUrl,
      }

      try {
          await fetch(baseUrl + '/ads/add', {
              method: "POST",
              headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("accessToken")}`},
              body: JSON.stringify(adToDb)
          })

      } catch {
          console.log('smth went wrong')
      }
  }

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 text-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Create ad</h2>
          <button onClick={onClose} className="text-gray-600 text-xl">×</button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-700" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2 h-28 text-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Price (USD)</label>
              <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" className="w-full border rounded px-3 py-2 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-700">
                {categories.slice(1).map(c => (
                  <option className="text-gray-700" key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Contact (phone/email)</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full border rounded px-3 py-2 text-gray-700" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Picture (file) or URL</label>
            <div className="flex gap-2 items-center">
              <input type="file" ref={fileRef} onChange={(e) => handleFileChange(e)} className="border rounded px-2 py-1 text-gray-700" />
              <input placeholder="https://..." value={imageUrl === null ? '' : imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="flex-1 border rounded px-3 py-2 text-gray-700" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
          </div>
        </form>
      </div>
      </div>
  );
}
