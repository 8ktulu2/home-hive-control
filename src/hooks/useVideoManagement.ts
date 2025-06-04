
import { useState } from 'react';
import { toast } from 'sonner';

export interface VideoFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadDate: string;
  propertyId: string;
}

export const useVideoManagement = (propertyId: string) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  // Load videos for property
  const loadVideos = () => {
    try {
      const savedVideos = localStorage.getItem(`propertyVideos_${propertyId}`);
      if (savedVideos) {
        setVideos(JSON.parse(savedVideos));
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  };

  // Save videos to localStorage
  const saveVideos = (videosToSave: VideoFile[]) => {
    try {
      localStorage.setItem(`propertyVideos_${propertyId}`, JSON.stringify(videosToSave));
      setVideos(videosToSave);
    } catch (error) {
      console.error('Error saving videos:', error);
      toast.error('Error al guardar los vídeos');
    }
  };

  // Add video
  const addVideo = (file: File): Promise<VideoFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const videoUrl = e.target?.result as string;
        const newVideo: VideoFile = {
          id: `video-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: videoUrl,
          size: file.size,
          uploadDate: new Date().toISOString(),
          propertyId
        };
        
        const updatedVideos = [...videos, newVideo];
        saveVideos(updatedVideos);
        resolve(newVideo);
        toast.success('Vídeo añadido correctamente');
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo de vídeo'));
        toast.error('Error al procesar el vídeo');
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Delete video
  const deleteVideo = (videoId: string) => {
    const updatedVideos = videos.filter(video => video.id !== videoId);
    saveVideos(updatedVideos);
    toast.success('Vídeo eliminado');
  };

  // Download video
  const downloadVideo = (video: VideoFile) => {
    const link = document.createElement('a');
    link.href = video.url;
    link.download = video.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all videos as ZIP (simplified version)
  const downloadAllVideos = () => {
    videos.forEach((video, index) => {
      setTimeout(() => {
        downloadVideo(video);
      }, index * 500); // Stagger downloads
    });
    toast.success(`Descargando ${videos.length} vídeos...`);
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
