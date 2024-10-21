import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import ResponsiveCustomSelect from '../components/ResponsiveCustomSelect';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import LoadingOverlay from '../components/LoadingOverlay';
// import appendNewToName from '../utils/appendNewToName';
// import downloadPhoto from '../utils/downloadPhoto';
import { useSession, signIn } from 'next-auth/react';
import useSWR from 'swr';
import DragDropUpload from '../components/DragDropUpload';
import { useRouter } from 'next/router';
import ImprovedCanvas from '../components/ImprovedCanvas';
import { isTestEnvironment } from '../utils/environment';
import ExpandedImagesGallery from '../components/ExpandedImagesGallery';
// import { logError } from '../utils/errorLogging';
import { resizeImage } from '../utils/imageProcessing';
import ErrorToast from '../components/ErrorToast';
import logger from '../utils/customLogger';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const Home: NextPage = () => {
  const router = useRouter();
  const { locale, locales, defaultLocale, pathname } = router;
  const canonicalUrl = `https://flux1.one${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
  const { t } = useTranslation('ai-expand-image');

  const [userImages, setUserImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [progress, setProgress] = useState(0);
  const [operation, setOperation] = useState('');
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  // const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [amount, setAmount] = useState(1);
  const [privacy, setPrivacy] = useState('public');
  const [zoom, setZoom] = useState(100);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [imagePosition, setImagePosition] = useState('center');
  const [canvasRatio, setCanvasRatio] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [mode, setMode] = useState<'speed' | 'highQuality'>('speed');
  const [dragPosition, setDragPosition] = useState({ top: 0, left: 0, bottom: 0, right: 0 });

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: creditData, mutate: mutateCredit } = useSWR('/api/get-user-credit', fetcher);
  const { data: session, status } = useSession();

  const isTestEnv = isTestEnvironment();

  // const templates = [
  //   { name: '9:16 Portrait', ratio: 9 / 16, resolution: '720x1280' },
  //   { name: '16:9 Landscape', ratio: 16 / 9, resolution: '1280x720' },
  //   { name: '1:1 Square', ratio: 1, resolution: '1080x1080' },
  //   { name: 'Instagram Post', ratio: 1, resolution: '1080x1080' },
  //   { name: 'Instagram Portrait', ratio: 4 / 5, resolution: '1080x1350' },
  //   { name: 'Instagram Story', ratio: 9 / 16, resolution: '1080x1920' },
  //   { name: 'YouTube Thumbnail', ratio: 16 / 9, resolution: '1280x720' },
  //   { name: 'Facebook Post', ratio: 1.91, resolution: '1200x630' },
  //   { name: 'Facebook Cover', ratio: 2.7, resolution: '1640x624' },
  //   { name: 'Pinterest Pin', ratio: 2 / 3, resolution: '1000x1500' },
  //   { name: 'X (former Twitter) Post', ratio: 16 / 9, resolution: '1200x675' },
  //   { name: 'X (former Twitter) Cover', ratio: 3, resolution: '1500x500' },
  //   { name: 'TikTok Video Cover (Portrait)', ratio: 9 / 16, resolution: '1080x1920' },
  //   { name: 'TikTok Video Cover (Landscape)', ratio: 16 / 9, resolution: '1920x1080' },
  // ];


  const [expandedImages, setExpandedImages] = useState<string[]>([]);
  const [scaledImageSize, setScaledImageSize] = useState({ width: 0, height: 0 });

  // const positions = [
  //   { name: 'Center', value: 'center' },
  //   { name: 'Top Left', value: 'top-left' },
  //   { name: 'Top Right', value: 'top-right' },
  //   { name: 'Bottom Left', value: 'bottom-left' },
  //   { name: 'Bottom Right', value: 'bottom-right' },
  // ];
  const templates = [
    { key: '9x16Portrait', ratio: 9 / 16, resolution: '720x1280' },
    { key: '16x9Landscape', ratio: 16 / 9, resolution: '1280x720' },
    { key: '1x1Square', ratio: 1, resolution: '1080x1080' },
    { key: 'InstagramPost', ratio: 1, resolution: '1080x1080' },
    { key: 'InstagramPortrait', ratio: 4 / 5, resolution: '1080x1350' },
    { key: 'InstagramStory', ratio: 9 / 16, resolution: '1080x1920' },
    { key: 'YouTubeThumbnail', ratio: 16 / 9, resolution: '1280x720' },
    { key: 'FacebookPost', ratio: 1.91, resolution: '1200x630' },
    { key: 'FacebookCover', ratio: 2.7, resolution: '1640x624' },
    { key: 'PinterestPin', ratio: 2 / 3, resolution: '1000x1500' },
    { key: 'XPost', ratio: 16 / 9, resolution: '1200x675' },
    { key: 'XCover', ratio: 3, resolution: '1500x500' },
    { key: 'TikTokVideoPortrait', ratio: 9 / 16, resolution: '1080x1920' },
    { key: 'TikTokVideoLandscape', ratio: 16 / 9, resolution: '1920x1080' },
  ];

  const positions = [
    { key: 'center', value: 'center' },
    { key: 'topLeft', value: 'top-left' },
    { key: 'topRight', value: 'top-right' },
    { key: 'bottomLeft', value: 'bottom-left' },
    { key: 'bottomRight', value: 'bottom-right' },
  ];
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  useEffect(() => {
    if (session?.user) {
      fetchUserImages(currentPage);
    }
  }, [session, currentPage]);

  useEffect(() => {
    if (creditData) {
      setUserCredit(creditData.credit);
    }
  }, [creditData]);

  useEffect(() => {
    if (status === 'authenticated') {
      mutateCredit();
    }
  }, [status, amount, mutateCredit]);

  const fetchUserImages = async (page: number) => {
    try {
      const response = await fetch(`/api/get-user-images?page=${page}&limit=6`);
      if (response.ok) {
        const data = await response.json();
        setUserImages(data.images);
        setTotalPages(data.totalPages);
      } else {
        console.error('Failed to fetch user images');
      }
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };

  const startProgressAnimation = (start: number, end: number, duration: number, op: string) => {
    setOperation(op);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    const step = (end - start) / (duration / 50);
    let current = start;
    progressInterval.current = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
      setProgress(current);
    }, 50);
  };

  const handleFileChange = (file: File) => {
    if (file) {
      logger.debug('File uploaded:', file.name);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setOriginalPhoto(result);
          setPhotoName(file.name);
          logger.debug('Photo set in state');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleUploadClick = () => {
  //   fileInputRef.current?.click();
  // };

  const handleImageSizeChange = useCallback((size: { width: number; height: number }) => {
    logger.debug("Image size changed:", size);
    setScaledImageSize(prevSize => {
      if (prevSize.width !== size.width || prevSize.height !== size.height) {
        return size;
      }
      return prevSize;
    });
  }, []);

  // const handleModeChange = (newMode: 'speed' | 'highQuality') => {
  //   setMode(newMode);
  //   if (newMode === 'highQuality') {
  //     setDragPosition({ top: 0, left: 0, bottom: 0, right: 0 });
  //   }
  // };
  const handleModeChange = useCallback((newMode: 'speed' | 'highQuality') => {
    setMode(newMode);
    console.log("Mode changed:", newMode);
    if (newMode === 'highQuality') {
      setDragPosition({ top: 0, left: 0, bottom: 0, right: 0 });
    }
  }, []);

  const handleDragPositionChange = useCallback((newPosition: { top: number; left: number; bottom: number; right: number }) => {
    setDragPosition({
      top: Math.round(newPosition.top),
      left: Math.round(newPosition.left),
      bottom: Math.round(newPosition.bottom),
      right: Math.round(newPosition.right)
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  const amountOptions = useMemo(() => {
    if (mode === 'highQuality') {
      return [{ value: '1', label: '1' }];
    } else {
      return [1, 2, 3, 4, 5, 6].map(num => ({ value: num.toString(), label: num.toString() }));
    }
  }, [mode]);

  // 确保当模式改变时，amount 的值总是有效的
  useEffect(() => {
    if (mode === 'highQuality' && amount !== 1) {
      setAmount(1);
    }
  }, [mode, amount]);
  async function handleGeneratePhoto() {
    if (!originalPhoto) return;
    if (userCredit === null || userCredit < amount) {
      setShowRechargeModal(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      logger.debug("Calling generatePhoto");
      logger.debug("Current scaledImageSize:", scaledImageSize);
      if (scaledImageSize.width <= 0 || scaledImageSize.height <= 0) {
        throw new Error(`Invalid scaled image size: ${JSON.stringify(scaledImageSize)}`);
      }
      await generatePhoto(originalPhoto);
      logger.debug("Expanded images:", expandedImages);
    } catch (error) {
      console.error('Error in handleGeneratePhoto:', error);
      setError('Encountered an issue. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }

  async function generatePhoto(fileUrl: string): Promise<void> {
    setLoading(true);
    setError(null);
    logger.debug("dragPosition==", dragPosition)
    try {
      startProgressAnimation(0, 20, 1000, 'enhancingImage');
      logger.debug("Resizing image");
      logger.debug("Scaled image size:", scaledImageSize);
      if (scaledImageSize.width <= 0 || scaledImageSize.height <= 0) {
        throw new Error(`Invalid scaled image size: ${JSON.stringify(scaledImageSize)}`);
      }
      const resizedImage = await resizeImage(fileUrl, Math.round(scaledImageSize.width), Math.round(scaledImageSize.height), mode);

      startProgressAnimation(20, 40, 1000, 'uploadingImage');
      logger.debug("Uploading image");
      const uploadedImageUrl = await uploadImage(resizedImage);
      logger.debug("Uploaded image URL:", uploadedImageUrl);

      startProgressAnimation(40, 60, 1000, 'aiRecognizing');
      let finalPrompt = prompt;
      if (!finalPrompt) {
        logger.debug("Generating prompt");
        finalPrompt = await generatePrompt(uploadedImageUrl);
        logger.debug("Generated prompt:", finalPrompt);
      }
      if (mode === "highQuality") {
        startProgressAnimation(60, 80, 1000, "highQualityModeMessage");
      } else {
        startProgressAnimation(60, 80, 1000, "expandingImage");
      }
      logger.debug("Expanding image");
      const expandedImageUrls = await expandImage(
        uploadedImageUrl,
        finalPrompt,
        selectedTemplate.resolution,
        getApiDirection(imagePosition),
        amount,
        mode,
        mode === 'highQuality' ? dragPosition : undefined
      );
      logger.debug("Expanded image URLs:", expandedImageUrls);

      startProgressAnimation(80, 95, 1000, 'complete');
      if (mode === 'speed') {
        const r2Urls = await uploadExpandedImagesToR2(expandedImageUrls);
        logger.debug("r2urls", r2Urls);
        await saveExpandedImagesToDatabase(r2Urls);
        setExpandedImages(r2Urls);
      }

      setRestoredLoaded(true);

      startProgressAnimation(95, 100, 500, 'completed');
      fetchUserImages(1);
    } catch (error) {
      console.error('Error in generatePhoto:', error);
      setError('Encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(imageBlob: Blob): Promise<string> {
    try {
      const presignedUrlResponse = await fetch('/api/get-upload-url');
      if (!presignedUrlResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }
      const { url, key } = await presignedUrlResponse.json();

      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: imageBlob,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to R2');
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
      logger.debug("Upload successful. Image URL:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  }

  async function generatePrompt(imageUrl: string): Promise<string> {
    const response = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to start prompt generation');
    }

    const { id } = await response.json();

    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(`/api/wait-for-prediction?id=${id}`);

      eventSource.onopen = (event) => {
        logger.debug('SSE Connection opened:', event);
      };

      eventSource.onmessage = (event) => {
        logger.debug('SSE Message received:', event);
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'succeeded') {
            eventSource.close();
            resolve(data.prompt);
          } else if (data.status === 'failed' || data.status === 'error') {
            eventSource.close();
            reject(new Error(data.message || 'Failed to generate prompt'));
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
          eventSource.close();
          reject(new Error('Error parsing server response'));
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        console.error('Error details:', {
          type: error.type,
          eventPhase: error.eventPhase,
          readyState: eventSource.readyState
        });
        eventSource.close();
        reject(new Error(`Error in prompt generation: ${error instanceof ErrorEvent ? error.message : 'Connection error'}`));
      };

      const timeout = setTimeout(() => {
        console.warn('SSE Connection timed out');
        eventSource.close();
        reject(new Error('Prompt generation timed out'));
      }, 60000);

      eventSource.addEventListener('close', () => {
        logger.debug('SSE Connection closed');
        clearTimeout(timeout);
      });
    });
  }

  async function expandImage(
    imageUrl: string,
    prompt: string,
    resolution: string,
    direction: string,
    amount: number,
    mode: 'speed' | 'highQuality',
    dragPosition?: { top: number; left: number; bottom: number; right: number }
  ): Promise<string[]> {
    const apiEndpoint = mode === 'speed' ? '/api/expand-image' : '/api/expand-image-qualitymode';
    logger.debug("dragPosition=", dragPosition)
    let requestBody;
    if (mode === 'speed') {
      requestBody = {
        imageUrl,
        prompt: prompt.trim(),
        resolution,
        direction,
        amount
      };
    } else {
      requestBody = {
        imageUrl,
        prompt: prompt.trim(),
        resolution,
        dragPosition
      };
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error expanding image in ${mode} mode:`, errorData);
      throw new Error(errorData.error || `Failed to expand image in ${mode} mode`);
    }

    if (mode === 'speed') {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        return data.data.map((item: { url: string }) => item.url);
      } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Unexpected API response structure');
      }
    } else {
      const { predictionId } = await response.json();
      return new Promise((resolve, reject) => {
        const eventSource = new EventSource(`/api/sse-prediction?id=${predictionId}`);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            logger.debug('Received SSE update:', data);

            if (data.status === 'processing') {
              logger.debug(data.message);
              setProgress((prevProgress) => Math.min(prevProgress + 5, 95));
            } else if (data.status === 'succeeded') {
              eventSource.close();
              resolve(data.output);
            } else if (data.status === 'failed' || data.status === 'error' || data.status === 'timeout') {
              console.error('SSE Error:', data);
              eventSource.close();
              reject(new Error(data.error || data.message || 'Failed to expand image'));
            }
          } catch (error) {
            console.error('Error processing SSE message:', error);
            eventSource.close();
            reject(new Error('Error processing server response'));
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE Error:', error);
          eventSource.close();
          reject(new Error('Error in image expansion'));
        };
      });
    }
  }
  async function uploadExpandedImagesToR2(imageUrls: string[]): Promise<string[]> {
    return Promise.all(imageUrls.map(async (url) => {
      const presignedUrlResponse = await fetch('/api/get-presigned-url');
      if (!presignedUrlResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }
      const { url: presignedUrl, publicUrl } = await presignedUrlResponse.json();

      const imageResponse = await fetch(url);
      const blob = await imageResponse.blob();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to R2');
      }

      return publicUrl;
    }));
  }

  async function saveExpandedImagesToDatabase(imageUrls: string[]): Promise<void> {
    await Promise.all(imageUrls.map(async (url) => {
      const response = await fetch('/api/save-generated-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: url }),
      });

      if (!response.ok) {
        console.error('Failed to save image to database:', await response.text());
      }
    }));
  }

  function getApiDirection(uiDirection: string): string {
    const directionMap: { [key: string]: string } = {
      'center': 'center',
      'top-left': 'bottom-right',
      'top-right': 'bottom-left',
      'bottom-left': 'top-right',
      'bottom-right': 'top-left',
    };
    return directionMap[uiDirection] || 'center';
  }

  const handleRecharge = () => {
    logger.debug("Recharge clicked");
    setShowRechargeModal(false);
    // Implement your recharge logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>{t('meta.title')}</title>
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="canonical" href={canonicalUrl} />
        {/* hreflang 标记 */}
        {locales?.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://flux1.one${l === defaultLocale ? '' : `/${l}`}${pathname}`}
          />
        ))}

        {/* x-default hreflang */}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://flux1.one${pathname}`}
        />
      </Head>

      <Header />

      <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Control panel - Left on desktop, bottom on mobile */}
          <div className="w-full lg:w-1/3 lg:order-first order-last">
            <div className="space-y-6">
              <button className="w-full text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-gradient">
                {t('header.buyCredits')}
              </button>

              {/* Sign in section */}
              {status !== 'authenticated' && (
                <div className="mt-6 text-center">
                  <p className="text-lg text-blue-600 font-bold mb-4">
                    {t('header.signUpPromo')}
                  </p>
                  <button
                    onClick={() => signIn('google')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-all duration-200 ease-in-out"
                  >
                    <Image src="/google.png" width={24} height={24} alt="Google logo" />
                    <span>{t('header.signInWithGoogle')}</span>
                  </button>
                </div>
              )}

              <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
                <DragDropUpload onFileChange={handleFileChange} />

                {/* Mode switcher */}
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg ${mode === 'speed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleModeChange('speed')}
                    onTouchStart={() => handleModeChange('speed')}
                  >
                    {t('modeSwitcher.speedMode')}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg ${mode === 'highQuality' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleModeChange('highQuality')}
                    onTouchStart={() => handleModeChange('highQuality')}
                  >
                    {t('modeSwitcher.highQualityMode')}
                  </button>
                </div>
                {/* Dynamic mode explanation */}
                <div className="text-sm text-gray-600 italic">
                  {mode === 'speed'
                    ? t('modeSwitcher.speedModeDescription')
                    : t('modeSwitcher.highQualityModeDescription')}
                </div>

                {/* Template selection */}
                <div className="z-10 relative">
                  <ResponsiveCustomSelect
                    value={selectedTemplate.key}
                    onChange={(value) => {
                      const template = templates.find(t => t.key === value);
                      if (template) {
                        setSelectedTemplate(template);
                        setCanvasRatio(template.ratio);
                      }
                    }}
                    options={templates.map(template => ({ value: template.key, label: t(`templates.${template.key}`) }))}
                    label={t('templateSelection.label')}
                    description={t('templateSelection.description')}
                  />
                </div>

                {/* Image position selection (only for speed mode) */}
                {mode === 'speed' && (
                  <ResponsiveCustomSelect
                    value={imagePosition}
                    onChange={setImagePosition}
                    options={positions.map(pos => ({ value: pos.value, label: t(`imagePositionselect.options.${pos.key}`) }))}
                    label={t('imagePosition.label')}
                    description={t('imagePosition.description')}
                  />
                )}

                {/* Prompt input */}
                <div>
                  <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('prompt.label')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    {t('prompt.description')}
                  </p>
                  <input
                    id="prompt-input"
                    type="text"
                    placeholder={t('prompt.placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>

                {/* Amount selection */}
                <ResponsiveCustomSelect
                  value={amount.toString()}
                  onChange={(value) => setAmount(Number(value))}
                  options={amountOptions}
                  label={t('amount.label')}
                  description={t('amount.description')}
                />
                {/* Credits display */}
                <div className="text-right text-sm text-gray-600">
                  {t('credits.label')}: {userCredit !== null ? userCredit : t('credits.loading')}
                </div>

                {/* Extend image button */}
                <button
                  className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-300 ${loading || !originalPhoto || (!isTestEnv && status !== 'authenticated')
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  onClick={handleGeneratePhoto}
                  disabled={loading || !originalPhoto || (!isTestEnv && status !== 'authenticated')}
                >
                  {loading ? <LoadingDots color="white" style="large" /> : t('extendImage.buttonText')}
                </button>
              </div>
            </div>
          </div>

          {/* Canvas - Right on desktop, top on mobile */}
          <div className="w-full lg:w-2/3 lg:order-last order-first mb-8 lg:mb-0">
            <ImprovedCanvas
              canvasRatio={selectedTemplate.ratio}
              setCanvasRatio={setCanvasRatio}
              originalPhoto={originalPhoto}
              setOriginalPhoto={setOriginalPhoto}
              zoom={zoom}
              setZoom={setZoom}
              imagePosition={mode === 'speed' ? imagePosition : undefined}
              onImageSizeChange={handleImageSizeChange}
              baseResolution={selectedTemplate.resolution}
              mode={mode}
              dragPosition={dragPosition}
              onDragPositionChange={handleDragPositionChange}
            />
          </div>
        </div>

        {/* Expanded images gallery - Always at the bottom */}
        <div className="w-full mt-8">
          <ExpandedImagesGallery
            images={userImages}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              fetchUserImages(page);
            }}
          />
        </div>
      </main>

      <Footer />

      {error && <ErrorToast error={error} onClose={clearError} />}

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('rechargeModal.title')}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('rechargeModal.message')}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={handleRecharge}
                >
                  {t('rechargeModal.rechargeButton')}
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={() => setShowRechargeModal(false)}
                >
                  {t('rechargeModal.cancelButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingOverlay progress={progress} operation={operation} />}
    </div>
  );
};
export async function getServerSideProps({ locale }: { locale: string }) {
  const translations = await serverSideTranslations(locale, ['common', 'ai-expand-image']);
  console.log('Loaded translations:', translations);
  return {
    props: {
      ...translations,
    },
  };
}
export default Home;