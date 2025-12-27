'use client';

import { X, Briefcase, MapPin, Building, Banknote, Phone, FileText } from 'lucide-react';
import { useState } from 'react';
import { useJobStore } from '@/hooks/use-job-store';

interface PostJobModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PostJobModal({ isOpen, onClose }: PostJobModalProps) {
    const { addJob } = useJobStore();
    const [formData, setFormData] = useState<{
        title: string;
        company: string;
        location: string;
        type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship';
        salary: string;
        contact: string;
        description: string;
        educationLevel: string;
    }>({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        contact: '',
        description: '',
        educationLevel: 'SMA/SMK' // Special tag focus
    });
    const [errors, setErrors] = useState<{ contact?: string; salary?: string }>({});


    if (!isOpen) return null;

    // Validation functions
    const validateContact = (value: string): boolean => {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return phoneRegex.test(value.replace(/[\s-]/g, '')) || emailRegex.test(value);
    };

    const formatSalary = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleSalaryChange = (value: string) => {
        const formatted = formatSalary(value);
        setFormData({ ...formData, salary: formatted });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate contact
        if (!validateContact(formData.contact)) {
            setErrors({ contact: 'Masukkan nomor WA yang valid (08xxx) atau email' });
            return;
        }

        setErrors({});
        addJob({
            title: formData.title,
            company: formData.company,
            location: formData.location,
            type: formData.type,
            salary: formData.salary,
            description: formData.description,
            contact: formData.contact,
            tags: [formData.educationLevel, 'Tanpa Pengalaman'] // Auto-tagging for accessibility
        });
        onClose();
        setFormData({
            title: '', company: '', location: '', type: 'Full-time', salary: '', contact: '', description: '', educationLevel: 'SMA/SMK'
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-xl max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-brand-dark" />
                        Pasang Loker Baru
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Bantu teman-teman Rangkul mendapatkan pekerjaan.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Posisi / Jabatan</label>
                            <input
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark"
                                placeholder="Ex: Staff Admin"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Perusahaan</label>
                            <input
                                required
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark"
                                placeholder="Ex: Toko Maju Jaya"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Lokasi</label>
                            <div className="relative">
                                <input
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark"
                                    placeholder="Ex: Jakarta Selatan"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Gaji (Estimasi)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-sm text-zinc-500">Rp</span>
                                <input
                                    required
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-11 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark"
                                    placeholder="3.000.000"
                                    value={formData.salary}
                                    onChange={e => handleSalaryChange(e.target.value)}
                                />
                                <Banknote className="w-4 h-4 text-zinc-400 absolute right-3 top-2.5" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2">Jenis Pekerjaan</label>
                        <div className="flex gap-2">
                            {(['Full-time', 'Part-time', 'Freelance'] as const).map(type => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.type === type
                                        ? 'bg-brand-dark text-white border-brand-dark'
                                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-2">Minimal Pendidikan</label>
                        <div className="flex gap-2">
                            {(['SMP', 'SMA/SMK', 'D3', 'S1'] as const).map(level => (
                                <button
                                    type="button"
                                    key={level}
                                    onClick={() => setFormData({ ...formData, educationLevel: level })}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formData.educationLevel === level
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Kontak Lamaran (WA/Email)</label>
                        <div className="relative">
                            <input
                                required
                                className={`w-full bg-zinc-50 border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark ${errors.contact ? 'border-red-400' : 'border-zinc-200'
                                    }`}
                                placeholder="Ex: 081234567890 atau hrd@email.com"
                                value={formData.contact}
                                onChange={e => {
                                    setFormData({ ...formData, contact: e.target.value });
                                    setErrors({ ...errors, contact: undefined });
                                }}
                            />
                            <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                        </div>
                        {errors.contact && (
                            <p className="text-xs text-red-500 mt-1">{errors.contact}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Deskripsi Pekerjaan</label>
                        <div className="relative">
                            <textarea
                                required
                                rows={3}
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark resize-none"
                                placeholder="Jelaskan tugas, kualifikasi, dan benefit..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-brand-dark hover:bg-brand-dim text-brand-light font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-dark/10"
                        >
                            Terbitkan Loker
                        </button>
                    </div>

                </form>
            </div >
        </div >
    );
}
