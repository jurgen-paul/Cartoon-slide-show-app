export type ObjectType = 'character' | 'prop' | 'text-bubble' | 'background';

export interface RigJoint {
  id: string;
  name: string;
  angle: number; // in degrees
  length: number; // joint length
  xOffset: number; // local offset from parent joint
  yOffset: number;
}

export interface CharacterRig {
  characterId: string; // e.g., 'billy', 'wizard', 'knight'
  name: string;
  skinColor: string;
  outfitColor: string;
  expression: {
    eyes: 'happy' | 'sad' | 'angry' | 'surprised' | 'cute';
    mouth: 'gasp' | 'smile' | 'frown' | 'neutral' | 'smirk' | 'open';
  };
  accessory: 'none' | 'sword' | 'wand' | 'balloon' | 'flower' | 'book';
  // Rig joint angles: 
  headAngle: number;
  leftArmAngle: number;
  rightArmAngle: number;
  leftLegAngle: number;
  rightLegAngle: number;
}

export interface CanvasObject {
  id: string;
  type: ObjectType;
  name: string;
  x: number;
  y: number;
  scaleX: number; // supports flipping via negative scale
  scaleY: number;
  rotation: number; // in degrees
  zIndex: number;
  
  // Type-specific properties
  character?: CharacterRig;
  propId?: string; // ID of the vector prop from the library
  textBubble?: {
    text: string;
    style: 'speech' | 'thought' | 'caption' | 'bubble';
    textColor: string;
    bgColor: string;
    borderColor: string;
    fontSize: number;
    width: number;
    height: number;
  };
}

export interface SlideFrame {
  id: string;
  name: string;
  background: {
    type: 'preset' | 'color';
    presetId: string; // preset background ID
    color: string; // fallback or custom color
  };
  objects: CanvasObject[];
}

export interface CartoonProject {
  id: string;
  title: string;
  frames: SlideFrame[];
}

// Preset library definitions
export interface VectorPropPreset {
  id: string;
  name: string;
  category: 'items' | 'nature' | 'accessories' | 'food';
  svgPath: string; // SVG elements as string or standard renderer
  viewBox: string;
  color: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  category: 'outdoor' | 'indoor' | 'fantasy' | 'minimal';
  style: any; // visual representations
}
