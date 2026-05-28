# RAG-Based Document Assistant

## Objective
A full-stack mini-project to build a Retrieval-Augmented Generation (RAG) system where users can upload documents (PDF/TXT) and ask questions. An LLM answers the questions based strictly on the uploaded content.

## Features
- Clean modern UI using Tailwind CSS
- Upload PDF or TXT documents
- Ask questions and receive AI-generated answers based on the document
- View exact source chunks retrieved from the document for transparency
- Error handling for missing files, unsupported types, and API errors
- Local JSON vector store for simplicity

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express.js, Multer
- **Parsing**: pdf-parse
- **AI**: @google/generative-ai (Gemini API for embeddings and answers)
- **Storage**: Local JSON/in-memory vector store

## Architecture Overview
1. **Upload Flow**: 
   User uploads a file -> Server extracts text -> Text is split into chunks -> Embeddings are generated using Gemini `text-embedding-004` -> Stored in local `vectorStore.json`.
2. **Query Flow**:
   User asks a question -> Server embeds the question -> Compares with stored chunk embeddings via Cosine Similarity -> Top 3 chunks are retrieved -> Sent to Gemini `gemini-1.5-flash` with a strict prompt to only use the provided context -> Answer is returned to user.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A Gemini API Key from Google AI Studio

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/nitin-999-code/lemon-tree.git
   cd lemon-tree
   ```

2. **Configure Environment Variables**:
   Copy the example environment file and add your API key:
   ```bash
   cp .env.example .env
   # Open .env and add your GEMINI_API_KEY
   ```

3. **Setup Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Setup Frontend** (in a new terminal):
   ```bash
   cd client
   npm install
   npm run dev
   ```

## API Documentation

### `POST /api/upload`
- **Description**: Uploads a document, extracts text, chunks it, embeds it, and stores it in the local vector store.
- **Body**: `multipart/form-data` with key `document` containing the PDF/TXT file.
- **Response**: `{ message: string, chunksCreated: number, fileName: string }`

### `POST /api/ask`
- **Description**: Accepts a question, finds the most relevant chunks, and returns an AI-generated answer.
- **Body**: JSON `{ "question": string }`
- **Response**: `{ answer: string, sources: Array<{ id, fileName, chunkText, similarity }> }`

## Design Decisions
- **AI Choice**: Used Google's Gemini API (@google/generative-ai) as it provides generous free tiers for embeddings and LLM generation, ideal for a mini-project.
- **Local Storage**: Used a local JSON file (`data/vectorStore.json`) instead of a full vector database (like Pinecone) to keep the project lightweight and simple as requested.
- **Chunking Strategy**: Hardcoded to roughly 500 words with a 50-word overlap. This provides a balance between context size and precise retrieval.

## Assumptions
- Each new document upload overrides the context (or appends to it depending on the user's intent; currently implemented as appending for simplicity).
- The user has an active internet connection to reach the Gemini API.
- Only text-based PDFs and TXT files are supported (no OCR for image-based PDFs).

## Future Improvements
- Implement a real Vector Database (Pinecone, Weaviate, or pgvector).
- Add OCR for scanned PDFs.
- Add user sessions so different users have their own document contexts.
- Provide conversation history for follow-up questions.

## Screenshots
*(Add screenshots of the UI here)*
