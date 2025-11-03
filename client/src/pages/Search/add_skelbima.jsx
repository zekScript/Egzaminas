import React, { useState } from "react";
import Cookies from "js-cookie";
import "./add_skelbima.css";
import {useNavigate} from "react-router-dom"
import { toast } from 'react-hot-toast'

const Add_skelbima = () => {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState(null);
  const [description, setDescription] = useState("");
  const nav = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("title", title);


    if (imageUrl) {
      for (let i = 0; i < imageUrl.length; i++) {
        formData.append("images", imageUrl[i]);
      }
    }

    const res = await fetch("http://localhost:8000/api/add_skelbima", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: formData,
    });
    const json = await res.json()
    console.log(res)
    console.log(json)
    if (res.ok) {
      toast.success(
        `Skelbimas sėkmingai idėtas`,
        {
          position: "top-right",
          duration: 3000,
        }
      );
    }

    if(res.status === 401){
      nav("/login")
    }
  };


  

  return (
    <div className="container my-5">
      <h2 className="mb-4">Pridėti skelbimą</h2>
      <form onSubmit={handleSubmit} className="row g-3 p-4 rounded shadow-sm">
        <div className="form-container">
          <label>Turinys</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Jomajo cirkas..." ></input>
          <label>Aprašymas</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            name="description"
            value={description}
            className="form-control"
            rows={3}
            required
          ></textarea>
           <input
            onChange={(e) => setImageUrl(e.target.files)}
            type="file"
            accept="image/*"
            name="images"
            className="form-control"
            multiple
            required
          />
          <button type="submit">Sukurti skelbimą</button>
        </div>

      </form>
    </div>
  );
};

export default Add_skelbima;