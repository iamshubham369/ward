import React, { useEffect, useRef, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../context/AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle the cinematic "Fly In" from India to the Ward
const MapFlyToController = ({ targetCenter }) => {
    const map = useMap();

    useEffect(() => {
        // Wait 800ms before starting the cinematic zoom
        const timeout = setTimeout(() => {
            map.flyTo(targetCenter, 16, {
                duration: 4.5, // 4.5 seconds cinematic pan/zoom
                easeLinearity: 0.25
            });
        }, 800);

        return () => clearTimeout(timeout);
    }, [map, targetCenter]);

    return null;
};

// Custom Glowing Markers
const createGlowIcon = (color) => {
    return L.divIcon({
        className: 'custom-glow-icon',
        html: `<div style="
            width: 18px; 
            height: 18px; 
            background-color: ${color}; 
            border-radius: 50%; 
            border: 3px solid #1e293b; 
            box-shadow: 0 0 15px ${color}, inset 0 0 5px white;
        ">
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                background-color: ${color};
                border-radius: 50%;
                opacity: 0.3;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
        </div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });
};

const TacticalMap = ({ issues, projects }) => {
    const { t } = useTranslation();
    const { language } = useContext(AppContext);
    
    // Default Ward Center
    const wardCenter = [21.1458, 79.0882];
    
    const [is3D, setIs3D] = useState(false);

    // Ultra High-Res Google Maps Hybrid (Satellite + Roads)
    const googleHybrid = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
    const darkTiles = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    const issueIcon = createGlowIcon('#ef4444'); // Red Glow
    const projectIcon = createGlowIcon('#3b82f6'); // Blue Glow

    return (
        <div className="w-full h-[550px] rounded-3xl overflow-hidden border border-navy-700 shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-12 mb-12 relative group">
            {/* Center starts at India [22.9734, 78.6569], Zoom 4.5 */}
            <MapContainer center={[22.9734, 78.6569]} zoom={4.5} scrollWheelZoom={true} className="w-full h-full">
                
                <MapFlyToController targetCenter={wardCenter} />
                
                <TileLayer
                    url={is3D ? googleHybrid : darkTiles}
                    attribution='&copy; Google Maps & OpenStreetMap'
                />
                
                {issues.map(issue => (
                    issue.lat && issue.lng && (
                        <Marker key={`issue-${issue.id}`} position={[issue.lat, issue.lng]} icon={issueIcon}>
                            <Popup className="custom-popup">
                                <div className="p-2 font-mono">
                                    <b className="text-red-500 uppercase text-[10px]">{t('map.hazard')}: {t(`cat.${(issue.category || '').toLowerCase().replace(' ', '_')}`)}</b><br/>
                                    <span className="text-navy-900 text-xs">{issue.description}</span>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}

                {projects.map(proj => (
                    proj.lat && proj.lng && (
                        <Marker key={`proj-${proj.id}`} position={[proj.lat, proj.lng]} icon={projectIcon}>
                            <Popup className="custom-popup">
                                <div className="p-2 font-mono">
                                    <b className="text-sky-500 uppercase text-[10px]">{t('map.op')}: {t(`cat.${(proj.category || '').toLowerCase().replace(' ', '_')}`)}</b><br/>
                                    <span className="text-navy-900 text-xs">{language === 'hi' ? proj.name_hi : language === 'mr' ? proj.name_mr : proj.name_en}</span><br/>
                                    <span className="text-stone-500 text-[8px]">{t('map.prog')}: {proj.progress}%</span>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
                
                {/* 3D Map Toggle Button */}
                <button 
                    onClick={() => setIs3D(!is3D)}
                    className="absolute top-6 left-6 z-[1000] bg-navy-900/80 hover:bg-navy-800 backdrop-blur-md px-4 py-2.5 rounded-xl border border-navy-700 text-stone-100 font-mono text-[9px] uppercase tracking-widest font-black shadow-2xl flex items-center gap-3 transition-all cursor-pointer"
                >
                    <div className={`w-2 h-2 rounded-full ${is3D ? 'bg-saffron-500 shadow-saffron-500/50' : 'bg-emerald-500 shadow-emerald-500/50'} animate-pulse shadow-lg`}></div>
                    {is3D ? "SWITCH TO DARK CYBER MAP" : "ENABLE 3D SATELLITE TERRAIN"}
                </button>

            </MapContainer>
        </div>
    );
};

export default TacticalMap;
