import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Polyline } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Mapview({events,isSuspicious}) {
const path = events.map(e => [
  Number(e.location.lat),
  Number(e.location.lng)
]);
  return (
    <>
     <div className="font-bold text-2xl p-2">Mapview</div>

     <MapContainer
      center={events.length>0 ? [events[0].location.lat,events[0].location.lng]:[12.97, 77.59]}
      zoom={15}
      className="h-[500px] w-full rounded-lg p-2"
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
