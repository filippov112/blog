namespace blog.Dtos
{
    public class PostDetailDto : PostPreviewDto
    {
        public string ContentMarkdown { get; set; } = null!;
        public List<AttachmentDto> Attachments { get; set; } = new();
    }
}
