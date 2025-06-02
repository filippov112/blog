// Models/Tag.cs
public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public int? ParentTagId { get; set; }
    public Tag? ParentTag { get; set; }

    public List<Tag> Children { get; set; } = new();
    public List<PostTag> PostTags { get; set; } = new();
}
