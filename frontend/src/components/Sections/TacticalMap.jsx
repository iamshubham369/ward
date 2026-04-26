import React, { useEffect, useRef, useContext } from 'react';
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

const TacticalMap = ({ issues, projects }) => {
    const { t } = useTranslation();
    const { language } = useContext(AppContext);
    return (
        <div className="w-full h-96 rounded-3xl overflow-hidden border border-navy-700 shadow-2xl mt-12 mb-12 relative group">
            <MapContainer center={[21.1458, 79.0882]} zoom={15} scrollWheelZoom={false} className="w-full h-full">
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {issues.map(issue => (
                    issue.lat && issue.lng && (
                        <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                            <Popup>
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
                        <Marker key={proj.id} position={[proj.lat, proj.lng]}>
                            <Popup>
                                <div className="p-2 font-mono">
                                    <b className="text-sky-500 uppercase text-[10px]">{t('map.op')}: {t(`cat.${(proj.category || '').toLowerCase().replace(' ', '_')}`)}</b><br/>
                                    <span className="text-navy-900 text-xs">{language === 'hi' ? proj.name_hi : language === 'mr' ? proj.name_mr : proj.name_en}</span><br/>
                                    <span className="text-stone-500 text-[8px]">{t('map.prog')}: {proj.progress}%</span>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
                <div className="absolute top-6 left-6 z-[1000] bg-navy-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-navy-700 text-stone-100 font-mono text-[9px] uppercase tracking-widest font-black shadow-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    {t('map.satellite')}
                </div>
            </MapContainer>
        </div>
    );
};

export default TacticalMap;
