'use client';

import Image from "next/image";
import clsx from "clsx";

interface FeatureSectionProps {
    title: string;
    description: string;
    imageSrc?: string; // Placeholder for now
    imageAlt?: string;
    imagePosition?: 'left' | 'right';
    className?: string;
}

export default function FeatureSection({
    title,
    description,
    imageSrc,
    imageAlt = "Feature illustration",
    imagePosition = 'left',
    className
}: FeatureSectionProps) {
    return (
        <section className={clsx("py-20 md:py-32 px-6", className)}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
                {/* Image Side */}
                <div className={clsx(
                    "flex-1 w-full flex justify-center",
                    imagePosition === 'right' ? "md:order-2" : "md:order-1"
                )}>
                    <div className="w-full max-w-lg aspect-video relative rounded-xl overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-500">
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={imageAlt}
                                className="w-full h-full object-cover bg-white"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-sm font-medium">
                                Illustration Mockup
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Side */}
                <div className={clsx(
                    "flex-1 w-full text-center md:text-left",
                    imagePosition === 'right' ? "md:order-1" : "md:order-2"
                )}>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight mb-6">
                        {title}
                    </h2>
                    <p className="text-lg text-zinc-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}
