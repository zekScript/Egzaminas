import { useState, useEffect } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import "./sidebars.css"
import "./searchResult.css"
import { truncateText } from "../../truncText/TruncText";


const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentSortingFilter, setCurrentSortingFilter] = useState("cheapest")

  // Extract params
  const q = searchParams.get("q")
  console.log(q)
  const sortBy = searchParams.get("sortBy")
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      // Build query string
      const params = new URLSearchParams()
      if(q) params.append("q", q)
      if(sortBy) params.append("sortBy", sortBy)

      const res = await fetch(`http://localhost:8000/api/listings/search?${params.toString()}`)
      const data = await res.json()
      
      setResults(data.skelbimai || [])
      setLoading(false)
    }
    fetchListings()
  }, [searchParams])
  const nav = useNavigate()
  const location = useLocation()

  

  
console.log(results)

  return (
    <div className="m-auto w-50">
      {/* <select name="sortBy" value={currentSortingFilter} onChange={(e) => handleChangeFilters(e.target.value)}>
          <option value="cheapest">Pigiausi viršuje</option>
          <option value="most_expensive">Brangiausi viršuje</option>
          <option value="newest">Naujausi viršuje</option>
          <option value="oldest">Seniausi viršuje</option>
          <option value="mileage_highest">mažiausia rida</option>
          <option value="mileage_lowest">didžiausia rida</option>
        </select> */}
    <div className="d-flex" style={{marginRight: "32px"}}>
      {loading && <div>Loading...</div>}
      {!loading && results.length === 0 && <div>No results found.</div>}
      
      <div className="result-listing mt-3 " style={{textDecoration: "none"}}>
        
{results.map((post, index) => (
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
  )
}

export default SearchPage