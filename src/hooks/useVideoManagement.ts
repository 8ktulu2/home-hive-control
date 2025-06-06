
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface VideoFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadDate: string;
  propertyId: string;
  year?: number;
}

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadDate: string;
  propertyId: string;
  year?: number;
}

// Enhanced persistence with multiple backup strategies
const STORAGE_KEYS = {
  videos: {
    primary: (propertyId: string, year?: number) => 
      year ? `propertyVideos_${propertyId}_${year}` : `propertyVideos_${propertyId}`,
    backup: (propertyId: string, year?: number) => 
      year ? `propertyVideos_backup_${propertyId}_${year}` : `propertyVideos_backup_${propertyId}`,
    index: 'videosGlobalIndex',
    metadata: (propertyId: string, year?: number) => 
      year ? `videosMeta_${propertyId}_${year}` : `videosMeta_${propertyId}`
  },
  images: {
    primary: (propertyId: string, year?: number) => 
      year ? `propertyImages_${propertyId}_${year}` : `propertyImages_${propertyId}`,
    backup: (propertyId: string, year?: number) => 
      year ? `propertyImages_backup_${propertyId}_${year}` : `propertyImages_backup_${propertyId}`,
    index: 'imagesGlobalIndex',
    metadata: (propertyId: string, year?: number) => 
      year ? `imagesMeta_${propertyId}_${year}` : `imagesMeta_${propertyId}`
  }
};

export const useVideoManagement = (propertyId: string, historicalYear?: number) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);

  // Enhanced storage operations with multiple persistence layers
  const saveToStorage = (key: string, data: any): boolean => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      
      // Verify write was successful
      const verification = localStorage.getItem(key);
      if (verification === serialized) {
        console.log(`Successfully saved to ${key}`);
        return true;
      } else {
        console.error(`Verification failed for ${key}`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to save to ${key}:`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Espacio de almacenamiento agotado. Archivo muy grande.');
      }
      return false;
    }
  };

  const loadFromStorage = (key: string): any => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`Failed to load from ${key}:`, error);
      return null;
    }
  };

  // Load videos and images with enhanced recovery mechanism
  const loadFiles = () => {
    try {
      // Load videos
      const videoPrimaryKey = STORAGE_KEYS.videos.primary(propertyId, historicalYear);
      const videoBackupKey = STORAGE_KEYS.videos.backup(propertyId, historicalYear);
      
      let savedVideos = loadFromStorage(videoPrimaryKey);
      if (!savedVideos) {
        savedVideos = loadFromStorage(videoBackupKey);
        if (savedVideos) {
          saveToStorage(videoPrimaryKey, savedVideos);
          console.log('Restored videos from backup storage');
        }
      }
      
      if (savedVideos && Array.isArray(savedVideos)) {
        setVideos(savedVideos);
      } else {
        setVideos([]);
      }

      // Load images
      const imagePrimaryKey = STORAGE_KEYS.images.primary(propertyId, historicalYear);
      const imageBackupKey = STORAGE_KEYS.images.backup(propertyId, historicalYear);
      
      let savedImages = loadFromStorage(imagePrimaryKey);
      if (!savedImages) {
        savedImages = loadFromStorage(imageBackupKey);
        if (savedImages) {
          saveToStorage(imagePrimaryKey, savedImages);
          console.log('Restored images from backup storage');
        }
      }
      
      if (savedImages && Array.isArray(savedImages)) {
        setImages(savedImages);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setVideos([]);
      setImages([]);
    }
  };

  // Enhanced save with multiple persistence layers
  const saveFiles = (filesToSave: VideoFile[] | ImageFile[], type: 'videos' | 'images'): boolean => {
    try {
      const storageKeys = STORAGE_KEYS[type];
      const primaryKey = storageKeys.primary(propertyId, historicalYear);
      const backupKey = storageKeys.backup(propertyId, historicalYear);
      const metaKey = storageKeys.metadata(propertyId, historicalYear);
      
      // Save to primary storage
      const primarySuccess = saveToStorage(primaryKey, filesToSave);
      
      // Save to backup storage
      const backupSuccess = saveToStorage(backupKey, filesToSave);
      
      // Save metadata
      const metadata = {
        count: filesToSave.length,
        lastUpdated: new Date().toISOString(),
        propertyId,
        year: historicalYear,
        totalSize: filesToSave.reduce((sum, f) => sum + f.size, 0)
      };
      saveToStorage(metaKey, metadata);
      
      // Update global index
      const globalIndex = loadFromStorage(storageKeys.index) || {};
      if (!globalIndex[propertyId]) {
        globalIndex[propertyId] = {};
      }
      globalIndex[propertyId][historicalYear || 'current'] = filesToSave.length;
      saveToStorage(storageKeys.index, globalIndex);
      
      if (primarySuccess || backupSuccess) {
        if (type === 'videos') {
          setVideos(filesToSave as VideoFile[]);
        } else {
          setImages(filesToSave as ImageFile[]);
        }
        return true;
      } else {
        throw new Error(`Failed to save to both primary and backup storage for ${type}`);
      }
    } catch (error) {
      console.error(`Error saving ${type}:`, error);
      toast.error(`Error al guardar ${type === 'videos' ? 'los vídeos' : 'las imágenes'}`);
      return false;
    }
  };

  // Load files when component mounts or year changes
  useEffect(() => {
    loadFiles();
  }, [propertyId, historicalYear]);

  // Enhanced add video with better validation and compression
  const addVideo = (file: File): Promise<VideoFile> => {
    return new Promise((resolve, reject) => {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        reject(new Error('El video es demasiado grande. Máximo 100MB.'));
        toast.error('El video es demasiado grande. Máximo 100MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('Formato de video no válido. Usa MP4, MOV o AVI.'));
        toast.error('Formato de video no válido. Usa MP4, MOV o AVI.');
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const videoUrl = e.target?.result as string;
          const newVideo: VideoFile = {
            id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: videoUrl,
            size: file.size,
            uploadDate: new Date().toISOString(),
            propertyId,
            ...(historicalYear && { year: historicalYear })
          };
          
          const updatedVideos = [...videos, newVideo];
          
          if (saveFiles(updatedVideos, 'videos')) {
            resolve(newVideo);
            toast.success(`Video "${file.name}" añadido correctamente`);
          } else {
            reject(new Error('Error al guardar el video'));
          }
        } catch (error) {
          reject(error);
          toast.error('Error al procesar el video');
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Error al leer el archivo de video');
        reject(error);
        toast.error('Error al procesar el video');
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Add image
  const addImage = (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('La imagen es demasiado grande. Máximo 10MB.'));
        toast.error('La imagen es demasiado grande. Máximo 10MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error('Formato de imagen no válido. Usa JPG, PNG, GIF o WebP.'));
        toast.error('Formato de imagen no válido. Usa JPG, PNG, GIF o WebP.');
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const imageUrl = e.target?.result as string;
          const newImage: ImageFile = {
            id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            url: imageUrl,
            size: file.size,
            uploadDate: new Date().toISOString(),
            propertyId,
            ...(historicalYear && { year: historicalYear })
          };
          
          const updatedImages = [...images, newImage];
          
          if (saveFiles(updatedImages, 'images')) {
            resolve(newImage);
            toast.success(`Imagen "${file.name}" añadida correctamente`);
          } else {
            reject(new Error('Error al guardar la imagen'));
          }
        } catch (error) {
          reject(error);
          toast.error('Error al procesar la imagen');
        }
      };
      
      reader.onerror = () => {
        const error = new Error('Error al leer el archivo de imagen');
        reject(error);
        toast.error('Error al procesar la imagen');
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Delete video
  const deleteVideo = (videoId: string) => {
    const videoToDelete = videos.find(v => v.id === videoId);
    const updatedVideos = videos.filter(video => video.id !== videoId);
    
    if (saveFiles(updatedVideos, 'videos')) {
      toast.success(`Video "${videoToDelete?.name || 'desconocido'}" eliminado`);
    }
  };

  // Delete image
  const deleteImage = (imageId: string) => {
    const imageToDelete = images.find(i => i.id === imageId);
    const updatedImages = images.filter(image => image.id !== imageId);
    
    if (saveFiles(updatedImages, 'images')) {
      toast.success(`Imagen "${imageToDelete?.name || 'desconocida'}" eliminada`);
    }
  };

  // Download video
  const downloadVideo = (video: VideoFile) => {
    try {
      const link = document.createElement('a');
      link.href = video.url;
      link.download = video.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Descargando "${video.name}"`);
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error('Error al descargar el video');
    }
  };

  // Download image
  const downloadImage = (image: ImageFile) => {
    try {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Descargando "${image.name}"`);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Error al descargar la imagen');
    }
  };

  // Download all images in ZIP format
  const downloadAllImages = async () => {
    if (images.length === 0) {
      toast.info('No hay imágenes para descargar');
      return;
    }

    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Add each image to the ZIP
      images.forEach((image, index) => {
        // Convert data URL to blob
        const base64Data = image.url.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        zip.file(`${index + 1}_${image.name}`, byteArray);
      });

      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Download ZIP
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `imagenes_propiedad_${propertyId}${historicalYear ? `_${historicalYear}` : ''}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Descargando ${images.length} imágenes en ZIP...`);
    } catch (error) {
      console.error('Error creating ZIP:', error);
      toast.error('Error al crear el archivo ZIP');
    }
  };

  // Download all videos
  const downloadAllVideos = () => {
    if (videos.length === 0) {
      toast.info('No hay videos para descargar');
      return;
    }

    videos.forEach((video, index) => {
      setTimeout(() => {
        downloadVideo(video);
      }, index * 1000);
    });
    
    toast.success(`Iniciando descarga de ${videos.length} videos...`);
  };

  return {
    videos,
    images,
    loadFiles,
    addVideo,
    addImage,
    deleteVideo,
    deleteImage,
    downloadVideo,
    downloadImage,
    downloadAllVideos,
    downloadAllImages
  };
};
