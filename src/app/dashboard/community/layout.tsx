'use client';

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-[calc(100vh-64px)] w-full bg-white overflow-hidden">
            {children}
        </div>
    );
}
