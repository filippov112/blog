// Models/Post.cs
public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string ContentMarkdown { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public List<PostTag> PostTags { get; set; } = new();
    public List<Attachment> Attachments { get; set; } = new();
}
