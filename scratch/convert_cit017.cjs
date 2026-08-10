const fs = require('fs');
const path = require('path');

function convertCornell(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  
  const titleMatch = content.match(/^# (.*?)\n/);
  const title = titleMatch ? titleMatch[1] : 'Cornell Notes';
  
  let newContent = `# ${title}\n\n| Cue / Keywords | Notes |\n| :--- | :--- |\n`;
  
  const sections = content.split(/\n## /);
  
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n');
    const topic = lines[0].trim();
    
    const cuesIndex = section.indexOf('**Cues / Questions**');
    const notesIndex = section.indexOf('**Notes**');
    let summaryIndex = section.indexOf('### Summary');
    let dashIndex = section.indexOf('\n---');
    if (dashIndex === -1) dashIndex = Infinity;
    if (summaryIndex === -1) summaryIndex = Infinity;
    const endIndex = Math.min(dashIndex, summaryIndex);
    
    if (cuesIndex !== -1 && notesIndex !== -1) {
      let cuesStr = section.substring(cuesIndex + 20, notesIndex).trim();
      let notesStr = section.substring(notesIndex + 9, endIndex !== Infinity ? endIndex : section.length).trim();
      
      const cues = cuesStr.split('\n').map(l => l.trim()).filter(l => l).join('<br>');
      const notes = notesStr.split('\n').map(l => l.trim()).filter(l => l).join('<br>');
      
      const cueCol = `**${topic}**<br><br>${cues}`;
      const noteCol = `${notes}`;
      
      newContent += `| ${cueCol} | ${noteCol} |\n`;
    }
  }
  
  const summaryMatch = content.match(/### Summary\n([\s\S]*?)$/);
  if (summaryMatch) {
    newContent += `\n---\n\n### Summary\n${summaryMatch[1].trim()}\n`;
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Converted:', filePath);
}

const dir = '4-2026-2027-1/CIT017-information_assurance_and_security/synthesized_notes/cornell';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

for (const file of files) {
  convertCornell(path.join(dir, file));
}
