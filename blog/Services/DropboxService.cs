using Dropbox.Api.Files;
using Dropbox.Api;
using DotNetEnv;

namespace blog.Services
{
    // Services/DropboxService.cs
    public class DropboxService
    {
        private readonly DropboxClient _client;
        private readonly string _rootPath;

        public DropboxService()
        {
            var token = Env.GetString("DROPBOX_ACCESS_TOKEN")!;
            _rootPath = Env.GetString("ATTACHMENT_ROOTPATH") ?? "/";
            _client = new DropboxClient(oauth2AccessToken: token, oauth2AccessTokenExpiresAt: DateTime.MaxValue);
        }

        public async Task<string> UploadAsync(Stream fileStream, string fileName, string postId)
        {
            var dropboxPath = $"{_rootPath}/{postId}/{fileName}";
            await _client.Files.UploadAsync(
                dropboxPath,
                WriteMode.Overwrite.Instance,
                body: fileStream
            );

            var shared = await _client.Sharing.CreateSharedLinkWithSettingsAsync(dropboxPath);
            return shared.Url.Replace("www.dropbox.com", "dl.dropboxusercontent.com").Replace("&dl=0", "");
        }
    }

}
