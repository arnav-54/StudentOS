import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure standard font / worker fallback
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  // Use worker from unpkg or disable worker via fakeWorker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Robust Client-Side PDF Text Extractor
 * Extracts readable Unicode text from all pages of any uploaded PDF file.
 * Returns clean plain text formatted into sections.
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      let pageStr = '';

      for (const item of textContent.items) {
        if (!item.str) continue;
        
        // Detect new lines based on vertical transform coordinate
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 8) {
          pageStr += '\n';
        } else if (pageStr.length > 0 && !pageStr.endsWith(' ') && !pageStr.endsWith('\n')) {
          pageStr += ' ';
        }

        pageStr += item.str;
        lastY = item.transform[5];
      }

      fullText += pageStr + '\n\n';
    }

    const cleaned = fullText
      .replace(/\r/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim();

    if (cleaned.length > 50) {
      return cleaned;
    }
  } catch (err) {
    console.warn('PDF.js client parser notice:', err);
  }

  // Secondary stream-based fallback for text-based PDFs if PDF.js fails
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        // Extract readable strings inside parentheses or standard BT/ET text chunks
        const matches = text.match(/\(([^()]{2,})\)/g) || [];
        const extracted = matches
          .map(m => m.slice(1, -1))
          .filter(s => /[a-zA-Z0-9]/.test(s) && !/^[0-9\s]+$/.test(s) && s.length > 2)
          .join(' ')
          .replace(/\\([()\\])/g, '$1')
          .replace(/\s+/g, ' ')
          .trim();

        if (extracted.length > 100) {
          resolve(extracted);
        } else {
          reject(new Error('Could not extract readable text from PDF.'));
        }
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error('FileReader error.'));
    reader.readAsText(file);
  });
}
