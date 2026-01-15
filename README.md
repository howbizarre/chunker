# Vue File Chunker / Чънкер за Vue Файлове

[English](#english) | [Български](#bulgarian)

---

## English

TypeScript console application that intelligently chunks code files for embedding models using LangChain text splitters.

### Features

- **Recursive Directory Scanning**: Processes all code files in a directory and its subdirectories
- **Multi-Format Support**: Handles `.vue`, `.ts`, `.js`, `.tsx`, `.jsx`, `.json`, `.txt`, `.md`, `.css`, `.scss`, `.html`, `.yaml`, `.yml`, `.xml`
- **Smart Vue Processing**: Automatically removes `<style>` tags from Vue files before chunking
- **Token-Based Splitting**: Uses `TokenTextSplitter` with `cl100k_base` encoding for accurate token counting
- **Dual Output**: Generates both JSON and individual markdown files for each chunk

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Usage

**Build and Run (Recommended):**
```bash
npm run dev <directory-path>
```

**Run Only:**
```bash
npm start <directory-path>
```

**Example:**
```bash
npm run dev ./my-vue-project/src
```

### Output

The application generates two outputs:

1. **chunks-output.json** - Complete JSON file with all chunks and metadata
2. **chunks-output/** - Directory containing individual markdown files:
   - `chunk-00001.md`, `chunk-00002.md`, etc.
   - Each file includes source file path, chunk index, and content

### Configuration

Default chunk settings in `src/index.ts`:
- **encodingName**: `cl100k_base` (used by GPT-3.5/GPT-4 and modern embedding models)
- **chunkSize**: 500 tokens (safe for most embedding models with 512-1024 token limits)
- **chunkOverlap**: 50 tokens (10% overlap for context preservation)

### Code Chunking Best Practices

#### Why Token-Based Chunking?

- **Accurate Token Counting**: Matches how embedding models process text
- **Consistent Sizing**: Ensures chunks fit within model token limits
- **Better Embeddings**: Prevents truncation and improves semantic quality

#### Recommended Chunk Sizes by Model

| Embedding Model | Max Tokens | Recommended Chunk Size |
|----------------|-----------|----------------------|
| OpenAI text-embedding-ada-002 | 8191 | 500-1000 |
| OpenAI text-embedding-3-small | 8191 | 500-1000 |
| OpenAI text-embedding-3-large | 8191 | 500-1000 |
| Cohere embed-english-v3.0 | 512 | 400-500 |
| Sentence Transformers | 512 | 400-500 |

#### Overlap Guidelines

- **10-15% overlap** preserves context between chunks
- **50-100 token overlap** works well for most code
- **Too much overlap** increases storage and processing costs
- **Too little overlap** may lose important context at boundaries

#### Code-Specific Considerations

- **Preserve Function Boundaries**: Avoid splitting functions mid-definition
- **Keep Related Code Together**: Classes, methods, and their documentation
- **Remove Non-Code Elements**: Style tags, large comments, generated code
- **Maintain Context**: Include imports and type definitions when relevant

### Why Remove Style Tags?

Vue component styles are typically:
- Not relevant for code understanding
- Can be large and repetitive
- Better handled separately in CSS/SCSS chunking
- Reduce noise in embeddings focused on logic and structure

---

## Bulgarian

TypeScript конзолно приложение, което интелигентно чънква кодови файлове за embedding модели, използвайки LangChain text splitters.

### Функционалности

- **Рекурсивно Сканиране**: Обработва всички кодови файлове в директория и нейните поддиректории
- **Мулти-Формат Поддръжка**: Поддържа `.vue`, `.ts`, `.js`, `.tsx`, `.jsx`, `.json`, `.txt`, `.md`, `.css`, `.scss`, `.html`, `.yaml`, `.yml`, `.xml`
- **Интелигентна Vue Обработка**: Автоматично премахва `<style>` тагове от Vue файлове преди чънкване
- **Токен-Базирано Разделяне**: Използва `TokenTextSplitter` с `cl100k_base` encoding за точно броене на токени
- **Двоен Изход**: Генерира както JSON, така и отделни markdown файлове за всеки чънк

### Инсталация

```bash
npm install
```

### Билд

```bash
npm run build
```

### Употреба

**Билд и Стартиране (Препоръчително):**
```bash
npm run dev <път-до-директория>
```

**Само Стартиране:**
```bash
npm start <път-до-директория>
```

**Пример:**
```bash
npm run dev ./my-vue-project/src
```

### Изход

Приложението генерира два изхода:

1. **chunks-output.json** - Пълен JSON файл с всички чънкове и метаданни
2. **chunks-output/** - Директория съдържаща отделни markdown файлове:
   - `chunk-00001.md`, `chunk-00002.md`, и т.н.
   - Всеки файл включва път до източник, индекс на чънка и съдържание

### Конфигурация

Настройки по подразбиране в `src/index.ts`:
- **encodingName**: `cl100k_base` (използва се от GPT-3.5/GPT-4 и съвременни embedding модели)
- **chunkSize**: 500 токена (безопасно за повечето embedding модели с лимит 512-1024 токена)
- **chunkOverlap**: 50 токена (10% припокриване за запазване на контекст)

### Добри Практики за Чънкване на Код

#### Защо Токен-Базирано Чънкване?

- **Точно Броене на Токени**: Съвпада с начина, по който embedding моделите обработват текст
- **Консистентен Размер**: Гарантира, че чънковете се вместват в токен лимитите на модела
- **По-Добри Embeddings**: Предотвратява отрязване и подобрява семантичното качество

#### Препоръчителни Размери на Чънкове по Модел

| Embedding Модел | Макс Токени | Препоръчителен Размер |
|-----------------|-------------|---------------------|
| OpenAI text-embedding-ada-002 | 8191 | 500-1000 |
| OpenAI text-embedding-3-small | 8191 | 500-1000 |
| OpenAI text-embedding-3-large | 8191 | 500-1000 |
| Cohere embed-english-v3.0 | 512 | 400-500 |
| Sentence Transformers | 512 | 400-500 |

#### Насоки за Припокриване

- **10-15% припокриване** запазва контекст между чънковете
- **50-100 токена припокриване** работи добре за повечето код
- **Твърде много припокриване** увеличава разходите за съхранение и обработка
- **Твърде малко припокриване** може да загуби важен контекст на границите

#### Специфични Съображения за Код

- **Запазване на Функционални Граници**: Избягвайте разделяне на функции по средата
- **Групиране на Свързан Код**: Класове, методи и тяхната документация
- **Премахване на Не-Код Елементи**: Style тагове, големи коментари, генериран код
- **Поддържане на Контекст**: Включване на imports и type дефиниции когато е необходимо

### Защо да Премахваме Style Тагове?

Vue компонент стиловете обикновено:
- Не са релевантни за разбиране на кода
- Могат да бъдат големи и повтарящи се
- По-добре се обработват отделно при CSS/SCSS чънкване
- Намаляват шума в embeddings фокусирани върху логика и структура

---

## License / Лиценз

ISC
