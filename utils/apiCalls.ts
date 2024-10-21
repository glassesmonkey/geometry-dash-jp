import fetch from 'node-fetch';
import FormData from 'form-data';

export async function uploadImage(imageBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append('image', imageBlob, 'image.jpg');

  const response = await fetch('https://api.picsart.io/tools/1.0/upload', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Picsart-API-Key': process.env.PICSART_KEY as string,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.url;
}

export async function getPrompt(imageUrl: string): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "0603dec596080fa084e26f0ae6d605fc5788ed2b1a0358cd25010619487eae63",
      input: {
        image: imageUrl,
        prompt: "Use short words to describe the main content of the picture and the style of the picture, such as realism, manga, anime, oil painting style, etc"
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.output.join('');
}

export async function expandImage(params: {
  image_url: string;
  prompt: string;
  width: string;
  height: string;
  direction: string;
  count: number;
}): Promise<string> {
  const form = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    form.append(key, value);
  });
  form.append('format', 'JPG');
  form.append('mode', 'sync');

  const response = await fetch('https://genai-api.picsart.io/v1/painting/expand', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Picsart-API-Key': process.env.PICSART_KEY as string,
    },
    body: form,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].url;
}