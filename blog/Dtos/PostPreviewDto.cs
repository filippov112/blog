namespace blog.Dtos
{
    public class PostPreviewDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public List<string> Tags { get; set; } = new();
    }
}
