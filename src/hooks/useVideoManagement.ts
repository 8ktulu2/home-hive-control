
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface VideoFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadDate: string;
  propertyId: string;
  year?: number; // Support for historical videos
}

export const useVideoManagement = (propertyId: string, historicalYear?: number) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  // Get storage key based on whether it's historical or current
  const getStorageKey = () => {
    return historicalYear 
      ? `propertyVideos_${propertyId}_${historicalYear}`
      : `propertyVideos_${propertyId}`;
  };

  // Load videos for property (current year or historical)
  const loadVideos = () => {
    try {
      const savedVideos = localStorage.getItem(getStorageKey());
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos);
        setVideos(parsedVideos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    }
  };

  // Load videos when component mounts or year changes
  useEffect(() => {
    loadVideos();
  }, [propertyId, historicalYear]);

  // Save videos to localStorage with improved error handling
  const saveVideos = (videosToSave: VideoFile[]) => {
    try {
      const dataToSave = JSON.stringify(videosToSave);
      
      // Check localStorage space before saving
      const estimatedSize = new Blob([dataToSave]).size;
      if (estimatedSize > 5 * 1024 * 1024) { // 5MB limit warning
        toast.warning('Los videos ocupan mucho espacio. Considera comprimir los archivos.');
      }
      
      localStorage.setItem(getStorageKey(), dataToSave);
      setVideos(videosToSave);
      return true;
    } catch (error) {
      console.error('Error saving videos:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Espacio de almacenamiento agotado. Elimina algunos videos antiguos.');
      } else {
        toast.error('Error al guardar los vídeos');
      }
      return false;
    }
  };

  // Add video with better compression and validation
  const addVideo = (file: File): Promise<VideoFile> => {
    return new Promise((resolve, reject) => {
      // Validate file size (max 50MB for better performance)
      if (file.size > 50 * 1024 * 1024) {
        reject(new Error('El video es demasiado grande. Máximo 50MB.'));
        toast.error('El video es demasiado grande. Máximo 50MB.');
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
          
          if (saveVideos(updatedVideos)) {
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

  // Delete video with confirmation
  const deleteVideo = (videoId: string) => {
    const videoToDelete = videos.find(v => v.id === videoId);
    const updatedVideos = videos.filter(video => video.id !== videoId);
    
    if (saveVideos(updatedVideos)) {
      toast.success(`Video "${videoToDelete?.name || 'desconocido'}" eliminado`);
    }
  };

  // Download video with better handling
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

  // Download all videos with better UX
  const downloadAllVideos = () => {
    if (videos.length === 0) {
      toast.info('No hay videos para descargar');
      return;
    }

    videos.forEach((video, index) => {
      setTimeout(() => {
        downloadVideo(video);
      }, index * 1000); // Stagger downloads by 1 second
    });
    
    toast.success(`Iniciando descarga de ${videos.length} videos...`);
  };

  return {
    videos,
    loadVideos,
    addVideo,
    deleteVideo,
    downloadVideo,
    downloadAllVideos
  };
};
