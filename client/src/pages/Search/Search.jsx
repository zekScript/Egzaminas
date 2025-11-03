import { useState, useEffect } from "react"
import { useLoaderData, useLocation, useNavigate, useSearchParams } from "react-router"
import "./sidebars.css"
import { numberWithCommas } from "../../components/funcs/bigNumberSeparation"
import "./searchResult.css"
import formatDate from "../../components/funcs/formatDate"
import engineConverter from "../../components/funcs/horsepowerAndKWConverter"

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentSortingFilter, setCurrentSortingFilter] = useState("cheapest")

  // Extract params
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const minMileage = searchParams.get("minMileage")
  const maxMileage = searchParams.get("maxMileage")
  const fuelType = searchParams.get("fuelType")
  const model = searchParams.get("model")
  const carName = searchParams.get("carName")
  const carType = searchParams.get("carType")
  const sortBy = searchParams.get("sortBy")
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      // Build query string
      const params = new URLSearchParams()
      if (startDate) params.append("startDate", startDate)
      if (endDate) params.append("endDate", endDate)
      if (minPrice) params.append("minPrice", minPrice)
      if (maxPrice) params.append("maxPrice", maxPrice)
      if (minMileage) params.append("minMileage", minMileage)
      if (maxMileage) params.append("maxMileage", maxMileage)
      if (fuelType) params.append("fuelType", fuelType)
      if (model) params.append("model", model)
      if (carName) params.append("carName", carName)
      if(carType) params.append("carType", carType)
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

  const handleChangeFilters = (value) => {
  const params = new URLSearchParams(location.search);
  params.set("sortBy", value); 
  setCurrentSortingFilter(value);
  nav(`${location.pathname}?${params.toString()}`);
};

  
console.log(results)

  return (
    <div className="m-auto w-50">
      <select name="sortBy" value={currentSortingFilter} onChange={(e) => handleChangeFilters(e.target.value)}>
          <option value="cheapest">Pigiausi viršuje</option>
          <option value="most_expensive">Brangiausi viršuje</option>
          <option value="newest">Naujausi viršuje</option>
          <option value="oldest">Seniausi viršuje</option>
          <option value="mileage_highest">mažiausia rida</option>
          <option value="mileage_lowest">didžiausia rida</option>
        </select>
    <div className="d-flex" style={{marginRight: "32px"}}>
      {loading && <div>Loading...</div>}
      {!loading && results.length === 0 && <div>No results found.</div>}
      
      <div className="result-listing mt-3 " style={{textDecoration: "none"}}>
        
{results.map((car, index) => (
          <a href={`/${car._id}/car_listings`} style={{textDecoration: "none", marginTop: "15px"}} className="d-flex w-100 "  key={index}>
            <img
              src={`http://localhost:8000${car.imageUrl[0]}`}
              style={{width: "240px", height: "180px", display: "block"}}
              alt={car.model}
              className="listing-img-dark"
            />
            <div className="d-flex  w-100" style={{flexDirection: "column", marginLeft: "32px"}}>
<div className="listing-info-result text-muted ml-0 w-100">
              {/* <h4>{car.model}</h4> */}
              <div className="listing-content w-100">
              <p>{car.carName} {car.model} {car.engineLiter}L</p>
              </div>
              <div className="text-center" >
              <p className="text-warning fw-bold" style={{fontSize: "18px", fontWeight: "bold"}}>€{numberWithCommas(car.price)} </p>

              </div>
            </div>
           <hr/>
              <div className="d-flex align-items-center justify-content-start gap-3 text-light" style={{fontSize: "14px"}}>
                <div style={{display: "flex", flexDirection: "column"}}>
 <div className="d-flex align-items-center justify-content-start gap-3">
<div className="d-flex align-items-center gap-2">
    <p className="mb-0">{car.mileage} km</p>
    <div className="vr"></div>
  </div>
  <div className="d-flex align-items-center gap-2">
    <p className="mb-0">{formatDate(car.firstRegistration)}</p>
    <div className="vr"></div>
  </div>
  <div className="d-flex align-items-center gap-2">
    <p className="mb-0">{car.fuelType}</p>
    <div className="vr"></div>
  </div>
  
  <div className="d-flex align-items-center gap-2">
    <p className="mb-0">{car.enginePower}kW</p>
    <div className="vr"></div>
  </div>
  <div className="d-flex align-items-center gap-2">
    <p className="mb-0">{car.carType}</p>
        <div className="vr"></div>

  </div>
                </div>
                <div className="mt-2">
                  <div className="d-flex align-items-center gap-2">
                  <p className="mb-0">{car.color}</p>
                  <div className="vr"></div>
                </div>
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