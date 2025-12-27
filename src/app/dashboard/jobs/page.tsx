'use client';

import { Briefcase, ExternalLink, MapPin, Clock, PlusCircle } from 'lucide-react';
import { useJobStore } from '@/hooks/use-job-store';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import PostJobModal from '@/components/modals/post-job-modal';

export default function JobsPage() {
    const { jobs } = useJobStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-light/50 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-brand-dark" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 leading-none">Lowongan Pekerjaan</h1>
                        <p className="text-sm text-zinc-500 mt-1">Peluang terpilih untuk memulai karirmu.</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hidden sm:flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-zinc-900/10"
                >
                    <PlusCircle className="w-4 h-4" />
                    Pasang Loker
                </button>
            </div>

            {/* Mobile Fab */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-dark text-brand-light rounded-full shadow-xl flex items-center justify-center z-40"
            >
                <PlusCircle className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-brand-dark transition-colors line-clamp-1" title={job.title}>{job.title}</h3>
                                <p className="text-sm text-zinc-500 font-medium">{job.company}</p>
                            </div>
                            <span className="text-[10px] font-medium px-2.5 py-1 bg-brand-light/30 text-brand-dark rounded-full border border-brand-light/50 whitespace-nowrap">
                                {job.type}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {job.tags.map((tag, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-1 bg-zinc-50 border border-zinc-100 rounded-md text-zinc-600">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 border-y border-zinc-50 py-3">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[100px]">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {/* Safe date handling */}
                                    {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true, locale: id })}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-zinc-900 truncate mr-2">{job.salary}</span>
                                <button className="text-xs font-medium bg-white border border-zinc-200 text-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2 shrink-0">
                                    Lamar
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <PostJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
