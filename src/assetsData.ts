import React from 'react';

// Predefined backgrounds that can be rendered directly
export interface PresetBackground {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const BACKGROUND_PRESETS: PresetBackground[] = [
  { id: 'forest', name: '🌲 Pine Forest', category: 'outdoor', description: 'Green hills and cartoon pine trees' },
  { id: 'cozy-room', name: '🏠 Cozy Living Room', category: 'indoor', description: 'Cute room with a fireplace and couch' },
  { id: 'outer-space', name: '🚀 Outer Space', category: 'fantasy', description: 'Indigo starry sky with planets and craters' },
  { id: 'city-street', name: '🏙️ City Street', category: 'outdoor', description: 'Skyscrapers silhouette under twilight sky' },
  { id: 'sunset-beach', name: '🏖️ Sunset Beach', category: 'outdoor', description: 'Golden sun setting over the waves and palm trees' },
  { id: 'school', name: '🏫 Cartoon Classroom', category: 'indoor', description: 'Blackboard, clock, and tutor desk' },
  { id: 'minimal-grid', name: '🏁 Minimalist Grid', category: 'minimal', description: 'Clean slate with grid lines for precise layout' },
];

export const PROP_PRESETS = [
  { id: 'sword', name: '⚔️ Knight Sword', category: 'items', color: '#94a3b8' },
  { id: 'wand', name: '✨ Wizard Wand', category: 'items', color: '#fbbf24' },
  { id: 'balloon', name: '🎈 Red Balloon', category: 'nature', color: '#ef4444' },
  { id: 'flower', name: '🌸 Chamomile', category: 'nature', color: '#fca5a5' },
  { id: 'apple', name: '🍎 Crispy Apple', category: 'food', color: '#dc2626' },
  { id: 'burger', name: '🍔 Double Burger', category: 'food', color: '#b45309' },
  { id: 'donut', name: '🍩 Frosted Donut', category: 'food', color: '#ec4899' },
  { id: 'crown', name: '👑 Royal Crown', category: 'accessories', color: '#f59e0b' },
  { id: 'wizard-hat', name: '🧙‍♂️ Sorcerer Hat', category: 'accessories', color: '#6366f1' },
  { id: 'tree-item', name: '🌳 Oak Tree', category: 'nature', color: '#22c55e' },
  { id: 'ghost', name: '👻 Spooky Ghost', category: 'fantasy', color: '#f1f5f9' },
  { id: 'cactus', name: '🌵 Saguaro Cactus', category: 'nature', color: '#15803d' },
];

export const CHARACTER_OUTFITS = [
  { id: 'explorer', name: 'Explorer', primary: '#22c55e', secondary: '#16a34a' },
  { id: 'wizard', name: 'Wizard Robe', primary: '#6366f1', secondary: '#4f46e5' },
  { id: 'knight', name: 'Steel Armor', primary: '#94a3b8', secondary: '#64748b' },
  { id: 'astronaut', name: 'Spacesuit', primary: '#f8fafc', secondary: '#cbd5e1' },
  { id: 'ninja', name: 'Shadow Suit', primary: '#1e293b', secondary: '#0f172a' },
  { id: 'casual', name: 'Casual Hoodie', primary: '#ec4899', secondary: '#db2777' },
];

export const EXPRESSIONS_LIST = [
  { id: 'happy', name: '😊 Happy/Excited' },
  { id: 'sad', name: '😢 Sad/Crying' },
  { id: 'angry', name: '😡 Angry/Furious' },
  { id: 'surprised', name: '😮 Surprised/O-o' },
  { id: 'cute', name: '✨ Cuteness overload' },
];

export const ACCESSORIES_LIST = [
  { id: 'none', name: '❌ No Asset' },
  { id: 'sword', name: '⚔️ Custom Sword' },
  { id: 'wand', name: '✨ Magic Wand' },
  { id: 'balloon', name: '🎈 Red Balloon' },
  { id: 'flower', name: '🌸 Rose / Flower' },
];
