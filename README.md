# Vue File Chunker

TypeScript console application that chunks Vue files for embedding models using LangChain text splitters.

## Installation

```bash
npm install
```

## Build and Run

```bash
npm run dev <directory-path>
```

This will build the project and run it in one command.

Example:
```bash
npm run dev ./my-vue-project/src
```

## Build

```bash
npm run build
```

## Usage

```bash
npm start <directory-path>
```

Example:
```bash
npm start ./my-vue-project/src/components
```

The application will:
1. Recursively scan the specified directory for `.vue` files
2. Split each file into chunks using `RecursiveCharacterTextSplitter`
3. Save results to `chunks-output.json` in the current directory

## Configuration

Default chunk settings in `src/index.ts`:
- `encodingName`: 'cl100k_base' (used by GPT-3.5/GPT-4 and most modern embedding models)
- `chunkSize`: 500 tokens (safe for most embedding models with 512-1024 token limits)
- `chunkOverlap`: 50 tokens (10% overlap for context preservation)

Uses `TokenTextSplitter` for token-based chunking, ensuring accurate token counting for embedding models.
