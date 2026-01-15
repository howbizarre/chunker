import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, extname } from 'path';

interface ChunkResult {
  file: string;
  chunks: string[];
}

const CODE_EXTENSIONS = ['.vue', '.ts', '.js', '.tsx', '.jsx', '.json', '.txt', '.md', '.css', '.scss', '.html', '.yaml', '.yml', '.xml'];

async function getAllCodeFiles(dir: string): Promise<string[]> {
  const codeFiles: string[] = [];
  
  function walkDir(currentPath: string) {
    const entries = readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();

        if (CODE_EXTENSIONS.includes(ext)) {
          codeFiles.push(fullPath);
        }
      }
    }
  }
  
  walkDir(dir);
  return codeFiles;
}

const removeStyleTags = (content: string): string => content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

async function chunkCodeFiles(directory: string): Promise<ChunkResult[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const codeFiles = await getAllCodeFiles(directory);
  const results: ChunkResult[] = [];
  
  for (const file of codeFiles) {
    console.log(`Processing: ${file}`);
    let content = readFileSync(file, 'utf-8');
    
    if (file.endsWith('.vue')) {
      content = removeStyleTags(content);
    }
    
    const chunks = await splitter.splitText(content);
    
    results.push({
      file: file,
      chunks: chunks
    });
    
    console.log(`  -> Created ${chunks.length} chunks`);
  }
  
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node dist/index.js <directory>');
    process.exit(1);
  }
  
  const directory = args[0]!;
  
  if (!existsSync(directory)) {
    console.error(`Error: Directory "${directory}" does not exist`);
    process.exit(1);
  }
  
  if (!statSync(directory).isDirectory()) {
    console.error(`Error: "${directory}" is not a directory`);
    process.exit(1);
  }
  
  console.log(`Scanning directory: ${directory}`);
  
  const results = await chunkCodeFiles(directory);
  
  console.log(`\n=== Summary ===`);
  console.log(`Total files processed: ${results.length}`);
  console.log(`Total chunks created: ${results.reduce((sum, r) => sum + r.chunks.length, 0)}`);
  
  // Save results to JSON file
  const outputPath = join(process.cwd(), 'chunks-output.json');
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);
  
  // Save chunks as individual markdown files
  const chunksDir = join(process.cwd(), 'chunks-output');
  if (existsSync(chunksDir)) {
    rmSync(chunksDir, { recursive: true });
  }
  mkdirSync(chunksDir);
  
  let chunkIndex = 0;
  for (const result of results) {
    for (let i = 0; i < result.chunks.length; i++) {
      chunkIndex++;
      const fileName = `chunk-${chunkIndex.toString().padStart(5, '0')}.md`;
      const filePath = join(chunksDir, fileName);
      const content = `# Chunk ${chunkIndex}\n\n**Source File:** ${result.file}\n**Chunk Index:** ${i + 1}/${result.chunks.length}\n\n---\n\n${result.chunks[i]!}`;
      writeFileSync(filePath, content, 'utf-8');
    }
  }
  
  console.log(`Markdown chunks saved to: ${chunksDir}`);
}

main().catch(console.error);
