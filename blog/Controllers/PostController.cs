using blog.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace blog.Controllers
{
    // Controllers/PostController.cs
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var post = new Post
            {
                Title = dto.Title,
                ContentMarkdown = dto.ContentMarkdown,
                UserId = userId
            };

            var tags = await ParseAndEnsureTagsAsync(dto.Tags);
            post.PostTags = tags.Select(t => new PostTag { Post = post, Tag = t }).ToList();

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { post.Id });
        }

        private async Task<List<Tag>> ParseAndEnsureTagsAsync(List<string> rawTagPaths)
        {
            var result = new List<Tag>();

            foreach (var path in rawTagPaths)
            {
                var levels = path.Trim('#').Split('#', StringSplitOptions.RemoveEmptyEntries);
                Tag? parent = null;
                int? parentId = parent?.Id;

                foreach (var level in levels)
                {
                    

                    var existing = await _context.Tags
                        .FirstOrDefaultAsync(t => t.Name.ToLower() == level.ToLower() && t.ParentTagId == parentId);

                    if (existing != null)
                    {
                        parent = existing;
                        parentId = parent?.Id;
                        continue;
                    }

                    var newTag = new Tag { Name = level.ToLower(), ParentTag = parent };
                    _context.Tags.Add(newTag);
                    await _context.SaveChangesAsync();

                    parent = newTag;
                    parentId = parent?.Id;
                }

                if (parent != null)
                    result.Add(parent);
            }

            return result.DistinctBy(t => t.Id).ToList();
        }
    }

}
