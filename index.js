// index.js - Main server file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initVectorStore } = require('./initVectorStore');
const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { createStuffDocumentsChain } = require('langchain/chains/combine_documents');
const { createRetrievalChain } = require('langchain/chains/retrieval');
const { saveBugExample } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let vectorStore;
let retrievalChain;

// Initialize the RAG system
async function initializeRAG() {
  try {
    // Initialize vector store with HuggingFace embeddings (handled in initVectorStore.js)
    console.log("Initializing vector store with HuggingFace embeddings...");
    vectorStore = await initVectorStore();
    
    // Initialize Groq LLM (we'll still use Groq for the LLM part)
    console.log("Initializing Groq LLM...");
    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY, 
      model: "llama3-70b-8192" // Using Llama 3 70B model (free on Groq)
    });
    
    // Create prompt template for the RAG system
    const prompt = PromptTemplate.fromTemplate(`
      You are an expert programmer and debugger. Your task is to help solve programming bugs.
      
      Here are some similar bugs and their solutions that might help:
      
      {context}
      
      Now, please help solve this bug:
      {input}
      
      Provide a clear, step-by-step solution, with explanations and code examples when appropriate.
      Focus on practical solutions and diagnosis steps.
    `);
    
    // Create document chain
    console.log("Creating document chain...");
    const documentChain = await createStuffDocumentsChain({
      llm,
      prompt,
      outputParser: new StringOutputParser()
    });
    
    // Create retriever from vector store
    console.log("Setting up retriever...");
    const retriever = vectorStore.asRetriever({
      k: 3 // Fetch 3 most relevant documents
    });
    
    // Create retrieval chain
    console.log("Creating retrieval chain...");
    retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain: documentChain
    });
    
    console.log("RAG system initialized successfully!");
    console.log("- Using HuggingFace embeddings for vector search");
    console.log("- Using Groq LLM (Llama 3 70B) for generating solutions");
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

// API Routes
app.post('/api/solve-bug', async (req, res) => {
  try {
    const { bugDescription } = req.body;
    
    if (!bugDescription) {
      return res.status(400).json({ error: "Bug description is required" });
    }
    
    console.log(`Processing bug: "${bugDescription.substring(0, 50)}..."`);
    
    // Query the RAG chain
    const response = await retrievalChain.invoke({
      input: bugDescription
    });
    
    console.log("Solution generated successfully");
    res.json({ solution: response.answer });
  } catch (error) {
    console.error("Error solving bug:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

// Route to save a new bug example
app.post('/api/save-example', async (req, res) => {
  try {
    const { bug, solution } = req.body;
    
    if (!bug || !solution) {
      return res.status(400).json({ error: "Bug and solution are required" });
    }
    
    console.log(`Saving new bug example: "${bug.substring(0, 30)}..."`);
    
    // Save to file
    const saved = saveBugExample(bug, solution);
    
    if (saved) {
      // Update vector store with new example
      const doc = [{
        pageContent: `Bug: ${bug}\nSolution: ${solution}`,
        metadata: { source: "user-contribution" }
      }];
      
      await vectorStore.addDocuments(doc);
      console.log("Example saved and added to vector store");
      
      res.json({ success: true, message: "Bug example saved successfully" });
    } else {
      res.status(500).json({ error: "Failed to save bug example" });
    }
  } catch (error) {
    console.error("Error saving bug example:", error);
    res.status(500).json({ error: "Failed to save bug example" });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeRAG();
});