export const cellTypes = [
  {
    id: 'animal',
    name: 'Animal Cell',
    organelles: [
      { id: 'nucleus', name: 'Nucleus', color: '#8b5cf6', size: 40, description: 'Contains DNA, controls cell activities' },
      { id: 'mitochondria', name: 'Mitochondria', color: '#ef4444', size: 20, description: 'Powerhouse of the cell, produces ATP' },
      { id: 'er', name: 'Endoplasmic Reticulum', color: '#3b82f6', size: 30, description: 'Protein and lipid synthesis' },
      { id: 'golgi', name: 'Golgi Apparatus', color: '#f59e0b', size: 18, description: 'Packaging and shipping proteins' },
      { id: 'ribosome', name: 'Ribosomes', color: '#22c55e', size: 8, description: 'Protein synthesis' },
      { id: 'lysosome', name: 'Lysosome', color: '#ec4899', size: 14, description: 'Digestion and waste removal' },
      { id: 'membrane', name: 'Cell Membrane', color: '#94a3b8', size: 0, description: 'Controls what enters and exits the cell' },
    ],
  },
  {
    id: 'plant',
    name: 'Plant Cell',
    organelles: [
      { id: 'nucleus', name: 'Nucleus', color: '#8b5cf6', size: 35, description: 'Contains DNA, controls cell activities' },
      { id: 'mitochondria', name: 'Mitochondria', color: '#ef4444', size: 18, description: 'Powerhouse of the cell' },
      { id: 'chloroplast', name: 'Chloroplast', color: '#22c55e', size: 25, description: 'Photosynthesis, makes glucose' },
      { id: 'vacuole', name: 'Central Vacuole', color: '#67e8f9', size: 50, description: 'Stores water, maintains turgor pressure' },
      { id: 'cellwall', name: 'Cell Wall', color: '#a3e635', size: 0, description: 'Provides structural support' },
      { id: 'er', name: 'Endoplasmic Reticulum', color: '#3b82f6', size: 25, description: 'Protein and lipid synthesis' },
      { id: 'golgi', name: 'Golgi Apparatus', color: '#f59e0b', size: 16, description: 'Packaging and shipping proteins' },
    ],
  },
]

export const dnaBasePairs = [
  { base: 'Adenine', pair: 'Thymine', color: '#ef4444', pairColor: '#3b82f6', letter: 'A-T' },
  { base: 'Guanine', pair: 'Cytosine', color: '#22c55e', pairColor: '#f59e0b', letter: 'G-C' },
]

export const microscopeSlides = [
  { id: 'onion', name: 'Onion Epidermis', type: 'plant', magnification: '400x' },
  { id: 'blood', name: 'Blood Smear', type: 'animal', magnification: '1000x' },
  { id: 'leaf', name: 'Leaf Cross-Section', type: 'plant', magnification: '200x' },
  { id: 'bacteria', name: 'Bacteria (E. coli)', type: 'microbe', magnification: '1000x' },
]
