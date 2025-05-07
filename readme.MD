# Bug Solver RAG

A Retrieval-Augmented Generation (RAG) system built with LangChain.js that helps developers solve programming bugs and errors by providing contextual solutions.

## Features

- **Semantic Bug Search**: Find solutions to programming bugs using vector embeddings
- **Hybrid Architecture**: Uses local embedding models with cloud LLMs for cost-effective performance
- **Solution Contribution**: Add your own bug/solution pairs to continuously improve the knowledge base
- **Clean UI**: User-friendly interface for submitting bugs and viewing solutions

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Vector Store**: In-memory vector storage via LangChain
- **Embeddings**: HuggingFace Transformers (runs locally)
- **LLM Provider**: Groq (Llama 3 70B model)
- **RAG Framework**: LangChain.js

## Prerequisites

- Node.js (v16 or later)
- A Groq API key (free tier available)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/bug-solver-rag.git
   cd bug-solver-rag
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3000
   ```

## Project Structure

```
bug-solver-rag/
├── index.js               # Main server file
├── initVectorStore.js     # Vector store initialization
├── utils.js               # Utility functions
├── .env                   # Environment variables
├── public/                # Frontend files
│   ├── index.html         # UI layout
│   ├── styles.css         # Styling
│   └── app.js             # Client-side JavaScript
└── bugExamples.json       # Saved bug examples (created automatically)
```

## Usage

1. Start the server:
   ```bash
   node index.js
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Enter your bug description in the "Solve Bug" tab and click "Find Solution"

4. To contribute a solution, use the "Contribute Solution" tab

## How It Works

1. **Embeddings**: When you submit a bug, it's embedded using a local HuggingFace model
2. **Retrieval**: The system finds similar bugs in its vector database
3. **Generation**: The retrieved examples and your bug are sent to Groq's LLM
4. **Response**: The LLM generates a tailored solution based on the context

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [LangChain](https://js.langchain.com/) for the RAG infrastructure
- [Groq](https://groq.com/) for the LLM API
- [HuggingFace](https://huggingface.co/) for the embedding models