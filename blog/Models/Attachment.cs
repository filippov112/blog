// Models/Attachment.cs
public class Attachment
{
    public int Id { get; set; }
    public string FileName { get; set; } = null!;
    public string DropboxPath { get; set; } = null!;
    public string FileType { get; set; } = null!;

    public int PostId { get; set; }
    public Post Post { get; set; } = null!;
}
