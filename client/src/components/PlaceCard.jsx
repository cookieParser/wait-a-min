import React from 'react';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';

const PlaceCard = ({ place }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/place/${place._id}`)}
            className="card hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group"
        >
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary">{place.name}</h3>
                <p className="text-sm text-slate-500 flex items-center mt-1">
                    <MapPin size={14} className="mr-1" /> {place.address}
                </p>

                <div className="mt-3 flex items-center space-x-2">
                    <div className="flex items-center text-accent font-bold bg-accent/10 px-2 py-1 rounded-md">
                        <Clock size={16} className="mr-1.5" />
                        {place.currentWaitTime} min
                    </div>
                    <StatusBadge level={place.crowdLevel} />
                </div>
            </div>

            <div className="text-slate-300 group-hover:text-primary transition-colors">
                <ChevronRight size={24} />
            </div>
        </div>
    );
};

export default PlaceCard;
