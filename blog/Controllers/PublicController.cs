using blog.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace blog.Controllers
{
    // Controllers/PublicController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("posts")]
        public async Task<IActionResult> GetLatestPosts([FromQuery] int count = 10)
        {
            var posts = await _context.Posts
                .OrderByDescending(p => p.CreatedAt)
                .Take(count)
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .Select(p => new PostPreviewDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    CreatedAt = p.CreatedAt,
                    Tags = p.PostTags.Select(pt => pt.Tag.Name).ToList()
                })
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("posts/{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _context.Posts
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Attachments)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
                return NotFound();

            var dto = new PostDetailDto
            {
                Id = post.Id,
                Title = post.Title,
                CreatedAt = post.CreatedAt,
                ContentMarkdown = post.ContentMarkdown,
                Tags = post.PostTags.Select(pt => pt.Tag.Name).ToList(),
                Attachments = post.Attachments.Select(a => new AttachmentDto
                {
                    FileName = a.FileName,
                    FileType = a.FileType,
                    Url = a.DropboxPath
                }).ToList(),
                CoverImageUrl = post.CoverImageUrl,
            };

            return Ok(dto);
        }

        [HttpGet("tags")]
        public async Task<IActionResult> GetTagTree()
        {
            var tags = await _context.Tags
                .Include(t => t.Children)
                .Where(t => t.ParentTagId == null)
                .ToListAsync();

            var result = tags.Select(BuildTagNode).ToList();
            return Ok(result);
        }

        private object BuildTagNode(Tag tag)
        {
            return new
            {
                tag.Id,
                tag.Name,
                Children = tag.Children.Select(BuildTagNode)
            };
        }

        [HttpGet("posts/bytag")]
        public async Task<IActionResult> GetPostsByTag([FromQuery] int tagId)
        {
            var posts = await _context.PostTags
                .Where(pt => pt.TagId == tagId)
                .Select(pt => new PostPreviewDto
                {
                    Id = pt.Post.Id,
                    Title = pt.Post.Title,
                    CreatedAt = pt.Post.CreatedAt,
                    Tags = pt.Post.PostTags.Select(x => x.Tag.Name).ToList()
                })
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("posts/bypath")]
        public async Task<IActionResult> GetPostsByTagPath([FromQuery] string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                return BadRequest("Путь не может быть пустым");

            var segments = path
                .Split('/', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim().ToLowerInvariant())
                .ToList();

            if (segments.Count == 0)
                return BadRequest("Некорректный путь");

            // Поиск тега по иерархии
            Tag? current = null;
            int? currentId = current?.Id;

            foreach (var segment in segments)
            {
                current = await _context.Tags.FirstOrDefaultAsync(
                   t =>  t.ParentTagId == currentId & t.Name.ToLower() == segment
                );

                currentId = current?.Id;
                
            }
            if (current == null)
                return NotFound($"Тег '{path.Replace('/', '#')}' не найден в структуре");

            // Рекурсивный поиск всех потомков
            var allTagIds = await GetAllDescendantTagIds(currentId ?? -1);

            try
            {
                // Выборка постов по всем этим тегам
                var posts = await _context.PostTags
                                .Where(pt => allTagIds.Contains(pt.TagId))
                                .Select(pt => new PostPreviewDto
                                {
                                    Id = pt.Post.Id,
                                    Title = pt.Post.Title,
                                    CreatedAt = pt.Post.CreatedAt,
                                    Tags = pt.Post.PostTags.Select(x => x.Tag.Name).ToList()
                                }).ToListAsync();
                return Ok(posts);
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message.ToString());
            }
            return BadRequest();
            

            
        }

        private async Task<List<int?>> GetTagTreeById(int? lastTagId)
        {
            List<int?> res = [lastTagId,];
            Tag? tag = await _context.Tags.FirstOrDefaultAsync<Tag>(t => t.Id == lastTagId);

            if (tag?.ParentTagId is not null)
                res.AddRange(await GetTagTreeById(tag.ParentTagId));
            return res;
        }

        private async Task<List<int>> GetAllDescendantTagIds(int rootTagId)
        {
            var tagIds = new List<int> { rootTagId };

            var children = await _context.Tags
                .Where(t => t.ParentTagId == rootTagId)
                .ToListAsync();

            foreach (var child in children)
            {
                tagIds.AddRange(await GetAllDescendantTagIds(child.Id));
            }

            return tagIds;
        }

    }

}
