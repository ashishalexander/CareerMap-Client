import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ipost } from "@/const/Ipost";
import { PlusCircle, Briefcase, Image, FileVideo, X } from "lucide-react";

export const CreatePost: React.FC<{ onPostCreate: (post: Ipost) => void }> = ({ onPostCreate }) => {
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [articleContent, setArticleContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleArticleSubmit = () => {
    const newPost: Ipost = {
      id: Date.now().toString(),
      content: articleContent,
      media: previewUrl || '',
      type: 'article',
      createdAt: new Date(),
    };
    onPostCreate(newPost);
    setArticleContent('');
    removeSelectedFile();
    setIsArticleDialogOpen(false);
  };

  const handleJobSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPost: Ipost = {
      id: Date.now().toString(),
      content: formData.get('description') as string,
      title: formData.get('title') as string,
      company: formData.get('company') as string,
      location: formData.get('location') as string,
      type: 'job',
      createdAt: new Date().toISOString(),
    };
    onPostCreate(newPost);
    setIsJobDialogOpen(false);
    event.currentTarget.reset();
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <img src="https://placehold.jp/40x40.png" alt="User avatar" className="rounded-full" />
            <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
              <DialogTrigger asChild>
                <button className="w-full text-left rounded-full border px-4 py-2 text-gray-500 hover:bg-gray-100">
                  Start a post
                </button>
              </DialogTrigger>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded">
                  <PlusCircle size={20} />
                  <span>Photo/Video/Article</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] max-h-[800px]">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl">Create a post</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 h-full overflow-y-auto px-4">
                  <Textarea
                    placeholder="What do you want to talk about?"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="min-h-[200px] text-lg"
                  />
                  <div className="space-y-6">
                    <Label htmlFor="media" className="flex items-center gap-2 cursor-pointer">
                      {selectedFile ? (
                        <div className="relative w-full">
                          {previewUrl && (
                            <>
                              {selectedFile.type.startsWith('image/') ? (
                                <img 
                                  src={previewUrl} 
                                  alt="Preview" 
                                  className="max-h-[400px] w-full object-contain rounded" 
                                />
                              ) : (
                                <video 
                                  src={previewUrl} 
                                  className="max-h-[400px] w-full rounded" 
                                  controls 
                                />
                              )}
                              <button
                                onClick={removeSelectedFile}
                                className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                              >
                                <X size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 text-gray-600 p-4 border-2 border-dashed rounded-lg w-full justify-center hover:bg-gray-50">
                          <Image size={24} />
                          <FileVideo size={24} />
                          <span className="text-lg">Add photos or video</span>
                        </div>
                      )}
                    </Label>
                    <input
                      type="file"
                      id="media"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                  <Button 
                    onClick={handleArticleSubmit}
                    disabled={!articleContent.trim() && !selectedFile}
                    className="w-full h-12 text-lg mt-4"
                  >
                    Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded">
                  <Briefcase size={20} />
                  <span>Job</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] max-h-[800px]">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl">Create a job posting</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleJobSubmit} className="space-y-6 h-full overflow-y-auto px-4">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-lg">Job Title</Label>
                    <Input id="title" name="title" required className="h-12 text-lg" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-lg">Company</Label>
                    <Input id="company" name="company" required className="h-12 text-lg" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="location" className="text-lg">Location</Label>
                    <Input id="location" name="location" required className="h-12 text-lg" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-lg">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      required 
                      className="min-h-[200px] text-lg"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg mt-4">Post Job</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CreatePost;