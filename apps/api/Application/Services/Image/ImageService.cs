// File: apps/api/Infrastructure/Services/Image/ImageService.cs
// Cloudinary-based image upload service

using api.Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace api.Infrastructure.Services.Image;

public class ImageService : IImageService
{
    private readonly ILogger<ImageService> _logger;
    private readonly Cloudinary _cloudinary;

    // Config
    private static string CloudName =>
        Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") ?? "";
    private static string ApiKey =>
        Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? "";
    private static string ApiSecret =>
        Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? "";
    private static string DefaultFolder =>
        Environment.GetEnvironmentVariable("CLOUDINARY_FOLDER") ?? "vitakart";

    // Allowed formats
    private static readonly string[] AllowedFormats =
        { "jpg", "jpeg", "png", "webp", "gif" };

    // Max file size (5 MB)
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;

    public ImageService(ILogger<ImageService> logger)
    {
        _logger = logger;

        // Initialize Cloudinary
        var account = new Account(CloudName, ApiKey, ApiSecret);
        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }

    // ==========================================
    // UPLOAD IMAGE FROM FILE
    // ==========================================
    public async Task<ImageResult> UploadImageAsync(
        IFormFile file,
        string? folder = null)
    {
        // Validate file
        var validationResult = ValidateFile(file);
        if (!validationResult.Success)
        {
            return validationResult;
        }

        try
        {
            // Determine folder
            var uploadFolder = string.IsNullOrEmpty(folder)
                ? DefaultFolder
                : $"{DefaultFolder}/{folder}";

            // Read file into stream
            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = uploadFolder,
                UseFilename = false,
                UniqueFilename = true,
                Overwrite = false,
                Transformation = new Transformation()
                    .Quality("auto")
                    .FetchFormat("auto")
            };

            _logger.LogInformation("📤 Uploading image: {FileName} to folder: {Folder}",
                file.FileName, uploadFolder);

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                _logger.LogError("❌ Cloudinary error: {Error}",
                    uploadResult.Error.Message);

                return new ImageResult
                {
                    Success = false,
                    ErrorMessage = uploadResult.Error.Message
                };
            }

            _logger.LogInformation("✅ Image uploaded: {PublicId}", uploadResult.PublicId);

            return new ImageResult
            {
                Success = true,
                PublicId = uploadResult.PublicId,
                Url = uploadResult.Url?.ToString(),
                SecureUrl = uploadResult.SecureUrl?.ToString(),
                Width = uploadResult.Width,
                Height = uploadResult.Height,
                Format = uploadResult.Format,
                Bytes = uploadResult.Bytes
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Image upload failed: {Message}", ex.Message);

            return new ImageResult
            {
                Success = false,
                ErrorMessage = $"Upload failed: {ex.Message}"
            };
        }
    }

    // ==========================================
    // UPLOAD FROM URL
    // ==========================================
    public async Task<ImageResult> UploadImageFromUrlAsync(
        string imageUrl,
        string? folder = null)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return new ImageResult
            {
                Success = false,
                ErrorMessage = "Image URL is required"
            };
        }

        try
        {
            var uploadFolder = string.IsNullOrEmpty(folder)
                ? DefaultFolder
                : $"{DefaultFolder}/{folder}";

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(imageUrl),
                Folder = uploadFolder,
                UniqueFilename = true,
                Transformation = new Transformation()
                    .Quality("auto")
                    .FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                return new ImageResult
                {
                    Success = false,
                    ErrorMessage = uploadResult.Error.Message
                };
            }

            return new ImageResult
            {
                Success = true,
                PublicId = uploadResult.PublicId,
                Url = uploadResult.Url?.ToString(),
                SecureUrl = uploadResult.SecureUrl?.ToString(),
                Width = uploadResult.Width,
                Height = uploadResult.Height,
                Format = uploadResult.Format,
                Bytes = uploadResult.Bytes
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "URL upload failed");
            return new ImageResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    // ==========================================
    // DELETE IMAGE
    // ==========================================
    public async Task<bool> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return false;
        }

        try
        {
            var deletionParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deletionParams);

            var success = result.Result == "ok";

            if (success)
            {
                _logger.LogInformation("🗑️ Image deleted: {PublicId}", publicId);
            }
            else
            {
                _logger.LogWarning("⚠️ Delete failed: {PublicId} — {Result}",
                    publicId, result.Result);
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Delete failed for {PublicId}", publicId);
            return false;
        }
    }

    // ==========================================
    // GET OPTIMIZED URL
    // ==========================================
    public string GetOptimizedUrl(string publicId, int? width = null, int? height = null)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return string.Empty;
        }

        var transformation = new Transformation()
            .Quality("auto")
            .FetchFormat("auto");

        if (width.HasValue)
        {
            transformation = transformation.Width(width.Value).Crop("scale");
        }

        if (height.HasValue)
        {
            transformation = transformation.Height(height.Value).Crop("scale");
        }

        var url = _cloudinary.Api.UrlImgUp
            .Transform(transformation)
            .BuildUrl(publicId);

        return url;
    }

    // ==========================================
    // VALIDATE FILE
    // ==========================================
    private ImageResult ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return new ImageResult
            {
                Success = false,
                ErrorMessage = "File is empty"
            };
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return new ImageResult
            {
                Success = false,
                ErrorMessage = $"File too large. Max size: {MaxFileSizeBytes / (1024 * 1024)} MB"
            };
        }

        var extension = Path.GetExtension(file.FileName)
            .TrimStart('.')
            .ToLowerInvariant();

        if (!AllowedFormats.Contains(extension))
        {
            return new ImageResult
            {
                Success = false,
                ErrorMessage = $"Invalid format. Allowed: {string.Join(", ", AllowedFormats)}"
            };
        }

        return new ImageResult { Success = true };
    }
}