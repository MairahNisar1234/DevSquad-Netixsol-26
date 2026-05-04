import { createWorker } from 'tesseract.js';
import * as pdfjs from 'pdfjs-dist';

export async function extractPdfText(buffer: Buffer): Promise<string> {
  console.log('--- PDF EXTRACTION START ---');
  
  try {
    const pdfParse = require('pdf-parse-fork');
    
    // We try to parse the text layer
    const data = await pdfParse(buffer);
    const extractedText = data.text?.trim() || "";
    
    console.log('Text length extracted:', extractedText.length);

    // If the text is empty, it's a scanned PDF
    if (extractedText.length < 50) {
      console.warn('--- WARNING: SCANNED PDF DETECTED ---');
      // Instead of crashing the server with OCR, we return a clear message
      // This allows the AI to tell the user what the problem is.
      return "ERROR_SCANNED_PDF: This document appears to be a scanned image or a photo. " +
             "The system requires a digital PDF (text-based) to perform analysis. " +
             "Please upload an electronic version of the statement.";
    }

    return extractedText;

  } catch (err: any) {
    console.error('--- EXTRACTION ERROR ---', err.message);
    throw new Error(`PDF Read Error: ${err.message}`);
  }
}