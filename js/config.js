/* =========================== STAŁE GRY =========================== */
const COLORS=[{c:'#E5484D',k:'#FFFFFF'},{c:'#2E6FE0',k:'#FFFFFF'},{c:'#F0A500',k:'#231700'},{c:'#1F9D55',k:'#FFFFFF'}];
const ELEMENTS=['Na','Fe','Au','Ne','H','He','Li','C','N','O','Mg','Al','Si','S','Cl','K','Ca','Cu','Zn','Ag','Hg','Pt','U','Ti'];
const BUZZ_KEYS=['q','p','z','m'];
const TILE_TYPES=['start','plus','quiz','plus','event','minus','plus','quiz','plus','event','plus','minus','quiz','plus','plus','event','quiz','minus','plus','quiz','plus','event','minus','plus','quiz','plus'];
const TILE_INFO={start:['St',{pl:'start',en:'start'}],plus:['+3',{pl:'atomy',en:'atoms'}],minus:['−3',{pl:'pułapka',en:'trap'}],quiz:['?',{pl:'pytanie',en:'question'}],event:['!',{pl:'zdarzenie',en:'event'}]};
const N=TILE_TYPES.length;
const FLASK_COST=20, REWARDS=[8,5,3,1];
