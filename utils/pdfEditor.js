// Generate a filename from a name (e.g., for saving files)
export function generateFilenameFromName(name) {

  const base = name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  return `${base}`;
}
// 
export function generateTitleFromName(name) {

  const cleanName = name.replace(/\.pdf$/i, '').trim();
    const words = cleanName
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  
  const limitedWords = words.slice(0, 6);
  
  let title = limitedWords.join(' ');
  
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  return title;
}

