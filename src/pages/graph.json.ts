// @ts-nocheck
import { getCollection } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const allNotes = await getCollection('garden');
  
  const nodes: any[] = [];
  const links: any[] = [];
  const nodeIds = new Set();
  
  // First pass: Create nodes
  for (const note of allNotes) {
    const parts = note.id.split('/');
    const course = parts[0];
    const filename = parts.pop()?.replace('.md', '') || '';
    const slug = `${course}/${filename}`;
    
    nodes.push({
      id: filename,
      name: note.data.title || filename.replace(/_/g, ' '),
      val: 2,
      group: course,
      url: `/${slug}`
    });
    nodeIds.add(filename);
  }
  
  for (const note of allNotes) {
    const filename = note.id.split('/').pop()?.replace('.md', '') || '';
    const sourceId = filename;
    let body = "";
    
    try {
      const filePath = path.join(process.cwd(), '4-2026-2027-1', `${note.id}.md`);
      body = await fs.readFile(filePath, 'utf-8');
    } catch (e) {
      console.error(`Failed to read file for graph logic: ${note.id}`);
    }
    
    // Matches [[Link]] or [[Link|Alias]]
    const wikiLinkRegex = /(?<!!)\[\[(.*?)\]\]/g;
    let match;
    
    while ((match = wikiLinkRegex.exec(body)) !== null) {
      const targetStr = match[1].split('|')[0];
      let targetId = targetStr;
      let matchedNodeId = null;
      
      if (nodeIds.has(targetId)) {
        matchedNodeId = targetId;
      } else if (nodeIds.has(targetId.replace(/ /g, '_'))) {
        matchedNodeId = targetId.replace(/ /g, '_');
      } else {
        const searchId = targetId.replace(/ /g, '_').toLowerCase();
        // Ignore very short links or common words if needed, but here we just find any that includes it
        for (const nid of nodeIds) {
          if (nid.toLowerCase().includes(searchId)) {
            matchedNodeId = nid;
            break;
          }
        }
      }
      
      if (matchedNodeId) {
         links.push({
           source: sourceId,
           target: matchedNodeId
         });
      }
    }
  }
  // Implicitly connect notes of the same subject chronologically
  const courseGroups = {};
  for (const n of nodes) {
    if (!courseGroups[n.group]) courseGroups[n.group] = [];
    courseGroups[n.group].push(n.id);
  }

  for (const course in courseGroups) {
    const courseIds = courseGroups[course];
    
    // Group by lesson base name
    const lessons = {};
    for (const id of courseIds) {
      const base = id.replace(/_cornell_notes/i, '').replace(/_zettelkasten/i, '');
      if (!lessons[base]) lessons[base] = [];
      lessons[base].push(id);
    }
    
    const sortedBases = Object.keys(lessons).sort();
    
    // Connect cornell to zettelkasten within the same lesson
    for (const base of sortedBases) {
       const ids = lessons[base];
       if (ids.length > 1) {
          for (let i = 1; i < ids.length; i++) {
             links.push({ source: ids[0], target: ids[i] });
          }
       }
    }
    
    // Connect lessons chronologically
    for (let i = 0; i < sortedBases.length - 1; i++) {
       const currentIds = lessons[sortedBases[i]];
       const nextIds = lessons[sortedBases[i+1]];
       links.push({ source: currentIds[0], target: nextIds[0] });
    }
  }
  
  return new Response(JSON.stringify({ nodes, links }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
