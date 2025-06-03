namespace blog.Dtos
{
    public class PostPreviewDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string PreviewImageUrl { get; set; } = null!;
        public List<string> Tags { get; set; } = new();
    }
}
