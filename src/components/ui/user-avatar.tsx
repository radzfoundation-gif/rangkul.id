import { User } from 'lucide-react';
import Image from 'next/image';

interface UserAvatarProps {
    photoURL?: string | null;
    fallbackColor?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function UserAvatar({ photoURL, fallbackColor = 'bg-brand', name, size = 'md' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg'
    };

    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    if (photoURL) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden relative flex-shrink-0`}>
                <Image
                    key={photoURL}
                    src={photoURL}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} ${fallbackColor} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
            {initials}
        </div>
    );
}
