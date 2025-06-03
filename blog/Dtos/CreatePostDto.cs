namespace blog.Dtos
{
    public class CreatePostDto
    {
        public string Title { get; set; } = null!;
        public string ContentMarkdown { get; set; } = null!;
        public List<string> Tags { get; set; } = new();
        public string? PreviewImageUrl { get; set; }
    }

}
