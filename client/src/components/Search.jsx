import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./searchForm.css"
import { numberWithCommas } from "./funcs/bigNumberSeparation";
import { truncateText } from "../truncText/TruncText";
const Search = () => {
  const [q, setQ] = useState("")
  const [fetchedAllListings, setFetchedAllListings] = useState([])
  const nav = useNavigate();

  

 
  

  

  const handleSubmit = (e) => {
    e.preventDefault()
  nav(`/search?q=${q}`)    
  };

 useEffect(() => {
   const fetchAllListings = async () => {
    const res = await fetch("http://localhost:8000/api/allListings")
    const data = await res.json()
    if(res.status === 404){
      return console.log("there are no data")
    }
    
    setFetchedAllListings(data)
  }

  fetchAllListings()
 }, []) 


  return (
    <div>
      <div className="search-wrapper">
        <form className="search-form-dark" onSubmit={handleSubmit}>
          <div>
            <input type="text" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)}             className="form-control"
></input>
          </div>
          <div className="form-group w-100 d-flex justify-content-end">
            <button type="submit" className="btn btn-primary mt-3">
              Ieškoti
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="results-section-dark">
        <h1>Nesenai sukurti renginiu skelbimai</h1>
        <div className="results-list-dark">

{fetchedAllListings.map((post, index) => (
          <a href={`/${post._id}/renginys`} style={{textDecoration: "none"}} className="listing-card-dark" key={index}>
            <img
              src={`http://localhost:8000${post.imageUrl[0]}`}

              alt={post.title}
              className="listing-img-dark"
            />
            <div className="listing-info-dark">
              <div className="listing-content w-100">
              <p>{post.title}</p>
              <p>{truncateText(post.description, 25)} </p>
              </div>
              
            </div>
          </a>
        ))}







        </div>
      </div>
    </div>
  );
};

export default Search;
