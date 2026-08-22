export type MinecraftFlavor = 
  | 'paper'
  | 'purpur'
  | 'bedrock'
  | 'vanilla'
  | 'fabric'
  | 'forge'
  | 'spigot'
  | 'velocity';

export interface FlavorInfo {
  id: MinecraftFlavor;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  iconColor: string;
  bgGradient: string;
  bestFor: string;
  compatibility: string;
  tpsScore: number;
  features: string[];
  popularPluginsOrMods: string[];
  versionSupport: string;
  bedrockCrossplay: boolean;
}

export type BlockType = 
  | 'grass'
  | 'dirt'
  | 'diamond_ore'
  | 'command_block'
  | 'tnt'
  | 'netherite'
  | 'bedrock_block'
  | 'lucky_block';

export interface BlockDetails {
  id: BlockType;
  name: string;
  flavor: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Unbreakable';
  hardness: string;
  description: string;
  accentColor: string;
  textColor: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tag: string;
  ramGB: number;
  monthlyPrice: number;
  annualPrice: number;
  playerCapacity: string;
  cpu: string;
  nvmeStorage: string;
  features: string[];
  highlight?: boolean;
  blockType: BlockType;
}

export interface ConsoleLogLine {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM' | 'CHAT';
  message: string;
  color?: string;
}

export interface ModItem {
  id: string;
  name: string;
  author: string;
  downloads: string;
  category: 'Performance' | 'Essentials' | 'World' | 'Tech' | 'Adventure' | 'Economy';
  flavors: MinecraftFlavor[];
  version: string;
  description: string;
  installed?: boolean;
  size: string;
  rating: number;
  icon: string;
}

export interface BackupItem {
  id: string;
  name: string;
  created: string;
  size: string;
  worldName: string;
  flavor: string;
  status: 'Ready' | 'In Progress' | 'Auto Scheduled';
}

export interface DatacenterLocation {
  id: string;
  city: string;
  country: string;
  flag: string;
  region: string;
  ipTest: string;
  basePingMs: number;
  status: 'Operational' | 'Degraded';
  hardware: string;
}
