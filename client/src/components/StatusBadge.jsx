import React from 'react';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const StatusBadge = ({ level, type = 'crowd' }) => {
    // type: 'crowd' | 'confidence'

    const getStyles = (lvl) => {
        switch (lvl) {
            case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'High': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getIcon = (lvl) => {
        if (type === 'confidence') return null; // Confidence usually just text
        if (lvl === 'Low') return <CheckCircle size={14} className="mr-1" />;
        if (lvl === 'Medium') return <Users size={14} className="mr-1" />;
        if (lvl === 'High') return <AlertCircle size={14} className="mr-1" />;
        return null;
    };

    return (
        <span className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getStyles(level)
        )}>
            {getIcon(level)}
            {level} {type === 'crowd' ? 'Crowd' : 'Confidence'}
        </span>
    );
};

export default StatusBadge;
