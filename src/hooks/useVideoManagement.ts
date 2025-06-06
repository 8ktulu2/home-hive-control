
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

// Enhanced persistence with multiple backup strategies
const STORAGE_KEYS = {
  primary: (propertyId: string, year?: number) => 
    year ? `propertyVideos_${propertyId}_${year}` : `propertyVideos_${propertyId}`,
  backup: (propertyId: string, year?: number) => 
    year ? `propertyVideos_backup_${propertyId}_${year}` : `propertyVideos_backup_${propertyId}`,
  index: 'videosGlobalIndex',
  metadata: (propertyId: string, year?: number) => 
    year ? `videosMeta_${propertyId}_${year}` : `videosMeta_${propertyId}`
};

export const useVideoManagement = (propertyId: string, historicalYear?: number) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);

  // Enhanced storage operations with multiple persistence layers
  const saveToStorage = (key: string, data: any): boolean => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      
      // Verify write was successful
      const verification = localStorage.getItem(key);
      return verification === serialized;
    } catch (error) {
      console.error(`Failed to save to ${key}:`, error);
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

  // Load videos with enhanced recovery mechanism
  const loadVideos = () => {
    try {
      const primaryKey = STORAGE_KEYS.primary(propertyId, historicalYear);
      const backupKey = STORAGE_KEYS.backup(propertyId, historicalYear);
      
      // Try primary storage first
      let savedVideos = loadFromStorage(primaryKey);
      
      // If primary fails, try backup
      if (!savedVideos) {
        savedVideos = loadFromStorage(backupKey);
        if (savedVideos) {
          // Restore primary from backup
          saveToStorage(primaryKey, savedVideos);
          console.log('Restored videos from backup storage');
        }
      }
      
      if (savedVideos && Array.isArray(savedVideos)) {
        setVideos(savedVideos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    }
  };

  // Enhanced save with multiple persistence layers
  const saveVideos = (videosToSave: VideoFile[]): boolean => {
    try {
      const primaryKey = STORAGE_KEYS.primary(propertyId, historicalYear);
      const backupKey = STORAGE_KEYS.backup(propertyId, historicalYear);
      const metaKey = STORAGE_KEYS.metadata(propertyId, historicalYear);
      
      // Save to primary storage
      const primarySuccess = saveToStorage(primaryKey, videosToSave);
      
      // Save to backup storage
      const backupSuccess = saveToStorage(backupKey, videosToSave);
      
      // Save metadata
      const metadata = {
        count: videosToSave.length,
        lastUpdated: new Date().toISOString(),
        propertyId,
        year: historicalYear,
        totalSize: videosToSave.reduce((sum, v) => sum + v.size, 0)
      };
      saveToStorage(metaKey, metadata);
      
      // Update global index
      const globalIndex = loadFromStorage(STORAGE_KEYS.index) || {};
      if (!globalIndex[propertyId]) {
        globalIndex[propertyId] = {};
      }
      globalIndex[propertyId][historicalYear || 'current'] = videosToSave.length;
      saveToStorage(STORAGE_KEYS.index, globalIndex);
      
      if (primarySuccess || backupSuccess) {
        setVideos(videosToSave);
        return true;
      } else {
        throw new Error('Failed to save to both primary and backup storage');
      }
    } catch (error) {
      console.error('Error saving videos:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Espacio de almacenamiento agotado. Videos muy grandes.');
      } else {
        toast.error('Error al guardar los vídeos');
      }
      return false;
    }
  };

  // Load videos when component mounts or year changes
  useEffect(() => {
    loadVideos();
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

  // Delete video
  const deleteVideo = (videoId: string) => {
    const videoToDelete = videos.find(v => v.id === videoId);
    const updatedVideos = videos.filter(video => video.id !== videoId);
    
    if (saveVideos(updatedVideos)) {
      toast.success(`Video "${videoToDelete?.name || 'desconocido'}" eliminado`);
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

  // Recovery function
  const recoverVideos = () => {
    try {
      const backupKey = STORAGE_KEYS.backup(propertyId, historicalYear);
      const backupData = loadFromStorage(backupKey);
      
      if (backupData && Array.isArray(backupData)) {
        setVideos(backupData);
        const primaryKey = STORAGE_KEYS.primary(propertyId, historicalYear);
        saveToStorage(primaryKey, backupData);
        toast.success('Videos recuperados del backup');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error recovering videos:', error);
      return false;
    }
  };

  return {
    videos,
    loadVideos,
    addVideo,
    deleteVideo,
    downloadVideo,
    downloadAllVideos,
    recoverVideos
  };
};
