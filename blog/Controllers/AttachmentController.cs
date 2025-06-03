using blog.Services;
using DotNetEnv;
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
        public async Task<IActionResult> UploadAttachment(int postId, [FromForm] List<IFormFile> files)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var post = await _context.Posts.Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == postId && p.UserId == userId);

            if (post == null)
                return NotFound("Пост не найден или не принадлежит текущему пользователю");

            var uploaded = new List<object>();

            foreach (var file in files)
            {
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
                uploaded.Add(new
                {
                    attachment.Id,
                    attachment.FileName,
                    attachment.FileType,
                    attachment.DropboxPath
                });
            }

            await _context.SaveChangesAsync();
            return Ok(uploaded);
        }

        [Authorize]
        [HttpDelete]
        public IActionResult Delete([FromQuery] string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                return BadRequest("URL не указан");

            // 🧠 Извлечение имени файла из URL
            var fileName = Path.GetFileName(new Uri(url).AbsolutePath);

            var uploadsPath = Path.Combine("/" + Env.GetString("ATTACHMENT_ROOTPATH").Trim('/') ?? "/", "Uploads");
            var filePath = Path.Combine(uploadsPath, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Файл не найден");

            try
            {
                System.IO.File.Delete(filePath);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при удалении файла: {ex.Message}");
            }
        }
    }

}
