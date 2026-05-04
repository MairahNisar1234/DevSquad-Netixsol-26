"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPdfText = extractPdfText;
async function extractPdfText(buffer) {
    console.log('--- PDF EXTRACTION START ---');
    try {
        const pdfParse = require('pdf-parse-fork');
        const data = await pdfParse(buffer);
        const extractedText = data.text?.trim() || "";
        console.log('Text length extracted:', extractedText.length);
        if (extractedText.length < 50) {
            console.warn('--- WARNING: SCANNED PDF DETECTED ---');
            return "ERROR_SCANNED_PDF: This document appears to be a scanned image or a photo. " +
                "The system requires a digital PDF (text-based) to perform analysis. " +
                "Please upload an electronic version of the statement.";
        }
        return extractedText;
    }
    catch (err) {
        console.error('--- EXTRACTION ERROR ---', err.message);
        throw new Error(`PDF Read Error: ${err.message}`);
    }
}
//# sourceMappingURL=tools.js.map