
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Play, Download, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';
import { useVideoManagement } from '@/hooks/useVideoManagement';

interface VideoUploadProps {
  propertyId: string;
  historicalYear?: number;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ propertyId, historicalYear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { videos, loadVideos, addVideo, deleteVideo, downloadVideo } = useVideoManagement(propertyId);

  React.useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato de video no válido. Usa MP4, MOV o AVI.');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('El video es demasiado grande. Máximo 100MB.');
      return;
    }

    try {
      await addVideo(file);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleVideoPlay = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <Card className={historicalYear ? 'bg-yellow-50 border-yellow-200' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Video className="h-5 w-5" />
          <span>Videos {historicalYear ? `(${historicalYear})` : ''}</span>
        </CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleUploadClick}
          className="flex items-center gap-1"
        >
          <Upload className="h-4 w-4" />
          Subir Video
        </Button>
      </CardHeader>
      
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/mov,video/avi,video/quicktime,video/x-msvideo"
          onChange={handleFileChange}
          className="hidden"
        />

        {videos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay videos subidos</p>
            <p className="text-xs mt-1">Formatos soportados: MP4, MOV, AVI</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg p-3 space-y-2">
                <div className="aspect-video bg-black rounded flex items-center justify-center relative overflow-hidden">
                  <video 
                    src={video.url} 
                    className="w-full h-full object-cover"
                    poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggNUwxOSAxMkw4IDE5VjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
                  />
                  <Button
                    onClick={() => handleVideoPlay(video.url)}
                    className="absolute inset-0 bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
                    variant="ghost"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate" title={video.name}>
                    {video.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(video.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-1">
                  <Button
                    onClick={() => downloadVideo(video)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Descargar
                  </Button>
                  <Button
                    onClick={() => deleteVideo(video.id)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={closeVideoPlayer}>
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
              <video 
                src={selectedVideo} 
                controls 
                autoPlay
                className="max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                onClick={closeVideoPlayer}
                className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70"
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
