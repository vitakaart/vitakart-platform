// File: apps/api/Controllers/AddressesController.cs

using api.API.RateLimiting;
using api.Application.DTOs;
using api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressesController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    // GET: api/addresses — All user addresses
    [HttpGet]
    public async Task<ActionResult<List<AddressDto>>> GetMyAddresses()
    {
        var userId = GetUserId();
        var addresses = await _addressService.GetUserAddressesAsync(userId);
        return Ok(addresses);
    }

    // GET: api/addresses/default — Get default address
    [HttpGet("default")]
    public async Task<ActionResult<AddressDto>> GetDefaultAddress()
    {
        var userId = GetUserId();
        var address = await _addressService.GetDefaultAddressAsync(userId);

        if (address == null)
        {
            return NotFound(new { message = "No default address found" });
        }

        return Ok(address);
    }

    // GET: api/addresses/{id} — Get single address
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AddressDto>> GetAddress(Guid id)
    {
        var userId = GetUserId();
        var address = await _addressService.GetAddressByIdAsync(userId, id);
        return Ok(address);
    }

    // POST: api/addresses — Create new
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost]
    public async Task<ActionResult<AddressDto>> CreateAddress(CreateAddressDto dto)
    {
        var userId = GetUserId();
        var address = await _addressService.CreateAddressAsync(userId, dto);
        return CreatedAtAction(nameof(GetAddress), new { id = address.Id }, address);
    }

    // PUT: api/addresses/{id} — Update
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AddressDto>> UpdateAddress(Guid id, UpdateAddressDto dto)
    {
        var userId = GetUserId();
        var address = await _addressService.UpdateAddressAsync(userId, id, dto);
        return Ok(address);
    }

    // PATCH: api/addresses/{id}/set-default — Set as default
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPatch("{id:guid}/set-default")]
    public async Task<ActionResult<AddressDto>> SetDefault(Guid id)
    {
        var userId = GetUserId();
        var address = await _addressService.SetDefaultAddressAsync(userId, id);
        return Ok(address);
    }

    // DELETE: api/addresses/{id} — Soft delete
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteAddress(Guid id)
    {
        var userId = GetUserId();
        await _addressService.DeleteAddressAsync(userId, id);
        return NoContent();
    }

    // ==========================================
    // HELPER
    // ==========================================
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }

        return Guid.Parse(userIdClaim);
    }
}