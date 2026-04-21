import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Polyline } from "react-leaflet";


export default function Mapview({events,isSuspicious}) {
const path = events.slice(-5).map((e, i) => [
  Number(e.location.lat) + i * 0.0005,
  Number(e.location.lng) + i * 0.0005
]);
  return (
    <>
     <div>Mapview</div>

     <MapContainer
      center={events.length>0 ? [events[0].location.lat,events[0].location.lng]:[12.97, 77.59]}
      zoom={15}
      className="h-[500px] w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {isSuspicious?.toLowerCase().includes("yes") && (
  <Polyline positions={path} color="red" />
)}

      {events.map((event, i) => (
        <Marker key={i} position={[event.location.lat, event.location.lng]}>
          <Popup>
            <b>{event.type}</b><br />
            {new Date(event.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </>
   
  )
}
