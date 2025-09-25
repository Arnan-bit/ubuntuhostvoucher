'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Monitor, 
    Tablet, 
    Smartphone, 
    Eye, 
    EyeOff,
    Maximize,
    Minimize,
    RefreshCw
} from 'lucide-react';

interface TemplatePreviewProps {
    template: any;
    viewMode: 'desktop' | 'tablet' | 'mobile';
    onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    isFullscreen?: boolean;
    onToggleFullscreen?: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
    template,
    viewMode,
    onViewModeChange,
    isFullscreen = false,
    onToggleFullscreen
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const getPreviewDimensions = () => {
        switch (viewMode) {
            case 'mobile':
                return { width: '375px', height: '667px' };
            case 'tablet':
                return { width: '768px', height: '1024px' };
            case 'desktop':
            default:
                return { width: '100%', height: '100%' };
        }
    };

    const refreshPreview = () => {
        setIsLoading(true);
        if (iframeRef.current) {
            iframeRef.current.src = iframeRef.current.src;
        }
        setTimeout(() => setIsLoading(false), 1000);
    };

    const generatePreviewHTML = () => {
        const { primaryColor = 'blue', fontFamily = 'Inter', fontSize = 16, layout = 'single-column' } = template || {};
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template?.title || 'Preview'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${fontFamily}', sans-serif;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: #333;
            background: ${template?.backgroundType === 'gradient' 
                ? `linear-gradient(135deg, var(--${primaryColor}-500), var(--${primaryColor}-700))` 
                : template?.backgroundType === 'color' 
                    ? `var(--${primaryColor}-50)` 
                    : '#ffffff'
            };
        }
        
        :root {
            --blue-50: #eff6ff;
            --blue-500: #3b82f6;
            --blue-700: #1d4ed8;
            --green-50: #f0fdf4;
            --green-500: #22c55e;
            --green-700: #15803d;
            --purple-50: #faf5ff;
            --purple-500: #a855f7;
            --purple-700: #7c3aed;
            --orange-50: #fff7ed;
            --orange-500: #f97316;
            --orange-700: #c2410c;
            --red-50: #fef2f2;
            --red-500: #ef4444;
            --red-700: #dc2626;
            --pink-50: #fdf2f8;
            --pink-500: #ec4899;
            --pink-700: #be185d;
            --indigo-50: #eef2ff;
            --indigo-500: #6366f1;
            --indigo-700: #4338ca;
            --teal-50: #f0fdfa;
            --teal-500: #14b8a6;
            --teal-700: #0f766e;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 1rem 0;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--${primaryColor}-500);
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-menu a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-menu a:hover {
            color: var(--${primaryColor}-500);
        }
        
        .hero {
            padding: 4rem 0;
            text-align: center;
            background: linear-gradient(135deg, var(--${primaryColor}-500), var(--${primaryColor}-700));
            color: white;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 800;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: white;
            color: var(--${primaryColor}-500);
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.3s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
        
        .section {
            padding: 4rem 0;
        }
        
        .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 3rem;
            color: var(--${primaryColor}-700);
        }
        
        .grid {
            display: grid;
            gap: 2rem;
            ${layout === 'three-column' ? 'grid-template-columns: repeat(3, 1fr);' : 
              layout === 'two-column' ? 'grid-template-columns: repeat(2, 1fr);' : 
              'grid-template-columns: 1fr;'}
        }
        
        .card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h3 {
            color: var(--${primaryColor}-600);
            margin-bottom: 1rem;
        }
        
        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem 0;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
            
            .nav-menu {
                display: none;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">${template?.title || 'Your Website'}</div>
            <ul class="nav-menu">
                ${(template?.menuItems || ['Home', 'About', 'Services', 'Contact']).map((item: string) => 
                    `<li><a href="#${item.toLowerCase()}">${item}</a></li>`
                ).join('')}
            </ul>
        </nav>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>${template?.title || 'Welcome to Your Website'}</h1>
            <p>${template?.description || 'Create amazing experiences with our professional templates'}</p>
            <a href="#" class="btn">Get Started</a>
        </div>
    </section>
    
    <section class="section">
        <div class="container">
            <h2>Our Services</h2>
            <div class="grid">
                <div class="card">
                    <h3>Service One</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                </div>
                <div class="card">
                    <h3>Service Two</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                </div>
                ${layout === 'three-column' ? `
                <div class="card">
                    <h3>Service Three</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                </div>
                ` : ''}
            </div>
        </div>
    </section>
    
    <section class="section" style="background: #f8f9fa;">
        <div class="container">
            <h2>About Us</h2>
            <div style="text-align: center; max-width: 600px; margin: 0 auto;">
                <p>We are passionate about creating beautiful, functional websites that help businesses grow and succeed online. Our team combines creativity with technical expertise to deliver exceptional results.</p>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2024 ${template?.title || 'Your Website'}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>
        `;
    };

    const dimensions = getPreviewDimensions();

    return (
        <div className={`flex flex-col h-full bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {/* Preview Toolbar */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">Preview</h3>
                        
                        {/* View Mode Buttons */}
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                            {[
                                { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
                                { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
                                { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' }
                            ].map(({ mode, icon: Icon, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => onViewModeChange(mode)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                        viewMode === mode 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon size={16} />
                                    <span className="text-sm">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`p-2 rounded-lg transition-colors ${
                                showGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Toggle Grid"
                        >
                            {showGrid ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        
                        <button
                            onClick={refreshPreview}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh Preview"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        
                        {onToggleFullscreen && (
                            <button
                                onClick={onToggleFullscreen}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                            >
                                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                {showGrid && (
                    <div 
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px'
                        }}
                    />
                )}
                
                <motion.div
                    key={viewMode}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                >
                    {isLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                            <div className="flex items-center gap-3">
                                <RefreshCw size={20} className="animate-spin text-blue-500" />
                                <span className="text-gray-600">Loading preview...</span>
                            </div>
                        </div>
                    )}
                    
                    <iframe
                        ref={iframeRef}
                        srcDoc={generatePreviewHTML()}
                        className="w-full h-full border-0"
                        title="Template Preview"
                        onLoad={() => setIsLoading(false)}
                    />
                </motion.div>
                
                {/* Device Frame for Mobile/Tablet */}
                {viewMode !== 'desktop' && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className={`
                            absolute bg-gray-800 rounded-3xl
                            ${viewMode === 'mobile' 
                                ? 'w-96 h-[700px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' 
                                : 'w-[800px] h-[1056px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                            }
                        `} style={{ zIndex: -1 }}>
                            <div className={`
                                absolute bg-black rounded-2xl
                                ${viewMode === 'mobile' 
                                    ? 'top-4 left-4 right-4 bottom-4' 
                                    : 'top-4 left-4 right-4 bottom-4'
                                }
                            `} />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Preview Info */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Viewing: <span className="font-medium capitalize">{viewMode}</span>
                        {viewMode !== 'desktop' && (
                            <span className="ml-2">({dimensions.width} × {dimensions.height})</span>
                        )}
                    </div>
                    <div>
                        Template: <span className="font-medium">{template?.title || 'Untitled'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;
