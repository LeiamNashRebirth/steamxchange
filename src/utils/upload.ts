import { GithubKey } from '@/env/secrets';

const GITHUB_TOKEN = GithubKey ;

const generateRandomFilename = (extension: string) => {
  const randomString = Math.random().toString(36).substring(7);
  return `leiamnash_${randomString}.${extension}`;
};

export const upload = async (fileUrl: string | null): Promise<string | null> => {
  try {
    if (!fileUrl) return null;

    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1] || "mp4"; 
    const filename = generateRandomFilename(extension);
    const arrayBuffer = await blob.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString("base64");

    const uploadResponse = await fetch(`https://api.github.com/repos/LeiamNashRebirth/storage/contents/${filename}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Uploaded ${filename}`,
        content: base64File,
        branch: 'main'
      }),
    });

    const result = await uploadResponse.json();
    return result.content?.download_url || null;
  } catch (error) {
    return null;
  }
};
