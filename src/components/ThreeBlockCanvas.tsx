import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { BlockType, BlockDetails } from '../types';
import { generateBlockTextures } from '../utils/threeTextures';
import { soundManager } from '../utils/audio';
import { Sparkles, RefreshCw, Volume2, VolumeX, ShieldAlert, Cpu, Zap, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const BLOCK_DATA: Record<BlockType, BlockDetails> = {
  grass: {
    id: 'grass',
    name: 'Grass & Dirt Block',
    flavor: 'Vanilla & Paper Optimized',
    rarity: 'Common',
    hardness: '0.6s (Instant Deploy)',
    description: 'The foundation of every world. High-performance vanilla and Paper servers spin up in 45s.',
    accentColor: '#10b981',
    textColor: 'text-emerald-400',
  },
  dirt: {
    id: 'dirt',
    name: 'Coarse Dirt Block',
    flavor: 'Bedrock Dedicated',
    rarity: 'Common',
    hardness: '0.5s (Lightweight)',
    description: 'Ultra-lean memory footprint with native support for Pocket Edition & Windows 10/11 players.',
    accentColor: '#b45309',
    textColor: 'text-amber-500',
  },
  diamond_ore: {
    id: 'diamond_ore',
    name: 'Deepslate Diamond Ore',
    flavor: 'Purpur Performance Pro',
    rarity: 'Epic',
    hardness: '3.0s (High Throughput)',
    description: 'Tuned for 100+ players, high entity counts, custom mob mechanics and rock-solid 20.0 TPS.',
    accentColor: '#06b6d4',
    textColor: 'text-cyan-400',
  },
  tnt: {
    id: 'tnt',
    name: 'TNT Explosive Core',
    flavor: 'Fabric & Forge Modded',
    rarity: 'Rare',
    hardness: 'Instant (Extreme Power)',
    description: 'Uncapped single-core turbo clock for heavy explosions, automated redstone farms, and 200+ mods.',
    accentColor: '#ef4444',
    textColor: 'text-red-400',
  },
  command_block: {
    id: 'command_block',
    name: 'Command Console Block',
    flavor: 'Real-Time Live Console',
    rarity: 'Legendary',
    hardness: 'Unbreakable Power',
    description: 'Direct server telemetry, instant command autocompletion, live log streaming & automated scripts.',
    accentColor: '#d946ef',
    textColor: 'text-fuchsia-400',
  },
  netherite: {
    id: 'netherite',
    name: 'Block of Netherite',
    flavor: 'Enterprise Bungee Network',
    rarity: 'Legendary',
    hardness: 'DDoS Immune (12 Tbps)',
    description: 'Hardened against massive botnets and high-frequency network attacks with zero downtime.',
    accentColor: '#94a3b8',
    textColor: 'text-slate-300',
  },
  bedrock_block: {
    id: 'bedrock_block',
    name: 'Bedrock Anchor',
    flavor: 'Automatic Cloud Backups',
    rarity: 'Unbreakable',
    hardness: 'Infinite Durability',
    description: 'Hourly snapshots, 1-click restore points, and instant rollbacks stored on redundant S3 buckets.',
    accentColor: '#64748b',
    textColor: 'text-slate-400',
  },
  lucky_block: {
    id: 'lucky_block',
    name: 'Lucky Modpack Block',
    flavor: '1-Click Mods & Plugins',
    rarity: 'Epic',
    hardness: '1.0s (Auto Resolver)',
    description: 'Browse 50,000+ CurseForge & Modrinth mods with instant dependency resolution from your phone.',
    accentColor: '#f59e0b',
    textColor: 'text-amber-400',
  }
};

interface Props {
  selectedBlock?: BlockType;
  onBlockChange?: (block: BlockType) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThreeBlockCanvas: React.FC<Props> = ({
  selectedBlock = 'grass',
  onBlockChange,
  className = '',
  size = 'lg'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeBlock, setActiveBlock] = useState<BlockType>(selectedBlock);
  const [hits, setHits] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPunching, setIsPunching] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(soundManager.isMuted());

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const requestRef = useRef<number | null>(null);

  // Mouse & Scroll rotation state
  const mouseState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    targetRotX: 0.35,
    targetRotY: -0.65,
    currentRotX: 0.35,
    currentRotY: -0.65,
    scrollOffset: 0,
  });

  const blockData = BLOCK_DATA[activeBlock];

  // Sync external prop if updated
  useEffect(() => {
    if (selectedBlock && selectedBlock !== activeBlock) {
      setActiveBlock(selectedBlock);
    }
  }, [selectedBlock]);

  // Update Three.js materials when block changes
  const updateCubeMaterials = useCallback((type: BlockType) => {
    if (!cubeRef.current) return;
    const newMaterials = generateBlockTextures(type);
    cubeRef.current.material = newMaterials;
  }, []);

  // Handle hit / punch on block
  const handleBlockPunch = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundManager.playHitBlock();

    setIsPunching(true);
    setTimeout(() => setIsPunching(false), 120);

    setHits((prev) => {
      const next = prev + 1;
      if (next % 6 === 0) {
        soundManager.playLevelUp();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899']
        });
      }
      return next;
    });

    // Recoil kick on 3D cube
    if (cubeRef.current) {
      cubeRef.current.scale.set(0.92, 0.92, 0.92);
      setTimeout(() => {
        if (cubeRef.current) {
          cubeRef.current.scale.set(1, 1, 1);
        }
      }, 100);
    }
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
    dirLight2.position.set(-5, -4, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10b981, 1.2, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // 3D Minecraft Cube Geometry
    const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const materials = generateBlockTextures(activeBlock);
    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.rotation.x = mouseState.current.currentRotX;
    cube.rotation.y = mouseState.current.currentRotY;
    scene.add(cube);
    cubeRef.current = cube;

    // Floating subtle particle dust (sparks)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 35;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 4;
      posArray[i + 1] = (Math.random() - 0.5) * 4;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x34d399,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Scroll listener for 3D spin trigger
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      mouseState.current.scrollOffset = scrollY * 0.0018;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: w, height: h } = entries[0].contentRect;
      if (w > 0 && h > 0 && rendererRef.current && cameraRef.current) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(containerRef.current);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (cubeRef.current) {
        // Continuous gentle idle spin if not dragging
        if (!mouseState.current.isDragging) {
          mouseState.current.targetRotY += 0.004;
        }

        // Smooth lerp
        const targetY = mouseState.current.targetRotY + mouseState.current.scrollOffset;
        const targetX = mouseState.current.targetRotX + Math.sin(time * 0.0015) * 0.05;

        mouseState.current.currentRotX += (targetX - mouseState.current.currentRotX) * 0.08;
        mouseState.current.currentRotY += (targetY - mouseState.current.currentRotY) * 0.08;

        cubeRef.current.rotation.x = mouseState.current.currentRotX;
        cubeRef.current.rotation.y = mouseState.current.currentRotY;
        cubeRef.current.position.y = Math.sin(time * 0.002) * 0.08;
      }

      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.001;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      geometry.dispose();
    };
  }, []);

  // Update textures when activeBlock changes
  useEffect(() => {
    updateCubeMaterials(activeBlock);
  }, [activeBlock, updateCubeMaterials]);

  // Mouse interaction handlers for 3D drag
  const onMouseDown = (e: React.MouseEvent) => {
    mouseState.current.isDragging = true;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseState.current.isDragging) return;
    const deltaX = e.clientX - mouseState.current.prevX;
    const deltaY = e.clientY - mouseState.current.prevY;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;

    mouseState.current.targetRotY += deltaX * 0.01;
    mouseState.current.targetRotX += deltaY * 0.01;
    mouseState.current.targetRotX = Math.max(-1.2, Math.min(1.2, mouseState.current.targetRotX));
  };

  const onMouseUp = () => {
    mouseState.current.isDragging = false;
  };

  const switchBlock = (type: BlockType) => {
    soundManager.playPop();
    setActiveBlock(type);
    if (onBlockChange) onBlockChange(type);
  };

  const toggleSound = () => {
    const isNowMuted = soundManager.toggleMute();
    setIsSoundMuted(isNowMuted);
    if (!isNowMuted) soundManager.playPop();
  };

  return (
    <div 
      id="interactive-3d-block-container"
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseUp();
      }}
    >
      {/* 3D Canvas with click & drag */}
      <div 
        className="relative w-full aspect-square max-w-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing group"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={() => handleBlockPunch()}
      >
        {/* Glow ambient background aura */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-25 transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: blockData.accentColor }}
        />

        {/* The ThreeJS Canvas */}
        <canvas 
          id="three-voxel-canvas"
          ref={canvasRef} 
          className={`w-full h-full object-contain relative z-10 transition-transform duration-100 ${isPunching ? 'scale-95' : 'scale-100'}`} 
        />

        {/* Floating "Punch Me" Badge on hover */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/70 text-xs font-mono-code text-slate-300 pointer-events-none shadow-lg"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>Click to Mine ({hits})</span>
        </motion.div>

        {/* 3D Hint indicator */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur-sm border border-slate-800 text-[11px] font-mono-code text-slate-400 pointer-events-none">
          <RefreshCw className="w-3 h-3 text-slate-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Drag 360° • Scroll Animated</span>
        </div>

        {/* Sound toggle button */}
        <button
          id="sound-toggle-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
          title={isSoundMuted ? "Unmute sound effects" : "Mute sound effects"}
        >
          {isSoundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Block Information Card & Selector */}
      <div className="w-full max-w-[480px] mt-2 px-3">
        {/* Active Block Spec HUD */}
        <motion.div 
          key={activeBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold tracking-tight ${blockData.textColor}`}>
                  {blockData.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono-code font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {blockData.rarity}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                {blockData.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono-code text-slate-400 block uppercase">Deployment</span>
              <span className="text-xs font-mono-code font-bold text-emerald-400">{blockData.hardness}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono-code">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Optimized: {blockData.flavor}</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>100% NVMe Gen4</span>
            </span>
          </div>
        </motion.div>

        {/* Quick Block Picker Buttons */}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
          {(Object.keys(BLOCK_DATA) as BlockType[]).map((type) => {
            const data = BLOCK_DATA[type];
            const isSelected = activeBlock === type;
            return (
              <button
                key={type}
                id={`select-block-${type}`}
                type="button"
                onClick={() => switchBlock(type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-code transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: data.accentColor }} 
                />
                <span>{data.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
