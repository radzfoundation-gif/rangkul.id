'use client';

import { useState } from 'react';
import { Smile, Frown, Meh, Heart, Zap } from 'lucide-react';

const moods = [
    { icon: Frown, label: 'Berat', color: 'text-red-500', bg: 'bg-red-50', message: 'Tidak apa-apa merasa lelah. Istirahatlah sejenak.' },
    { icon: Meh, label: 'Biasa', color: 'text-yellow-500', bg: 'bg-yellow-50', message: 'Hari yang tenang juga sebuah anugerah.' },
    { icon: Smile, label: 'Baik', color: 'text-brand-dark', bg: 'bg-brand-light', message: 'Senang mendengarnya! Bagikan energimu.' },
    { icon: Zap, label: 'Semangat', color: 'text-blue-500', bg: 'bg-blue-50', message: 'Wow! Manfaatkan energi ini untuk hal hebat.' },
    { icon: Heart, label: 'Bersyukur', color: 'text-pink-500', bg: 'bg-pink-50', message: 'Rasa syukur adalah kunci kebahagiaan.' },
];

export default function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);

    return (
        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Apa kabar hatimu hari ini?</h3>
            <p className="text-sm text-zinc-500 mb-6">Check-in harian membantu kami memahami kebutuhanmu.</p>

            <div className="flex justify-between gap-2">
                {moods.map((mood, idx) => {
                    const isSelected = selectedMood === idx;
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedMood(idx)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 w-full group ${isSelected ? `${mood.bg} scale-105 shadow-sm` : 'hover:bg-zinc-50'
                                }`}
                        >
                            <mood.icon
                                className={`w-8 h-8 transition-transform duration-300 ${isSelected ? mood.color : 'text-zinc-300 group-hover:scale-110'
                                    }`}
                                strokeWidth={isSelected ? 2.5 : 2}
                            />
                            <span className={`text-xs font-medium ${isSelected ? 'text-zinc-900' : 'text-zinc-400'}`}>
                                {mood.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedMood !== null && (
                <div className="mt-6 p-4 rounded-lg bg-zinc-50 border border-zinc-100 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm text-zinc-700 italic">
                        "{moods[selectedMood].message}"
                    </p>
                </div>
            )}
        </div>
    );
}
