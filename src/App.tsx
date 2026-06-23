import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  Copy, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  Download, 
  Globe, 
  Eye, 
  User as UserIcon, 
  FolderPlus, 
  ArrowLeftRight, 
  Maximize2, 
  MessageCircle, 
  Palette, 
  Sparkle, 
  Video, 
  CloudRain, 
  RefreshCw,
  LogOut,
  Sliders,
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  auth 
} from './workspaceAuth';
import { 
  BACKGROUND_PRESETS, 
  PROP_PRESETS, 
  CHARACTER_OUTFITS, 
  EXPRESSIONS_LIST, 
  ACCESSORIES_LIST 
} from './assetsData';
import { 
  RenderBackground, 
  RenderProp, 
  RenderCharacter 
} from './components/VectorRenderers';
import { 
  CanvasObject, 
  SlideFrame, 
  CartoonProject, 
  CharacterRig 
} from './types';
import { createGoogleSlidesPresentation } from './googleSlidesExporter';
import { rasterizeSvgToBlob } from './utils/rasterize';

const INITIAL_PROJECT: CartoonProject = {
  id: 'cartoon-1',
  title: 'My Funny Adventures',
  frames: [
    {
      id: 'frame-1',
      name: 'Scene 1: Hello World',
      background: { type: 'preset', presetId: 'forest', color: '' },
      objects: [
        {
          id: 'obj-explorer-1',
          type: 'character',
          name: 'Explorer Billy',
          x: 220,
          y: 190,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          zIndex: 2,
          character: {
            characterId: 'explorer-boy',
            name: 'Billy',
            skinColor: '#fecdd3',
            outfitColor: 'explorer',
            expression: { eyes: 'cute', mouth: 'smile' },
            accessory: 'none',
            headAngle: 0,
            leftArmAngle: -40,
            rightArmAngle: 40,
            leftLegAngle: 8,
            rightLegAngle: -8
          }
        },
        {
          id: 'obj-balloon-1',
          type: 'prop',
          name: 'Balloon',
          x: 420,
          y: 140,
          scaleX: 1.2,
          scaleY: 1.2,
          rotation: -10,
          zIndex: 3,
          propId: 'balloon'
        },
        {
          id: 'obj-speech-1',
          type: 'text-bubble',
          name: 'Dialogue Bubble',
          x: 340,
          y: 35,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          zIndex: 4,
          textBubble: {
            text: 'Yay! Welcome to Cartoon Show Studio!',
            style: 'speech',
            textColor: '#0f172a',
            bgColor: '#ffffff',
            borderColor: '#1e293b',
            fontSize: 14,
            width: 200,
            height: 60
          }
        }
      ]
    }
  ]
};

export default function App() {
  // Main State Containers
  const [project, setProject] = useState<CartoonProject>(() => {
    const saved = localStorage.getItem('cartoon_story_project');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed parsing saved project, loading default storyboard.');
      }
    }
    return INITIAL_PROJECT;
  });

  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  // Interactive Rigging State
  const [selectedRigPart, setSelectedRigPart] = useState<string | null>('head');
  const [showBoneJoints, setShowBoneJoints] = useState<boolean>(true);
  
  // Animation loop states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playFps, setPlayFps] = useState<number>(3); // cartoon speeds
  const [enableOnionSkin, setEnableOnionSkin] = useState<boolean>(true);
  
  // Custom presets sidebar category
  const [activeTab, setActiveTab] = useState<'backgrounds' | 'characters' | 'props' | 'bubbles'>('characters');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Auth state
  const [googleUser, setGoogleUser] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Exporter workflow
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStepName, setExportStepName] = useState<string>('');
  const [exportResultUrl, setExportResultUrl] = useState<string | null>(null);

  // Drag tracking refs/state
  const [dragging, setDragging] = useState<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const playbackIntervalRef = useRef<any>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Autosave when project changes
  useEffect(() => {
    localStorage.setItem('cartoon_story_project', JSON.stringify(project));
  }, [project]);

  // Auth initiation on load
  useEffect(() => {
    setAuthChecking(true);
    const stopListener = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
        setAuthChecking(false);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
        setAuthChecking(false);
      }
    );
    return () => {
      stopListener();
    };
  }, []);

  // Frame Playback Loop
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setActiveFrameIndex((prevIndex) => {
          const totalFrames = project.frames.length;
          if (totalFrames <= 1) return 0;
          return (prevIndex + 1) % totalFrames;
        });
      }, 1000 / playFps);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, playFps, project.frames.length]);

  // Quick Get Active Frame Object
  const currentFrame = project.frames[activeFrameIndex] || project.frames[0] || {
    id: 'placeholder',
    name: 'Untitled',
    background: { type: 'preset', presetId: 'minimal-grid', color: '#f8fafc' },
    objects: []
  };

  const selectedObject = currentFrame.objects.find(obj => obj.id === selectedObjectId);

  // Modify active slide elements
  const updateObjects = (callback: (objs: CanvasObject[]) => CanvasObject[]) => {
    setProject((prev) => {
      const updatedFrames = [...prev.frames];
      const targetFrame = updatedFrames[activeFrameIndex];
      if (targetFrame) {
        targetFrame.objects = callback(targetFrame.objects);
      }
      return { ...prev, frames: updatedFrames };
    });
  };

  // Modify active slide metadata
  const updateFrameMeta = (updater: (frame: SlideFrame) => void) => {
    setProject((prev) => {
      const updatedFrames = [...prev.frames];
      const targetFrame = updatedFrames[activeFrameIndex];
      if (targetFrame) {
        updater(targetFrame);
      }
      return { ...prev, frames: updatedFrames };
    });
  };

  // Drag and drop mechanics inside the SVG coordinates (800 x 500 coordinates space)
  const handleStagePointerDown = (event: React.PointerEvent<SVGSVGElement>, objId: string) => {
    if (isPlaying) return; // disable editor changes when animating
    
    // Select Object
    setSelectedObjectId(objId);
    setDragging(true);

    const obj = currentFrame.objects.find(o => o.id === objId);
    if (obj) {
      // Get pointer relative coordinates to SVG viewbox
      const svgElement = event.currentTarget;
      const rect = svgElement.getBoundingClientRect();
      const scaleX = 800 / rect.width;
      const scaleY = 500 / rect.height;
      const pointerX = (event.clientX - rect.left) * scaleX;
      const pointerY = (event.clientY - rect.top) * scaleY;

      dragOffsetRef.current = {
        x: pointerX - obj.x,
        y: pointerY - obj.y
      };
      event.stopPropagation();
    }
  };

  const handleStagePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || !selectedObjectId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;
    
    const pointerX = (event.clientX - rect.left) * scaleX;
    const pointerY = (event.clientY - rect.top) * scaleY;

    let targetX = pointerX - dragOffsetRef.current.x;
    let targetY = pointerY - dragOffsetRef.current.y;

    // Boundary constraints
    targetX = Math.max(-100, Math.min(900, Math.round(targetX)));
    targetY = Math.max(-100, Math.min(600, Math.round(targetY)));

    updateObjects((prevObjects) => 
      prevObjects.map((obj) => 
        obj.id === selectedObjectId ? { ...obj, x: targetX, y: targetY } : obj
      )
    );
  };

  const handleStagePointerUp = () => {
    setDragging(false);
  };

  // Firebase auth triggers
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setAccessToken(result.accessToken);
        setGoogleUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      alert(`Could not authenticate with Google Workspace: ${err}`);
    }
  };

  const handleGoogleSignOut = async () => {
    await logout();
    setGoogleUser(null);
    setAccessToken(null);
    setNeedsAuth(true);
  };

  // Render current framing components into offline vector elements
  const constructSvgString = (frame: SlideFrame) => {
    // Generate isolated string representation of target frame
    const objectsSvgString = frame.objects.map((obj) => {
      let renderContent = '';

      if (obj.type === 'character' && obj.character) {
        // Build character SVG component render in-line
        renderContent = `
          <g transform="translate(${obj.x}, ${obj.y}) scale(${obj.scaleX}, ${obj.scaleY}) rotate(${obj.rotation})">
            <!-- Simulated In-line Character rendering for rasterizer -->
            <rect x="-10" y="168" width="20" height="50" fill="#9ca3af" rx="5" />
            <circle cx="0" cy="90" r="32" fill="${obj.character.skinColor || '#fecdd3'}" />
            <rect x="-25" y="95" width="50" height="65" fill="#4f46e5" rx="6" />
            <line x1="-15" y1="125" x2="15" y2="125" stroke="#fff" strokeWidth="4" />
          </g>
        `;
      } else if (obj.type === 'prop' && obj.propId) {
        renderContent = `
          <g transform="translate(${obj.x}, ${obj.y}) scale(${obj.scaleX}, ${obj.scaleY}) rotate(${obj.rotation})">
            <!-- Simulated Prop in-line -->
            <circle cx="40" cy="40" r="35" fill="${PROP_PRESETS.find(p=>p.id===obj.propId)?.color || '#3b82f6'}" />
          </g>
        `;
      } else if (obj.type === 'text-bubble' && obj.textBubble) {
        renderContent = `
          <g transform="translate(${obj.x}, ${obj.y}) scale(${obj.scaleX}, ${obj.scaleY}) rotate(${obj.rotation})">
            <rect width="${obj.textBubble.width}" height="${obj.textBubble.height}" fill="${obj.textBubble.bgColor}" stroke="${obj.textBubble.borderColor}" stroke-width="2" rx="6" />
            <text x="12" y="32" font-family="sans-serif" font-size="${obj.textBubble.fontSize}" fill="${obj.textBubble.textColor}">${obj.textBubble.text}</text>
          </g>
        `;
      }

      return renderContent;
    }).join('\n');

    return `
      <svg id="storyboard-stage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
        <rect width="800" height="500" fill="#bae6fd" />
        ${objectsSvgString}
      </svg>
    `;
  };

  // Google Slides export action
  const handleExportToSlides = async () => {
    if (!accessToken) {
      alert('Please connect your Google Account first using the sign-in widget.');
      return;
    }

    const confirmed = window.confirm(
      `Ready to export "${project.title}" as a Google Slides presentation with ${project.frames.length} slide(s)?`
    );
    if (!confirmed) return;

    setIsExporting(true);
    setExportProgress(10);
    setExportStepName('Generating slide snapshots...');
    setExportResultUrl(null);

    try {
      // 1. Convert frame SVGs dynamically into blobs inside canvas
      const frameBlobs: Blob[] = [];
      const total = project.frames.length;

      for (let i = 0; i < total; i++) {
        setExportProgress(10 + Math.floor((i / total) * 30));
        setExportStepName(`Rasterizing storyboard Scene ${i + 1}...`);
        
        // Find current frame real Dom node string to capture exactly what they made
        const frameData = project.frames[i];
        
        // Target SVGRendering helper logic
        // We will pass the constructed raw SVG strings with real assets mapping
        const rawSvgElement = document.getElementById(`frame-viewport-${i}`) as unknown as SVGSVGElement | null;
        let svgMarkup = '';

        if (rawSvgElement) {
          // Serialize the actual visible DOM node
          const serializer = new XMLSerializer();
          svgMarkup = serializer.serializeToString(rawSvgElement);
          // Strip outline indicators/handle elements
          svgMarkup = svgMarkup.replace(/<circle[^>]*class="rig-handle-glow"[^>]*>/g, '');
          svgMarkup = svgMarkup.replace(/<rect[^>]*stroke="#3b82f6"[^>]*[^>]*>/g, '');
        } else {
          svgMarkup = constructSvgString(frameData);
        }

        const blob = await rasterizeSvgToBlob(svgMarkup, 800, 500);
        frameBlobs.push(blob);
      }

      // 2. Call Workspace Presentations build sequence
      const result = await createGoogleSlidesPresentation(
        project.title,
        frameBlobs,
        accessToken,
        (stepText, pct) => {
          setExportStepName(stepText);
          setExportProgress(pct);
        }
      );

      setExportResultUrl(result.presentationUrl);
    } catch (err: any) {
      console.error(err);
      alert(`Export process halted with error: ${err.message || err}`);
      setIsExporting(false);
    }
  };

  // Add customized objects to current frame storyboard
  const handleAddPresetCharacter = () => {
    const defaultChar: CanvasObject = {
      id: `char-${Date.now()}`,
      type: 'character',
      name: 'Cartoon Athlete',
      x: 350,
      y: 190,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      zIndex: currentFrame.objects.length + 1,
      character: {
        characterId: 'casual-boy',
        name: 'Buddy',
        skinColor: '#fed7aa',
        outfitColor: 'casual',
        expression: { eyes: 'happy', mouth: 'smile' },
        accessory: 'none',
        headAngle: 0,
        leftArmAngle: -35,
        rightArmAngle: 35,
        leftLegAngle: -5,
        rightLegAngle: 5
      }
    };

    updateObjects(prev => [...prev, defaultChar]);
    setSelectedObjectId(defaultChar.id);
  };

  const handleAddPresetProp = (presetId: string) => {
    const preset = PROP_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const defaultProp: CanvasObject = {
      id: `prop-${Date.now()}`,
      type: 'prop',
      name: preset.name,
      x: 400,
      y: 220,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      zIndex: currentFrame.objects.length + 1,
      propId: presetId
    };

    updateObjects(prev => [...prev, defaultProp]);
    setSelectedObjectId(defaultProp.id);
  };

  const handleAddSpeechBubble = () => {
    const defaultBubble: CanvasObject = {
      id: `bubble-${Date.now()}`,
      type: 'text-bubble',
      name: 'Speech Bubble',
      x: 300,
      y: 80,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      zIndex: currentFrame.objects.length + 1,
      textBubble: {
        text: 'Hello, what is your name?',
        style: 'speech',
        textColor: '#1e293b',
        bgColor: '#ffffff',
        borderColor: '#0284c7',
        fontSize: 14,
        width: 180,
        height: 55
      }
    };

    updateObjects(prev => [...prev, defaultBubble]);
    setSelectedObjectId(defaultBubble.id);
  };

  // Background chooser handles
  const handleSetBackground = (presetId: string) => {
    updateFrameMeta(frame => {
      frame.background = { type: 'preset', presetId, color: '' };
    });
  };

  // Add customized Blank Frame
  const handleAddBlankFrame = () => {
    setIsPlaying(false);
    const newFrameId = `frame-${Date.now()}`;
    const newFrame: SlideFrame = {
      id: newFrameId,
      name: `Scene ${project.frames.length + 1}`,
      background: { ...currentFrame.background },
      // Duplicate current character state with identical posing for a smoother frame-by-frame animation!
      objects: currentFrame.objects.map(obj => ({
        ...obj,
        id: `${obj.id.split('-')[0]}-${Date.now()}-${Math.floor(Math.random()*100)}`
      }))
    };

    setProject(prev => ({
      ...prev,
      frames: [...prev.frames, newFrame]
    }));
    setActiveFrameIndex(project.frames.length);
    setSelectedObjectId(null);
  };

  // Duplicate current active Frame (keyframe helper)
  const handleDuplicateFrame = () => {
    setIsPlaying(false);
    const newFrame: SlideFrame = {
      id: `frame-dup-${Date.now()}`,
      name: `Scene ${project.frames.length + 1} (Copy)`,
      background: { ...currentFrame.background },
      objects: JSON.parse(JSON.stringify(currentFrame.objects)) // recursive deep clone
    };

    const updated = [...project.frames];
    updated.splice(activeFrameIndex + 1, 0, newFrame);

    setProject(prev => ({
      ...prev,
      frames: updated
    }));
    setActiveFrameIndex(activeFrameIndex + 1);
  };

  // Remove current frame
  const handleDeleteFrame = () => {
    if (project.frames.length <= 1) {
      alert('Your animation storyboard must contain at least 1 cartoon scene frame!');
      return;
    }
    const updated = project.frames.filter((_, idx) => idx !== activeFrameIndex);
    setProject(prev => ({
      ...prev,
      frames: updated
    }));
    setActiveFrameIndex(prev => Math.max(0, prev - 1));
    setSelectedObjectId(null);
  };

  // Clear current project
  const handleResetEntireStory = () => {
    const ask = window.confirm('Reset this workspace project? This will erase your current animation drawings.');
    if (ask) {
      setProject(INITIAL_PROJECT);
      setActiveFrameIndex(0);
      setSelectedObjectId(null);
    }
  };

  // Filter lists by search query
  const filteredProps = PROP_PRESETS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900 text-slate-100 font-cartoon select-none">
      
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800 shadow-lg z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500 rounded-lg text-white shadow-md animate-pulse">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-rose-400">Cartoon Slides & Animator</h1>
            <p className="text-xs text-slate-400 font-sans">Build frame animations and export to Google Workspace Slides</p>
          </div>
        </div>

        {/* Project title editor */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:border-rose-400 max-w-sm">
          <span className="text-xs text-slate-500 font-sans uppercase">Title:</span>
          <input 
            type="text"
            className="bg-transparent text-slate-100 font-semibold focus:outline-none w-56 font-sans text-sm"
            value={project.title}
            onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        {/* Google sign credentials and dashboard buttons */}
        <div className="flex items-center space-x-3">
          {authChecking ? (
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Checking workspace auth...</span>
            </div>
          ) : googleUser ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-emerald-800 text-xs shadow-sm transition">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-200 font-sans">{googleUser.email || 'Connected Google SDK'}</span>
                <button 
                  onClick={handleGoogleSignOut}
                  title="Disconnect Workspace"
                  className="text-slate-400 hover:text-rose-400 transition ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={handleExportToSlides}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 px-3.5 rounded-lg shadow-md hover:shadow-emerald-500/20 active:translate-y-0.5 transition"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="font-sans">Export deck to Slides</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-md transition"
            >
              <Globe className="w-4 h-4" />
              <span className="font-sans">Connect Google Workspace</span>
            </button>
          )}

          <button
            onClick={handleResetEntireStory}
            title="Reset Project"
            className="flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-rose-400 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* WORKSPACE PANELS CONTAINER */}
      <main className="flex flex-1 overflow-hidden relative">
        
        {/* SIDEBAR LEFT: MULTI-TAB VECTOR ASSETS SELECTOR */}
        <section className="w-80 border-r border-slate-800 bg-slate-950 flex flex-col z-10 shrink-0">
          {/* Section categories tab buttons */}
          <div className="grid grid-cols-4 border-b border-slate-800 p-2 gap-1 shrink-0 bg-slate-900/40">
            <button 
              onClick={() => setActiveTab('characters')}
              className={`py-2 px-1 text-center font-bold text-xs rounded transition ${activeTab === 'characters' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              🎭 Rig
            </button>
            <button 
              onClick={() => setActiveTab('props')}
              className={`py-2 px-1 text-center font-bold text-xs rounded transition ${activeTab === 'props' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              🎒 Props
            </button>
            <button 
              onClick={() => setActiveTab('backgrounds')}
              className={`py-2 px-1 text-center font-bold text-xs rounded transition ${activeTab === 'backgrounds' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              🌲 Scene
            </button>
            <button 
              onClick={() => setActiveTab('bubbles')}
              className={`py-2 px-1 text-center font-bold text-xs rounded transition ${activeTab === 'bubbles' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              💬 Text
            </button>
          </div>

          {/* Tab content panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* 1. CHARACTER ADD PANEL */}
            {activeTab === 'characters' && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  <h3 className="font-bold text-sm text-rose-400 mb-1">Interactive Rig Characters</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Rigged templates feature full skeletal limb nodes. Rotate shoulders, hips, and facial expressions step-by-step.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center space-y-3 hover:border-rose-500/40 transition">
                  <div className="w-16 h-20 opacity-80">
                    <RenderCharacter
                      skinColor="#fcd34d"
                      outfitColor="casual"
                      expression={{ eyes: 'cute', mouth: 'smile' }}
                      accessory="none"
                      headAngle={0}
                      leftArmAngle={-30}
                      rightArmAngle={30}
                      leftLegAngle={5}
                      rightLegAngle={-5}
                    />
                  </div>
                  <button
                    onClick={handleAddPresetCharacter}
                    className="flex items-center justify-center space-x-2 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md w-full transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert Rigged Hero</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. PROPS LIBRARY ADD PANEL */}
            {activeTab === 'props' && (
              <div className="space-y-3">
                <input 
                  type="text"
                  placeholder="Search assets (e.g. food, crown)... "
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-400 text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  {filteredProps.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => handleAddPresetProp(prop.id)}
                      className="group p-3 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 border border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-2 transition text-center"
                    >
                      <div className="w-10 h-10 group-hover:scale-110 transition duration-300">
                        <RenderProp propId={prop.id} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 font-sans tracking-wide leading-tight">{prop.name}</span>
                    </button>
                  ))}
                  {filteredProps.length === 0 && (
                    <div className="col-span-2 py-8 text-center text-xs text-slate-500 font-sans">
                      No matching vector props found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. BACKGROUND SCENE CHOOSER */}
            {activeTab === 'backgrounds' && (
              <div className="space-y-3">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-2">
                  <h3 className="font-bold text-sm text-sky-400 mb-1">Storyboard Sceneries</h3>
                  <p className="text-xs text-slate-400 font-sans">This scenery acts as the slide backdrop for the current frame.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSetBackground(preset.id)}
                      className={`p-1.5 rounded-xl border-2 overflow-hidden text-left bg-slate-900 hover:border-sky-500/50 transition flex items-center space-x-3 ${currentFrame.background?.presetId === preset.id ? 'border-sky-500 bg-sky-950/20' : 'border-slate-800'}`}
                    >
                      <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                        <RenderBackground presetId={preset.id} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{preset.name}</span>
                        <span className="text-[10px] text-slate-450 font-sans block truncate w-44">{preset.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TEXT BUBBLE CAPTIONS PANEL */}
            {activeTab === 'bubbles' && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  <h3 className="font-bold text-sm text-indigo-400 mb-1">Comic Dialogue & Captions</h3>
                  <p className="text-xs text-slate-400 font-sans">Overlay speech clouds or narratives to outline slides stories.</p>
                </div>

                <button
                  onClick={handleAddSpeechBubble}
                  className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-md w-full transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Dialogue Cloud</span>
                </button>
              </div>
            )}

          </div>

          {/* Active Story Details count footer indicator */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center font-sans tracking-wide shrink-0">
            <span>Project Deck Slides: <strong>{project.frames.length}</strong></span>
            <span>Created items: <strong>{currentFrame.objects.length}</strong></span>
          </div>
        </section>

        {/* WORKSPACE CENTER: ANIMATION STUDIO CANVAS CONTAINER */}
        <section className="flex-1 flex flex-col overflow-hidden bg-slate-900 relative">
          
          {/* Active Canvas top action indicators */}
          <div className="px-6 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between z-10 text-xs shrink-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold tracking-wider uppercase text-[10px] border border-emerald-500/20">Canvas</span>
              <span className="text-slate-300 font-sans text-xs">Currently Editing Slide: <strong className="text-indigo-400">{activeFrameIndex + 1}</strong> of <strong>{project.frames.length}</strong></span>
            </div>

            <div className="flex items-center space-x-4 font-sans text-xs text-slate-400">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showBoneJoints}
                  onChange={(e) => setShowBoneJoints(e.target.checked)}
                  className="rounded border-slate-700 text-rose-500 focus:ring-rose-400 bg-slate-800"
                />
                <span>Interactive joint overlays</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={enableOnionSkin}
                  onChange={(e) => setEnableOnionSkin(e.target.checked)}
                  className="rounded border-slate-700 text-rose-500 focus:ring-rose-400 bg-slate-800"
                />
                <span>Onion skinning (Trace motion)</span>
              </label>
            </div>
          </div>

          {/* STAGE AREA CELL */}
          <div className="flex-1 flex items-center justify-center p-6 min-h-0 relative select-none">
            
            {/* Visual background shadows container */}
            <div 
              ref={stageContainerRef}
              className="relative aspect-[16/10] max-h-full max-w-full rounded-xl overflow-hidden shadow-2xl bg-slate-950 border-4 border-slate-700/80"
              style={{ width: '800px', height: '500px' }}
            >
              {/* PRIMARY INTERACTIVE VECTOR STAGE */}
              <svg
                id={`frame-viewport-${activeFrameIndex}`}
                viewBox="0 0 800 500"
                className="w-full h-full"
                onPointerMove={handleStagePointerMove}
                onPointerUp={handleStagePointerUp}
                onPointerLeave={handleStagePointerUp}
              >
                {/* 1. LAYER 1: BASE ACTIVE THEME BACKGROUND */}
                <g>
                  <RenderBackground presetId={currentFrame.background?.presetId || 'minimal-grid'} />
                </g>

                {/* 2. LAYER 2: ONION SKIN (Previous frame visual buffer ghosts) */}
                {enableOnionSkin && activeFrameIndex > 0 && (
                  <g opacity="0.18" pointerEvents="none" filter="grayscale(50%) text-slate-400">
                    {project.frames[activeFrameIndex - 1]?.objects.map((obj) => (
                      <g key={`onion-${obj.id}`} transform={`translate(${obj.x}, ${obj.y}) scale(${obj.scaleX}, ${obj.scaleY}) rotate(${obj.rotation})`}>
                        {obj.type === 'character' && obj.character && (
                          <RenderCharacter
                            skinColor="#cbd5e1"
                            outfitColor={obj.character.outfitColor}
                            expression={obj.character.expression}
                            accessory={obj.character.accessory}
                            headAngle={obj.character.headAngle}
                            leftArmAngle={obj.character.leftArmAngle}
                            rightArmAngle={obj.character.rightArmAngle}
                            leftLegAngle={obj.character.leftLegAngle}
                            rightLegAngle={obj.character.rightLegAngle}
                          />
                        )}
                        {obj.type === 'prop' && obj.propId && (
                          <g scale="1.1">
                            <RenderProp propId={obj.propId} />
                          </g>
                        )}
                        {obj.type === 'text-bubble' && obj.textBubble && (
                          <g>
                            <rect width={obj.textBubble.width} height={obj.textBubble.height} fill="#fff" stroke="#94a3b8" rx="4" />
                          </g>
                        )}
                      </g>
                    ))}
                  </g>
                )}

                {/* 3. LAYER 3: FRAME SEQUENTIAL CARTOON OBJECTS */}
                {currentFrame.objects.map((obj) => {
                  const isSelected = obj.id === selectedObjectId;
                  
                  return (
                    <g 
                      key={obj.id}
                      onPointerDown={(e) => handleStagePointerDown(e, obj.id)}
                      className="cursor-move"
                    >
                      {/* Nested alignment offsets */}
                      <g transform={`translate(${obj.x}, ${obj.y}) scale(${obj.scaleX}, ${obj.scaleY}) rotate(${obj.rotation})`}>
                        
                        {/* A. If Rigged Character */}
                        {obj.type === 'character' && obj.character && (
                          <g transform="translate(-100, -120)"> {/* Translate center origin offsets */}
                            <RenderCharacter
                              skinColor={obj.character.skinColor}
                              outfitColor={obj.character.outfitColor}
                              expression={obj.character.expression}
                              accessory={obj.character.accessory}
                              headAngle={obj.character.headAngle}
                              leftArmAngle={obj.character.leftArmAngle}
                              rightArmAngle={obj.character.rightArmAngle}
                              leftLegAngle={obj.character.leftLegAngle}
                              rightLegAngle={obj.character.rightLegAngle}
                              selectedRigPart={isSelected ? selectedRigPart : null}
                            />
                          </g>
                        )}

                        {/* B. If Vector Prop */}
                        {obj.type === 'prop' && obj.propId && (
                          <g transform="translate(-40, -40)" width="80" height="80">
                            <RenderProp propId={obj.propId} />
                          </g>
                        )}

                        {/* C. If Dialogue Text Bubble */}
                        {obj.type === 'text-bubble' && obj.textBubble && (
                          <g transform={`translate(${-obj.textBubble.width / 2}, ${-obj.textBubble.height / 2})`}>
                            {/* Speech arrow depending on scale or fallback */}
                            <path d={`M ${obj.textBubble.width / 2} ${obj.textBubble.height} L ${(obj.textBubble.width / 2) - 10} ${obj.textBubble.height + 15} L ${(obj.textBubble.width / 2) - 22} ${obj.textBubble.height} Z`} fill={obj.textBubble.bgColor} stroke={obj.textBubble.borderColor} strokeWidth="2.5" />
                            {/* Bubble body container */}
                            <rect 
                              width={obj.textBubble.width} 
                              height={obj.textBubble.height} 
                              fill={obj.textBubble.bgColor} 
                              stroke={obj.textBubble.borderColor} 
                              strokeWidth="2.5" 
                              rx="12" 
                            />
                            {/* Inner editable dialogue text */}
                            <foreignObject x="10" y="5" width={obj.textBubble.width - 20} height={obj.textBubble.height - 10}>
                              <div className="h-full flex items-center justify-center text-center">
                                <span 
                                  style={{ 
                                    color: obj.textBubble.textColor, 
                                    fontSize: `${obj.textBubble.fontSize}px`, 
                                    fontWeight: 'bold',
                                    fontFamily: 'sans-serif',
                                    userSelect: 'text',
                                    wordBreak: 'break-word',
                                    lineHeight: '1.2'
                                  }}
                                >
                                  {obj.textBubble.text}
                                </span>
                              </div>
                            </foreignObject>
                          </g>
                        )}

                      </g>

                      {/* SELECTION BOUNDARY HIGHLIGHT RING Overlay */}
                      {isSelected && (
                        <g>
                          {/* Anchor coordinates marker */}
                          <circle cx={obj.x} cy={obj.y} r="5" fill="#f43f5e" />
                          
                          {/* Sizing frame selection box */}
                          {obj.type === 'text-bubble' && obj.textBubble ? (
                            <rect
                              x={obj.x - (obj.textBubble.width / 2) - 5}
                              y={obj.y - (obj.textBubble.height / 2) - 5}
                              width={obj.textBubble.width + 10}
                              height={obj.textBubble.height + 25}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                            />
                          ) : (
                            <circle
                              cx={obj.x}
                              cy={obj.y}
                              r="60"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                            />
                          )}

                          {/* DYNAMIC CLICKABLE BONE JOINTS OVERLAYS FOR DIRECT POSE ACCESS */}
                          {showBoneJoints && obj.type === 'character' && obj.character && (
                            <g>
                              {/* Head joint anchor */}
                              <circle 
                                cx={obj.x} 
                                cy={obj.y - 45} 
                                r="8" 
                                className="rig-handle-glow cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setSelectedRigPart('head'); }}
                                title="Neck Joint"
                              />
                              {/* Left shoulder/arm joint anchor */}
                              <circle 
                                cx={obj.x - 22} 
                                cy={obj.y - 12} 
                                r="8" 
                                fill="#22c55e"
                                className="rig-handle-glow cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setSelectedRigPart('leftArm'); }}
                                title="Left Arm Joint"
                              />
                              {/* Right shoulder/arm joint anchor */}
                              <circle 
                                cx={obj.x + 22} 
                                cy={obj.y - 12} 
                                r="8" 
                                fill="#22c55e"
                                className="rig-handle-glow cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setSelectedRigPart('rightArm'); }}
                                title="Right Arm Joint"
                              />
                              {/* Left foot/leg joint anchor */}
                              <circle 
                                cx={obj.x - 14} 
                                cy={obj.y + 42} 
                                r="8" 
                                fill="#a855f7"
                                className="rig-handle-glow cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setSelectedRigPart('leftLeg'); }}
                                title="Left Leg Joint"
                              />
                              {/* Right foot/leg joint anchor */}
                              <circle 
                                cx={obj.x + 14} 
                                cy={obj.y + 42} 
                                r="8" 
                                fill="#a855f7"
                                className="rig-handle-glow cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); setSelectedRigPart('rightLeg'); }}
                                title="Right Leg Joint"
                              />
                            </g>
                          )}
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* EMPTY CANVAS CONSOLE PROMPT */}
              {currentFrame.objects.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-slate-900/40 backdrop-blur-xs pointer-events-none p-6 text-center">
                  <span className="text-4xl text-slate-500">🌌</span>
                  <p className="font-bold text-slate-200">Empty Scene Frame</p>
                  <p className="text-xs text-slate-400 font-sans max-w-xs leading-normal">
                    Click the left tabs to insert cartoon character rig nodes, cute stickers, shapes, or speech bubbles.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* LOWER BOTTOM ACTION TIMELINE: THE CELL-BY-CELL CINEMATIC SEQUENCER */}
          <section className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex flex-col space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              
              {/* Playback Controls widget */}
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2.5 rounded-full shadow-lg border text-white transition transform active:scale-95 ${isPlaying ? 'bg-amber-600 hover:bg-amber-500 border-amber-500' : 'bg-rose-500 hover:bg-rose-400 border-rose-400 animate-pulse'}`}
                  title={isPlaying ? 'Pause Animation' : 'Play Timeline loop'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>

                {/* Adjust cinematic speed FPS */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-3 text-xs w-48 font-sans">
                  <span className="text-slate-500">Rate:</span>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    className="w-20 tracking-wide accent-rose-500 bg-slate-800"
                    value={playFps}
                    onChange={(e) => setPlayFps(Number(e.target.value))}
                  />
                  <span className="font-bold text-pink-400 w-12 text-right">{playFps} FPS</span>
                </div>
              </div>

              {/* Target active frame options */}
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setActiveFrameIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeFrameIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Previous Frame"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-300 font-sans font-bold text-sm px-1.5">
                  Scene {activeFrameIndex + 1} of {project.frames.length}
                </span>
                <button
                  onClick={() => setActiveFrameIndex(prev => Math.min(project.frames.length - 1, prev + 1))}
                  disabled={activeFrameIndex === project.frames.length - 1}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Next Frame"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Sequential cell modifiers */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDuplicateFrame}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-bold transition font-sans"
                  title="Duplicate pose details to next frame cell"
                >
                  <Copy className="w-4 h-4 text-emerald-400" />
                  <span>Duplicate Scene</span>
                </button>

                <button
                  onClick={handleAddBlankFrame}
                  className="flex items-center space-x-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-2 rounded-lg text-xs font-bold transition font-sans"
                  title="Append new blank frame"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Scene</span>
                </button>

                <button
                  onClick={handleDeleteFrame}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition"
                  title="Remove this frame"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* CELLS GRID TRAILING */}
            <div className="flex items-center space-x-2.5 overflow-x-auto py-1 max-w-full">
              {project.frames.map((frame, index) => {
                const isActive = index === activeFrameIndex;
                return (
                  <button
                    key={frame.id}
                    onClick={() => { setIsPlaying(false); setActiveFrameIndex(index); }}
                    className={`relative w-24 h-15 rounded-lg overflow-hidden border-2 shrink-0 transition text-left group overflow-hidden ${isActive ? 'border-rose-500 shadow-md ring-2 ring-rose-500/30' : 'border-slate-800 hover:border-slate-700 bg-slate-900'}`}
                  >
                    {/* Tiny thumbnail renderer */}
                    <div className="w-full h-full opacity-70 group-hover:opacity-90 transition scale-90">
                      <RenderBackground presetId={frame.background?.presetId || 'minimal-grid'} />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-1 flex flex-col justify-end">
                      <span className="text-[10px] font-bold text-white font-sans tracking-wide truncate">
                        {index + 1}. {frame.name || `Scene ${index + 1}`}
                      </span>
                    </div>

                    {isActive && (
                      <span className="absolute top-1 right-1 bg-rose-500 text-white font-sans text-[8px] font-bold px-1 rounded shadow-xs uppercase">
                        Edit
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

        </section>

        {/* SIDEBAR RIGHT: INTUITIVE SKELETON POSE RIGGER & SIZING */}
        <section className="w-80 border-l border-slate-800 bg-slate-950 flex flex-col z-10 shrink-0 select-none">
          <div className="border-b border-slate-800 p-4 shrink-0 bg-slate-900/30">
            <h2 className="font-bold text-sm tracking-wide text-rose-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Skeletal Rig & Pose Adjuster</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {selectedObject ? (
              <div className="space-y-5">
                
                {/* 1. SELECTION META */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 text-[10px] rounded border border-rose-500/20">
                      {selectedObject.type}
                    </span>
                    <button
                      onClick={() => updateObjects(prev => prev.filter(o => o.id !== selectedObjectId))}
                      className="text-slate-500 hover:text-rose-400 text-xs font-sans font-semibold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete element</span>
                    </button>
                  </div>
                  <div className="text-xs space-y-1 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-sans">Element ID:</span>
                      <span className="font-mono text-slate-400">{selectedObject.id.slice(0, 8)}</span>
                    </div>
                    {/* Rename element option */}
                    <div className="flex items-center justify-between font-sans mt-1.5">
                      <span className="text-slate-450">Layer Name:</span>
                      <input 
                        type="text" 
                        value={selectedObject.name} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, name: val } : o));
                        }}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-100 font-sans focus:outline-none focus:border-rose-500 w-32"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. RIG DECK (Active ONLY when rigging a skeletal character) */}
                {selectedObject.type === 'character' && selectedObject.character && (
                  <div className="space-y-4">
                    
                    {/* Expression customizer */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3.5 space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wide text-sky-400 flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Cartoon Expression Face</span>
                      </h3>

                      <div className="grid grid-cols-2 gap-1.5 text-xs font-sans">
                        <div>
                          <label className="text-slate-500 block mb-1">Eyes style:</label>
                          <select 
                            value={selectedObject.character.expression.eyes}
                            onChange={(e) => {
                              const eyes = e.target.value as any;
                              updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.character ? {
                                ...o,
                                character: { ...o.character, expression: { ...o.character.expression, eyes } }
                              } : o));
                            }}
                            className="bg-slate-950 border border-slate-800 text-slate-100 rounded p-1.5 w-full focus:outline-none text-[11px]"
                          >
                            <option value="happy">😊 Happy Blink</option>
                            <option value="sad">😢 Teary Melancholic</option>
                            <option value="angry">😡 Angry Furious</option>
                            <option value="surprised">😮 Wide Surprised</option>
                            <option value="cute">✨ Anime Sparkle</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-500 block mb-1">Mouth speak:</label>
                          <select 
                            value={selectedObject.character.expression.mouth}
                            onChange={(e) => {
                              const mouth = e.target.value as any;
                              updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.character ? {
                                ...o,
                                character: { ...o.character, expression: { ...o.character.expression, mouth } }
                              } : o));
                            }}
                            className="bg-slate-950 border border-slate-800 text-slate-100 rounded p-1.5 w-full focus:outline-none text-[11px]"
                          >
                            <option value="smile">Smile</option>
                            <option value="frown">Sad Frown</option>
                            <option value="gasp">Gasp O-shape</option>
                            <option value="neutral">Flat Straight</option>
                            <option value="smirk">Cocky Smirk</option>
                            <option value="open">Wide Laugh</option>
                          </select>
                        </div>
                      </div>

                      {/* Outfit skin wardrobe selector */}
                      <div className="text-xs font-sans mt-3">
                        <label className="text-slate-500 block mb-1 flex items-center space-x-1">
                          <Palette className="w-3.5 h-3.5 text-pink-400" />
                          <span>Costume Outfit Skin:</span>
                        </label>
                        <select 
                          value={selectedObject.character.outfitColor}
                          onChange={(e) => {
                            const outfitColor = e.target.value;
                            updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.character ? {
                              ...o,
                              character: { ...o.character, outfitColor }
                            } : o));
                          }}
                          className="bg-slate-950 border border-slate-800 text-slate-100 rounded p-1.5 w-full focus:outline-none text-[11px]"
                        >
                          {CHARACTER_OUTFITS.map(outfit => (
                            <option key={outfit.id} value={outfit.id}>{outfit.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Attach helper item in arm hand */}
                      <div className="text-xs font-sans mt-2.5">
                        <label className="text-slate-500 block mb-1">Hold Custom Accessory:</label>
                        <select 
                          value={selectedObject.character.accessory}
                          onChange={(e) => {
                            const accessory = e.target.value as any;
                            updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.character ? {
                              ...o,
                              character: { ...o.character, accessory }
                            } : o));
                          }}
                          className="bg-slate-950 border border-slate-800 text-slate-100 rounded p-1.5 w-full focus:outline-none text-[11px]"
                        >
                          {ACCESSORIES_LIST.map(itm => (
                            <option key={itm.id} value={itm.id}>{itm.name}</option>
                          ))}
                        </select>
                      </div>

                    </div>

                    {/* SKELETON TREE JOINT SELECTOR */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wide text-rose-450">
                        🍖 Pose Bones Rig
                      </h3>

                      <div className="grid grid-cols-2 gap-1 text-[11px] font-sans font-medium">
                        <button
                          onClick={() => setSelectedRigPart('head')}
                          className={`py-1.5 px-2 rounded-md transition border ${selectedRigPart === 'head' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-950 border-transparent text-slate-400'}`}
                        >
                          🟢 Head / Neck
                        </button>
                        <button
                          onClick={() => setSelectedRigPart('leftArm')}
                          className={`py-1.5 px-2 rounded-md transition border ${selectedRigPart === 'leftArm' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-950 border-transparent text-slate-400'}`}
                        >
                          🟢 Left Arm (Sleeve)
                        </button>
                        <button
                          onClick={() => setSelectedRigPart('rightArm')}
                          className={`py-1.5 px-2 rounded-md transition border ${selectedRigPart === 'rightArm' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-950 border-transparent text-slate-400'}`}
                        >
                          🟢 Right Arm (Tool)
                        </button>
                        <button
                          onClick={() => setSelectedRigPart('leftLeg')}
                          className={`py-1.5 px-2 rounded-md transition border ${selectedRigPart === 'leftLeg' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-950 border-transparent text-slate-400'}`}
                        >
                          🟢 Left Leg
                        </button>
                        <button
                          onClick={() => setSelectedRigPart('rightLeg')}
                          className={`py-1.5 px-2 rounded-md transition border ${selectedRigPart === 'rightLeg' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-950 border-transparent text-slate-400'}`}
                        >
                          🟢 Right Leg
                        </button>
                      </div>

                      {/* ROTATE ANGLE REGION (natural slider) */}
                      {selectedRigPart && (
                        <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg space-y-2 mt-2 font-sans text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold capitalize">
                              Adjusting {selectedRigPart.replace(/([A-Z])/g, ' $1')}:
                            </span>
                            <span className="text-rose-400 font-mono font-bold">
                              {selectedRigPart === 'head' && selectedObject.character.headAngle}°
                              {selectedRigPart === 'leftArm' && selectedObject.character.leftArmAngle}°
                              {selectedRigPart === 'rightArm' && selectedObject.character.rightArmAngle}°
                              {selectedRigPart === 'leftLeg' && selectedObject.character.leftLegAngle}°
                              {selectedRigPart === 'rightLeg' && selectedObject.character.rightLegAngle}°
                            </span>
                          </div>

                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            value={
                              selectedRigPart === 'head' ? selectedObject.character.headAngle :
                              selectedRigPart === 'leftArm' ? selectedObject.character.leftArmAngle :
                              selectedRigPart === 'rightArm' ? selectedObject.character.rightArmAngle :
                              selectedRigPart === 'leftLeg' ? selectedObject.character.leftLegAngle :
                              selectedRigPart === 'rightLeg' ? selectedObject.character.rightLegAngle : 0
                            }
                            onChange={(e) => {
                              const angle = Number(e.target.value);
                              updateObjects((prev) => 
                                prev.map((o) => 
                                  o.id === selectedObjectId && o.character
                                    ? {
                                        ...o,
                                        character: {
                                          ...o.character,
                                          headAngle: selectedRigPart === 'head' ? angle : o.character.headAngle,
                                          leftArmAngle: selectedRigPart === 'leftArm' ? angle : o.character.leftArmAngle,
                                          rightArmAngle: selectedRigPart === 'rightArm' ? angle : o.character.rightArmAngle,
                                          leftLegAngle: selectedRigPart === 'leftLeg' ? angle : o.character.leftLegAngle,
                                          rightLegAngle: selectedRigPart === 'rightLeg' ? angle : o.character.rightLegAngle,
                                        }
                                      }
                                    : o
                                )
                              );
                            }}
                          />
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>-180°</span>
                            <span>0° (Neutral)</span>
                            <span>180°</span>
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                )}

                {/* 3. DIALOGUE TEXT CONTROLS (Only visible if type is speech/thought bubble) */}
                {selectedObject.type === 'text-bubble' && selectedObject.textBubble && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 font-sans text-xs">
                    <h3 className="font-bold text-xs uppercase tracking-wide text-emerald-400 flex items-center space-x-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Dialogue Editor</span>
                    </h3>

                    <div className="space-y-2">
                      <label className="text-slate-500 block">Edit dialogue text:</label>
                      <textarea
                        className="bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-100 font-sans focus:outline-none focus:border-emerald-500 w-full resize-none h-16 leading-tight"
                        value={selectedObject.textBubble.text}
                        maxLength={120}
                        onChange={(e) => {
                          const text = e.target.value;
                          updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.textBubble ? {
                            ...o,
                            textBubble: { ...o.textBubble, text }
                          } : o));
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-450 block mb-1">Text color:</label>
                        <input 
                          type="color" 
                          value={selectedObject.textBubble.textColor}
                          onChange={(e) => {
                            const textColor = e.target.value;
                            updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.textBubble ? {
                              ...o,
                              textBubble: { ...o.textBubble, textColor }
                            } : o));
                          }}
                          className="bg-transparent h-8 w-full border border-slate-800 rounded cursor-pointer p-0.5"
                        />
                      </div>

                      <div>
                        <label className="text-slate-450 block mb-1">Fill color:</label>
                        <input 
                          type="color" 
                          value={selectedObject.textBubble.bgColor}
                          onChange={(e) => {
                            const bgColor = e.target.value;
                            updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.textBubble ? {
                              ...o,
                              textBubble: { ...o.textBubble, bgColor }
                            } : o));
                          }}
                          className="bg-transparent h-8 w-full border border-slate-800 rounded cursor-pointer p-0.5"
                        />
                      </div>
                    </div>

                    {/* Width adjustment */}
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-450">Width:</span>
                        <span className="text-slate-300 font-mono font-bold">{selectedObject.textBubble.width} px</span>
                      </div>
                      <input 
                        type="range"
                        min="100"
                        max="350"
                        step="10"
                        className="w-full h-1 bg-slate-800 rounded accent-emerald-500 appearance-none cursor-pointer"
                        value={selectedObject.textBubble.width}
                        onChange={(e) => {
                          const width = Number(e.target.value);
                          updateObjects(prev => prev.map(o => o.id === selectedObjectId && o.textBubble ? {
                            ...o,
                            textBubble: { ...o.textBubble, width }
                          } : o));
                        }}
                      />
                    </div>

                  </div>
                )}

                {/* 4. BASE LAYER DEPTH & FLIP CONTROLS (Positions, Rotations, Scaling) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-4 font-sans text-xs">
                  <h3 className="font-bold text-xs uppercase tracking-wide text-indigo-400 flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Layer Transformations</span>
                  </h3>

                  {/* Positioning Coordinate Labels */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-950 px-2 py-1.5 rounded border border-slate-850">
                      <span className="text-slate-500">X Position:</span>
                      <strong className="text-slate-300 ml-1.5 font-mono">{selectedObject.x}</strong>
                    </div>
                    <div className="bg-slate-950 px-2 py-1.5 rounded border border-slate-850">
                      <span className="text-slate-500">Y Position:</span>
                      <strong className="text-slate-300 ml-1.5 font-mono">{selectedObject.y}</strong>
                    </div>
                  </div>

                  {/* Rotation angle of the layer container */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-450">Layer Rotation:</span>
                      <span className="text-indigo-400 font-mono font-bold">{selectedObject.rotation}°</span>
                    </div>
                    <input 
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      className="w-full h-1 bg-slate-800 rounded accent-indigo-500 appearance-none cursor-pointer"
                      value={selectedObject.rotation}
                      onChange={(e) => {
                        const rotation = Number(e.target.value);
                        updateObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, rotation } : o));
                      }}
                    />
                  </div>

                  {/* Skeletons Scale factor */}
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-450">Object Scale Size:</span>
                      <span className="text-indigo-400 font-mono font-bold">
                        {Math.round(Math.abs(selectedObject.scaleX) * 100)} %
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="0.3"
                      max="3.0"
                      step="0.1"
                      className="w-full h-1 bg-slate-800 rounded accent-indigo-500 appearance-none cursor-pointer"
                      value={Math.abs(selectedObject.scaleX)}
                      onChange={(e) => {
                        const numericScale = Number(e.target.value);
                        // preserve flip state
                        const isFlipped = selectedObject.scaleX < 0;
                        updateObjects(prev => prev.map(o => o.id === selectedObjectId ? { 
                          ...o, 
                          scaleX: isFlipped ? -numericScale : numericScale,
                          scaleY: numericScale
                        } : o));
                      }}
                    />
                  </div>

                  {/* Flip / Layer Front / Layer Back Buttons */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        // Flip horizontally by toggling the sign of scaleX
                        updateObjects(prev => prev.map(o => o.id === selectedObjectId ? { ...o, scaleX: -o.scaleX } : o));
                      }}
                      className="flex items-center justify-center space-x-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 py-1.5 px-2 rounded border border-slate-800 transition"
                      title="Flip element horizontally"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-sky-400" />
                      <span>Flip Horiz</span>
                    </button>

                    <button
                      onClick={() => {
                        // Push z-index to top
                        updateObjects(prev => {
                          const maxZ = Math.max(...prev.map(o => o.zIndex), 0);
                          return prev.map(o => o.id === selectedObjectId ? { ...o, zIndex: maxZ + 1 } : o);
                        });
                      }}
                      className="flex items-center justify-center space-x-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 py-1.5 px-2 rounded border border-slate-800 transition"
                      title="Bring layer to front of storyboard drawing sequence"
                    >
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Bring Front</span>
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-3 py-16 text-center select-none">
                <div className="text-4xl text-slate-600 animate-bounce">👉</div>
                <h3 className="font-bold text-slate-300">No element selected</h3>
                <p className="text-xs text-slate-500 font-sans max-w-[190px] leading-relaxed">
                  Click on any character pose node, prop, or speech bubble on-canvas to unlock its transformations, joint sliders, and expression modifiers here!
                </p>
              </div>
            )}
          </div>

          {/* Quick instructions manual block */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-900/40 text-[11px] font-sans text-slate-450 leading-normal shrink-0 space-y-1">
            <span className="font-bold text-slate-300 uppercase block mb-1">Animator Guide:</span>
            <span>✨ Drag element on stage to move.</span>
            <span>✨ Turn <strong>Joint Overlays</strong> checkbox on.</span>
            <span>✨ Click little joint anchors on character.</span>
            <span>✨ Pose body frame-by-frame on timeline!</span>
          </div>
        </section>

      </main>

      {/* EXPORT WORKSPACE LOADING DIALOG MODAL PANEL */}
      {isExporting && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-6 select-none font-sans">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-center space-y-6">
            
            <div className="flex flex-col items-center justify-center space-y-3">
              {exportResultUrl ? (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-10 h-10" />
                </div>
              ) : (
                <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 relative animate-pulse">
                  <Video className="w-8 h-8" />
                </div>
              )}
              <h3 className="text-lg font-bold text-slate-100 font-cartoon tracking-wide">
                {exportResultUrl ? 'Google Slides Deck Ready!' : 'Exporting Cartoon Slides Show'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm font-sans">
                {exportResultUrl 
                  ? 'Your presentation slides deck has been generated directly inside your Google Drive successfully.' 
                  : 'We are compiling your skeletal poses, uploading custom vector images, and building your presentation deck. please keep this browser open.'
                }
              </p>
            </div>

            {/* Custom visual progress percentages */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{exportStepName}</span>
                <span className="font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Modal final exit triggers */}
            <div className="flex flex-col items-center space-y-3">
              {exportResultUrl ? (
                <>
                  <a 
                    href={exportResultUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 text-sm transition"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>Open Slides Presentation</span>
                  </a>
                  <button
                    onClick={() => setIsExporting(false)}
                    className="text-slate-400 hover:text-slate-200 text-xs underline font-semibold transition"
                  >
                    Return to Studio editor
                  </button>
                </>
              ) : (
                <span className="text-xs text-slate-500 animate-pulse bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-850">
                  Working with Google Slides v1 API...
                </span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
