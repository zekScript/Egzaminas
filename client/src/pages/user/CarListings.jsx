import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import './CarListing.css'
import formatDate from '../../components/funcs/formatDate'


const CarListings = () => {
  const [listing, setListing] = useState(null)
  // const [seller, setSeller] = useState(null)
  const params = useParams()

  useEffect(() => {
    const fetchCarListings = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/skelbimai/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const json = await res.json()
        if (res.ok && json.skelbimai && json.skelbimai.length > 0) {
          setListing(json.skelbimai[0])
        }


        const userRes = await fetch(`http://localhost:8000/api/user/${json.skelbimai[0].author}`)
        

       
      } catch (error) {
        console.error("Error fetching car listings:", error);
      }
    }
    fetchCarListings()
  }, [params.id])



  if (!listing) return <div>Loading...</div>

  
  return (
    <div style={{padding: "24px"}}>
      {/* Title */}
      <div>
        <h3>{listing.title}</h3>
        <p>Skelbimas sukurtas: {formatDate(listing.createdAt)}</p>
      </div>
      <div className='d-flex'>
        {/* Side info */}
        
        {/* Main container */}
        <div className='container ' >
<div id="carouselExampleIndicators" style={{marginBottom: "15px"}} className="carousel slide">
  {/* <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div> */}
  <div className="carousel-inner">
  {listing.imageUrl && listing.imageUrl.map((img, idx) => (
    <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
      <img
        src={`http://localhost:8000${img}`}
        className="d-block" 
        style={{width: "100%", height: "400px", objectFit: "cover"}}
        alt={`${listing.title}-${idx}`}
      />
    </div>
  ))}
</div>

  <button className="carousel-control-prev bg-lime" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>



        </div>
      </div>

<div className='w-100 ' style={{marginTop: "15px", overflowWrap: "break-word"}}>
<h3>Aprašymas</h3>
      <hr/>
      <p>{listing.description}</p>
</div>
      
      
    </div>
  )
}

export default CarListings