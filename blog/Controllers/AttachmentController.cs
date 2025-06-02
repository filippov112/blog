using blog.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace blog.Controllers
{
    // Controllers/AttachmentController.cs
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttachmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly DropboxService _dropbox;

        public AttachmentController(AppDbContext context, DropboxService dropbox)
        {
            _context = context;
            _dropbox = dropbox;
        }

        [HttpPost("{postId}")]
        public async Task<IActionResult> UploadAttachment(int postId, [FromForm] IFormFile file)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var post = await _context.Posts.Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == postId && p.UserId == userId);

            if (post == null)
                return NotFound("Пост не найден или не принадлежит текущему пользователю");

            await using var stream = file.OpenReadStream();
            var url = await _dropbox.UploadAsync(stream, file.FileName, postId.ToString());

            var attachment = new Attachment
            {
                FileName = file.FileName,
                DropboxPath = url,
                FileType = file.ContentType,
                PostId = postId
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            return Ok(new { attachment.Id, attachment.FileName, attachment.FileType, attachment.DropboxPath });
        }
    }

}
