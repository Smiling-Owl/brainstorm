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
  
  return new Response(JSON.stringify({ nodes, links }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
