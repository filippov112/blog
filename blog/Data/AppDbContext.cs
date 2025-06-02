// Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<PostTag> PostTags => Set<PostTag>();
    public DbSet<Attachment> Attachments => Set<Attachment>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PostTag>().HasKey(pt => new { pt.PostId, pt.TagId });

        modelBuilder.Entity<Tag>()
            .HasOne(t => t.ParentTag)
            .WithMany(t => t.Children)
            .HasForeignKey(t => t.ParentTagId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
