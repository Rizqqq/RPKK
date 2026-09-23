import mammoth from 'mammoth';
import { ChatAttachment } from '../types/roleplay';

/**
 * Reads a File as base64 Data URL
 */
export async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file as data URL'));
    reader.readAsDataURL(file);
  });
}

/**
 * Reads a File as UTF-8 Text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

/**
 * Reads a Word document (.docx) and extracts clean raw text
 */
export async function extractDocxText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || '';
}

/**
 * Process any uploaded file (Image, PDF, Word, TXT, Markdown) into a ChatAttachment
 */
export async function processUploadedFile(file: File): Promise<ChatAttachment> {
  const isImage = file.type.startsWith('image/');
  const fileName = file.name;
  const lowerName = fileName.toLowerCase();

  const dataUrl = await readFileAsDataUrl(file);

  if (isImage) {
    return {
      id: `att-img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: fileName,
      type: 'image',
      mimeType: file.type || 'image/png',
      dataUrl,
      size: file.size,
      isCharacterLook: true, // Default to true so AI will describe character appearance
    };
  }

  // Document file handling
  let textContent: string | undefined = undefined;

  if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
    try {
      textContent = await extractDocxText(file);
    } catch (err) {
      console.warn('Docx extraction warning, fallback to raw info', err);
      textContent = `[Uploaded Word Document: ${fileName}]`;
    }
  } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md') || file.type.includes('text/')) {
    textContent = await readFileAsText(file);
  } else if (file.type === 'application/pdf' || lowerName.endsWith('.pdf')) {
    // For PDF, Gemini 3.8 Flash accepts application/pdf base64 natively in inlineData
    textContent = `[PDF Document Attached: "${fileName}" - Reference for fanfic lore, character data, and world canon]`;
  }

  return {
    id: `att-doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: fileName,
    type: 'document',
    mimeType: file.type || (lowerName.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
    dataUrl,
    textContent,
    size: file.size,
  };
}
