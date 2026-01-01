// utils/imageHelper.ts
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api")
    .trim()
    .replace(/\/api$/, ""); // Remove /api suffix to get base URL

/**
 * Converts relative image paths to full URLs
 * @param path - The image path from the API (e.g., "categories/image.png" or full URL)
 * @returns Full image URL
 */
export const getImageUrl = (path: string | undefined | null): string => {
    console.log('🖼️ getImageUrl called with:', path);
    console.log('📍 API_BASE_URL:', API_BASE_URL);
    
    if (!path) {
        console.log('⚠️ No path provided, returning placeholder');
        return "/assets/images/icons/image-placeholder.svg"; // fallback
    }

    // If already a full URL (starts with http:// or https://), return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
        console.log('✅ Full URL detected, returning as-is:', path);
        return path;
    }

    // If path already starts with "storage/", don't add it again
    if (path.startsWith("storage/")) {
        const fullUrl = `${API_BASE_URL}/${path}`;
        console.log('✅ Storage path detected, generated URL:', fullUrl);
        return fullUrl;
    }

    // If path starts with "/", remove it
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // If it's a relative path, prepend the storage URL
    const fullUrl = `${API_BASE_URL}/storage/${cleanPath}`;
    console.log('✅ Relative path, generated URL:', fullUrl);
    return fullUrl;
};
