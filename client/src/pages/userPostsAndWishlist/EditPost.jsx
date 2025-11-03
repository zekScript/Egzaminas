import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
// import "./add_skelbima.css";
import {useNavigate, useSearchParams} from "react-router-dom"
import formatDate from "../../components/funcs/formatDate"
import toast from "react-hot-toast"

const EditPost = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("");
  const [searchParams ] = useSearchParams()


  const p = searchParams.get("p")

  console.log(title, description)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {
      title,
      description
    };
    const res = await fetch(`http://localhost:8000/api/update/myListing/${p}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (res.ok) {
      toast.success(
        `Skelbimas sėkmingai pakeistas. Puslapis persikraus per 2 sekundes`,
        {
          position: "top-right",
          duration: 3000,
        }
      );
      setTimeout(() => window.location.reload(), 2000)
    }

    
  };

   useEffect(() => {
    const fetchPostData = async () => {
        const getPostDataRes = await fetch(`http://localhost:8000/api/findListingByPostId/${p}`)
        const resPostData = await getPostDataRes.json()
        setTitle(resPostData.findPostById[0].title)
        setDescription(resPostData.findPostById[0].description)
    }
    fetchPostData()
  }, [])

  


  return (
    <div className="container my-5">
      <h2 className="mb-4">Pridėti skelbimą</h2>
      <form onSubmit={handleSubmit} className="row g-3 p-4 rounded shadow-sm">
        <div className="col-md-6">
          <label className="form-label">Turinys</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Aprašymas</label>
          <input
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            value={description}
            className="form-control"
            required
          />
          
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary px-4">
            Keisti skelbimo duomenys
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPost