// app/app/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Accordion } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/mode-toggle';
import TextCustomizer from '@/components/editor/text-customizer';
import { PlusIcon, ReloadIcon } from '@radix-ui/react-icons';
import { removeBackground } from "@imgly/background-removal";

import '@/app/fonts.css';


const Page = () => {
    const defaultUser = {
        id: 'guest-user',
        username: 'guest',
        full_name: 'Guest User',
        avatar_url: '',
        images_generated: 0,
        paid: true,
        subscription_id: ''
    };

    const [currentUser] = useState(defaultUser);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageSetupDone, setIsImageSetupDone] = useState<boolean>(false);
    const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(null);
    const [textSets, setTextSets] = useState<Array<any>>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleUploadImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            await setupImage(imageUrl);
        }
    };

    const setupImage = async (imageUrl: string) => {
        try {
            const imageBlob = await removeBackground(imageUrl);
            const url = URL.createObjectURL(imageBlob);
            setRemovedBgImageUrl(url);
            setIsImageSetupDone(true);
        } catch (error) {
            console.error(error);
        }
    };

    const addNewTextSet = () => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, {
            id: newId,
            text: 'edit',
            fontFamily: 'Inter',
            top: 0,
            left: 0,
            color: 'white',
            fontSize: 200,
            fontWeight: 800,
            opacity: 1,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowSize: 4,
            rotation: 0,
            X: 0,
            Y: 0
        }]);
    };

    const handleAttributeChange = (id: number, attribute: string, value: any) => {
        setTextSets(prev => prev.map(set =>
            set.id === id ? { ...set, [attribute]: value } : set
        ));
    };

    const duplicateTextSet = (textSet: any) => {
        const newId = Math.max(...textSets.map(set => set.id), 0) + 1;
        setTextSets(prev => [...prev, { ...textSet, id: newId }]);
    };

    const removeTextSet = (id: number) => {
        setTextSets(prev => prev.filter(set => set.id !== id));
    };

    const previewRef = useRef<HTMLDivElement>(null);
    const saveCompositeImage = () => {
        if (!canvasRef.current || !isImageSetupDone || !previewRef.current || !selectedImage) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get the preview container dimensions
        const previewWidth = previewRef.current.offsetWidth;
        const previewHeight = previewRef.current.offsetHeight;

        // Load the original image to get its dimensions
        const bgImg = new window.Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
            const originalWidth = bgImg.width;
            const originalHeight = bgImg.height;

            // Set canvas dimensions to the original image size to preserve resolution
            canvas.width = originalWidth;
            canvas.height = originalHeight;

            // Calculate how the image is scaled in the live preview
            const previewAspectRatio = previewWidth / previewHeight;
            const imageAspectRatio = originalWidth / originalHeight;

            let scaledWidth = previewWidth;
            let scaledHeight = previewHeight;

            // Determine the scaled dimensions in the preview (same logic as objectFit="contain")
            if (previewAspectRatio > imageAspectRatio) {
                scaledWidth = previewHeight * imageAspectRatio;
                scaledHeight = previewHeight;
            } else {
                scaledWidth = previewWidth;
                scaledHeight = previewWidth / imageAspectRatio;
            }

            // Calculate the scale factor between the preview's scaled size and the original size
            const scaleFactorX = scaledWidth / originalWidth;
            const scaleFactorY = scaledHeight / originalHeight;
            const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

            // Draw the background image at the original size
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bgImg, 0, 0, originalWidth, originalHeight);

            // Draw text sets
            textSets.forEach(textSet => {
                ctx.save();

                // Adjust text coordinates to match the preview's scaled context
                const scaledX = (scaledWidth * (textSet.left + 50) / 100);
                const scaledY = (scaledHeight * (50 - textSet.top) / 100);

                // Convert scaled coordinates back to the original image's coordinate system
                const x = scaledX / scaleFactorX;
                const y = scaledY / scaleFactorY;

                // Scale the font size to match the preview
                const scaledFontSize = textSet.fontSize / scaleFactor;

                ctx.font = `${textSet.fontWeight} ${scaledFontSize}px ${textSet.fontFamily}`;
                ctx.fillStyle = textSet.color;
                ctx.globalAlpha = textSet.opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.translate(x, y);
                ctx.rotate((textSet.rotation * Math.PI) / 180);
                ctx.fillText(textSet.text, 0, 0);

                ctx.restore();
            });

            // Draw the removed background image last
            if (removedBgImageUrl) {
                const removedBgImg = new window.Image();
                removedBgImg.crossOrigin = "anonymous";
                removedBgImg.onload = () => {
                    ctx.drawImage(removedBgImg, 0, 0, originalWidth, originalHeight);
                    triggerDownload();
                };
                removedBgImg.src = removedBgImageUrl;
            } else {
                triggerDownload();
            }
            textSets.forEach(textSet => {
                const scaledFontSize = textSet.fontSize / scaleFactor;
            
            });
        };
        bgImg.src = selectedImage;

        function triggerDownload() {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'text-behind-image.png';
            link.href = dataUrl;
            link.click();
        }
    };


    return (
        <div className='flex flex-col h-screen'>
            <div className='flex flex-col h-screen'>

                <header className='flex flex-row items-center justify-between p-5 px-10'>
                    <h2 className="text-4xl md:text-2xl font-semibold tracking-tight">
                        {/* <span className="block md:hidden">TBI</span> */}
                        <span className="hidden md:block">Text behind image editor</span>
                    </h2>
                    <div className='flex gap-4 items-center'>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".jpg, .jpeg, .png"
                        />
                        <div className='flex items-center gap-5'>

                            <div className='flex gap-2'>
                                <Button onClick={handleUploadImage}>
                                    Upload image
                                </Button>
                                {selectedImage && (
                                    <Button onClick={saveCompositeImage} className='hidden md:flex'>
                                        Save image
                                    </Button>
                                )}
                            </div>
                        </div>
                        <ModeToggle />

                    </div>
                </header>
                <Separator />
                {selectedImage ? (
                    <div className='flex flex-col md:flex-row items-start justify-start gap-10 w-full h-screen px-10 mt-2'>
                        <div className="flex flex-col items-start justify-start w-full md:w-1/2 gap-4">
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            <div className='flex items-center gap-2'>
                                <Button onClick={saveCompositeImage} className='md:hidden'>
                                    Save image
                                </Button>
                                <div className='block md:hidden'>
                                    {currentUser.paid ? (
                                        <p className='text-sm'>
                                            Unlimited generations
                                        </p>
                                    ) : (
                                        <div className='flex items-center gap-5'>
                                            <p className='text-sm'>
                                                {2 - (currentUser.images_generated)} generations left
                                            </p>

                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="min-h-[400px] w-[80%] p-4 border border-border rounded-lg relative overflow-hidden" ref={previewRef}>
                                {isImageSetupDone ? (
                                    <Image
                                        src={selectedImage}
                                        alt="Uploaded"
                                        layout="fill"
                                        objectFit="contain"
                                        objectPosition="center"
                                    />
                                ) : (
                                    <span className='flex items-center w-full gap-2'><ReloadIcon className='animate-spin' /> Loading, please wait</span>
                                )}
                                {isImageSetupDone && textSets.map(textSet => (
                                    <div
                                        key={textSet.id}
                                        style={{
                                            position: 'absolute',
                                            top: `${50 - textSet.top}%`,
                                            left: `${textSet.left + 50}%`,
                                            transform: `
                                                translate(-50%, -50%) 
                                                rotate(${textSet.rotation}deg)
                                                perspective(1000px)
                                                rotateX(${textSet.X}deg)
                                                rotateY(${textSet.Y}deg)
                                            `,
                                            color: textSet.color,
                                            textAlign: 'center',
                                            fontSize: `${textSet.fontSize}px`,
                                            fontWeight: textSet.fontWeight,
                                            fontFamily: textSet.fontFamily,
                                            opacity: textSet.opacity,
                                            transformStyle: 'preserve-3d'
                                        }}
                                    >
                                        {textSet.text}
                                    </div>
                                ))}
                                {removedBgImageUrl && (
                                    <Image
                                        src={removedBgImageUrl}
                                        alt="Removed bg"
                                        layout="fill"
                                        objectFit="contain"
                                        objectPosition="center"
                                        className="absolute top-0 left-0 w-full h-full"
                                    />
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col w-full md:w-1/2'>
                            <Button variant={'secondary'} onClick={addNewTextSet}><PlusIcon className='mr-2' /> Add New Text Set</Button>
                            <ScrollArea className="h-[calc(100vh-10rem)] p-2">
                                <Accordion type="single" collapsible className="w-full mt-2">
                                    {textSets.map(textSet => (
                                        <TextCustomizer
                                            key={textSet.id}
                                            textSet={textSet}
                                            handleAttributeChange={handleAttributeChange}
                                            removeTextSet={removeTextSet}
                                            duplicateTextSet={duplicateTextSet}
                                            userId={currentUser.id}
                                        />
                                    ))}
                                </Accordion>
                            </ScrollArea>
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center justify-center min-h-screen w-full'>
                        <h2 className="text-xl font-semibold">Welcome, get started by uploading an image!</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page;