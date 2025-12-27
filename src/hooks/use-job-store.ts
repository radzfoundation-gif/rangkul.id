import { create } from 'zustand';

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship';
    tags: string[];
    salary: string;
    description: string;
    postedAt: Date;
    contact: string;
}


const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Staff Admin Gudang',
        company: 'Logistik Jaya Abadi',
        location: 'Jakarta Barat',
        type: 'Full-time',
        tags: ['Lulusan SMA/SMK', 'Tanpa Pengalaman'],
        postedAt: new Date(),
        salary: 'Rp 4.500.000 - 5.000.000',
        description: 'Dibutuhkan segera staff admin gudang. Tugas: rekap data masuk keluar barang.',
        contact: 'WA: 08123456789'
    },
    {
        id: '2',
        title: 'Barista & Crew Outlet',
        company: 'Kopi Kenangan',
        location: 'Bandung',
        type: 'Part-time',
        tags: ['Flexible Hours', 'Mahasiswa'],
        postedAt: new Date(Date.now() - 3600000 * 5),
        salary: 'Rp 150.000 / shift',
        description: 'Dicari crew outlet yang ceria dan mau belajar.',
        contact: 'hrd@kopikenangan.com'
    }
];

interface JobState {
    jobs: Job[];
    addJob: (job: Omit<Job, 'id' | 'postedAt'>) => void;
}

export const useJobStore = create<JobState>((set) => ({
    jobs: MOCK_JOBS,
    addJob: (newJob) => set((state) => ({
        jobs: [{
            ...newJob,
            id: Math.random().toString(36).substr(2, 9),
            postedAt: new Date()
        }, ...state.jobs]
    }))
}));
