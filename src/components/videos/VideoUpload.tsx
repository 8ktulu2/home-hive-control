
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Image as ImageIcon, Upload, Download, Trash, PlayCircle } from 'lucide-react';
import { useVideoManagement } from '@/hooks/useVideoManagement';
import { toast } from 'sonner';

interface VideoUploadProps {
  propertyId: string;
  historicalYear?: number;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ propertyId, historicalYear }) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { 
    videos, 
    images, 
    addVideo, 
    addImage, 
    deleteVideo, 
    deleteImage, 
    downloadVideo, 
    downloadImage, 
    downloadAllVideos, 
    downloadAllImages 
  } = useVideoManagement(propertyId, historicalYear);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await addVideo(file);
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
    
    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await addImage(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`w-full ${historicalYear ? 'bg-yellow-50 border-yellow-200' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2 ${historicalYear ? 'text-yellow-900' : ''}`}>
          <Video className="h-5 w-5" />
          Videos e Imágenes {historicalYear && `(${historicalYear})`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleVideoClick}
            variant="outline"
            className={`flex items-center gap-2 ${
              historicalYear ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100' : ''
            }`}
          >
            <Video className="h-4 w-4" />
            Subir Videos
          </Button>
          
          <Button
            onClick={handleImageClick}
            variant="outline"
            className={`flex items-center gap-2 ${
              historicalYear ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100' : ''
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Subir Imágenes
          </Button>

          {images.length > 0 && (
            <Button
              onClick={downloadAllImages}
              variant="outline"
              className={`flex items-center gap-2 ${
                historicalYear ? 'border-yellow-400 text-yellow-800 hover:bg-yellow-100' : ''
              }`}
            >
              <Download className="h-4 w-4" />
              Descargar Todas (ZIP)
            </Button>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/mov,video/avi,video/quicktime,video/x-msvideo"
          multiple
          onChange={handleVideoUpload}
          className="hidden"
        />
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Videos section */}
        {videos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className={`font-medium text-sm ${historicalYear ? 'text-yellow-900' : ''}`}>
                Videos ({videos.length})
              </h4>
              {videos.length > 1 && (
                <Button
                  onClick={downloadAllVideos}
                  variant="ghost"
                  size="sm"
                  className={historicalYear ? 'text-yellow-800 hover:bg-yellow-100' : ''}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Descargar Todos
                </Button>
              )}
            </div>
            
            <div className="grid gap-2">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    historicalYear ? 'border-yellow-300 bg-yellow-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Video className={`h-5 w-5 flex-shrink-0 ${historicalYear ? 'text-yellow-600' : 'text-blue-600'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${historicalYear ? 'text-yellow-900' : ''}`}>
                        {video.name}
                      </p>
                      <p className={`text-xs ${historicalYear ? 'text-yellow-700' : 'text-gray-500'}`}>
                        {formatFileSize(video.size)} • {formatDate(video.uploadDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const video_element = document.createElement('video');
                        video_element.src = video.url;
                        video_element.controls = true;
                        video_element.style.maxWidth = '100%';
                        video_element.style.maxHeight = '400px';
                        
                        const modal = document.createElement('div');
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100%';
                        modal.style.height = '100%';
                        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        modal.style.display = 'flex';
                        modal.style.alignItems = 'center';
                        modal.style.justifyContent = 'center';
                        modal.style.zIndex = '9999';
                        
                        modal.appendChild(video_element);
                        modal.onclick = () => document.body.removeChild(modal);
                        
                        document.body.appendChild(modal);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadVideo(video)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVideo(video.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images section */}
        {images.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className={`font-medium text-sm ${historicalYear ? 'text-yellow-900' : ''}`}>
                Imágenes ({images.length})
              </h4>
            </div>
            
            <div className="grid gap-2">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    historicalYear ? 'border-yellow-300 bg-yellow-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="h-12 w-12 object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm truncate ${historicalYear ? 'text-yellow-900' : ''}`}>
                        {image.name}
                      </p>
                      <p className={`text-xs ${historicalYear ? 'text-yellow-700' : 'text-gray-500'}`}>
                        {formatFileSize(image.size)} • {formatDate(image.uploadDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadImage(image)}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteImage(image.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {videos.length === 0 && images.length === 0 && (
          <div className={`text-center p-6 border-2 border-dashed rounded-lg ${
            historicalYear 
              ? 'border-yellow-300 text-yellow-700' 
              : 'border-gray-300 text-gray-500'
          }`}>
            <div className="flex justify-center gap-2 mb-2">
              <Video className="h-8 w-8" />
              <ImageIcon className="h-8 w-8" />
            </div>
            <p>No hay videos ni imágenes</p>
            <p className="text-xs mt-1">
              Haz clic en los botones de arriba para subir archivos
              {historicalYear ? ` para el año ${historicalYear}` : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
