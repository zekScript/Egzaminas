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
        <div className="result-listing mt-3">
        <h1>Neseniai sukurti renginiu skelbimai</h1>

{fetchedAllListings.map((post, index) => (
          <a href={`/${post._id}/renginys`} style={{textDecoration: "none", marginTop: "15px"}} className="d-flex w-100 "  key={index}>
            <img
              src={`http://localhost:8000${post.imageUrl[0]}`}
              style={{width: "240px", height: "180px", display: "block"}}
              alt={post.title}
              className="listing-img-dark"
            />
            <div className="d-flex  w-100" style={{flexDirection: "column", marginLeft: "32px"}}>
<div className="listing-info-result text-muted ml-0 w-100">
              <div className="listing-content w-100">
              <p>{post.title}</p>

              </div>
              
            </div>
           <hr/>
              <div className="d-flex align-items-center justify-content-start gap-3 text-light" style={{fontSize: "14px"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
 <div className="d-flex align-items-center justify-content-start gap-3">

                <p className="fs-4">{truncateText(post.description, 50)}</p>

                </div>
                
                </div>
               
  
  
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
