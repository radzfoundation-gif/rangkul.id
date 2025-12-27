import { usersApi } from './firestore-users';

// Helper to compress image (same as before)
async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;

                // Resize to 512x512 max
                let width = img.width;
                let height = img.height;
                const maxSize = 512;

                if (width > height) {
                    if (width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob || file);
                }, 'image/jpeg', 0.85);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export const storageApi = {
    async uploadProfilePhoto(userId: string, file: File): Promise<string> {
        try {
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image');
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File size must be less than 5MB');
            }

            // Compress image
            const compressed = await compressImage(file);

            // Upload to Cloudinary
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'd3da6b1cd45';
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'RANGKUL';

            console.log('🔍 Cloudinary Config:', { cloudName, uploadPreset });

            const formData = new FormData();
            formData.append('file', compressed);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', `rangkul-users/${userId}`);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();
            const url = data.secure_url;

            console.log('📸 Cloudinary URL:', url);

            // Update Firestore
            console.log('💾 Updating Firestore for user:', userId);
            await usersApi.updateProfile(userId, { photoURL: url });
            console.log('✅ Firestore updated successfully');

            return url;
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw error;
        }
    },

    async removeProfilePhoto(userId: string): Promise<void> {
        try {
            // For unsigned uploads, we just update Firestore to remove the URL
            // (Can't delete via API without signed request)
            await usersApi.updateProfile(userId, { photoURL: null });
        } catch (error) {
            console.error('Error removing photo:', error);
            throw error;
        }
    }
};
