// File: apps/api/Application/Interfaces/IImageService.cs
// Image upload service contract

namespace api.Application.Interfaces;

public interface IImageService
{
    // Upload single image from file
    Task<ImageResult> UploadImageAsync(
        IFormFile file,
        string? folder = null);

    // Upload from URL (for future use)
    Task<ImageResult> UploadImageFromUrlAsync(
        string imageUrl,
        string? folder = null);

    // Delete image by public ID
    Task<bool> DeleteImageAsync(string publicId);

    // Get optimized image URL with transformations
    string GetOptimizedUrl(string publicId, int? width = null, int? height = null);
}

// Result of upload — renamed to avoid conflict with Cloudinary's ImageUploadResult
public class ImageResult
{
    public bool Success { get; set; }
    public string? PublicId { get; set; }
    public string? Url { get; set; }
    public string? SecureUrl { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public string? Format { get; set; }
    public long Bytes { get; set; }
    public string? ErrorMessage { get; set; }
}