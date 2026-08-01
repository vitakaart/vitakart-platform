// File: apps/api/Controllers/ImagesController.cs
// Endpoint for image uploads

using api.API.RateLimiting;
using api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ImagesController : ControllerBase
{
    private readonly IImageService _imageService;

    public ImagesController(IImageService imageService)
    {
        _imageService = imageService;
    }

    // POST: api/images/upload
    // Upload single image (multipart/form-data)
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB
    public async Task<ActionResult<ImageResult>> UploadImage(IFormFile file,
        [FromQuery] string? folder = null)
    {
        if (file == null)
        {
            return BadRequest(new { message = "No file provided" });
        }

        var result = await _imageService.UploadImageAsync(file, folder);

        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage });
        }

        return Ok(result);
    }

    // POST: api/images/upload-multiple
    // Upload multiple images
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost("upload-multiple")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50 MB total
    public async Task<ActionResult<List<ImageResult>>> UploadMultipleImages(List<IFormFile> files,
        [FromQuery] string? folder = null)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest(new { message = "No files provided" });
        }

        if (files.Count > 10)
        {
            return BadRequest(new { message = "Maximum 10 files allowed" });
        }

        var results = new List<ImageResult>();

        foreach (var file in files)
        {
            var result = await _imageService.UploadImageAsync(file, folder);
            results.Add(result);
        }

        return Ok(results);
    }

    // DELETE: api/images/{publicId}
    // Delete image from Cloudinary
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpDelete("{**publicId}")]
    public async Task<ActionResult> DeleteImage(string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest(new { message = "Public ID is required" });
        }

        var success = await _imageService.DeleteImageAsync(publicId);

        if (!success)
        {
            return NotFound(new { message = "Image not found or delete failed" });
        }

        return Ok(new { message = "Image deleted successfully" });
    }
}