export default async function downloadPhoto(imageSrc: string, name: string, index: number) {
  console.log(`Attempting to download image: ${imageSrc}`);
  try {
    const response = await fetch(imageSrc, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit', // or 'same-origin'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log('Blob size:', blob.size);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('Download initiated successfully');
  } catch (e) {
    console.error('Error downloading the image:', e);
    // if TypeError: Failed to fetch，maybe CORS 
    if (e instanceof TypeError && e.message.includes('Failed to fetch')) {
      console.error('This might be a CORS issue. Check the network tab for more details.');
    }
  }
}