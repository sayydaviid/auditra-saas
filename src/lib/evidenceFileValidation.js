export const MAX_EVIDENCE_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_EVIDENCE_FILE_TYPES = {
  '.pdf': ['application/pdf'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.xls': ['application/vnd.ms-excel'],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.csv': ['text/csv', 'application/csv', 'application/vnd.ms-excel'],
  '.txt': ['text/plain']
};

export const EVIDENCE_FILE_ACCEPT = Object.entries(ALLOWED_EVIDENCE_FILE_TYPES)
  .flatMap(([extension, mimeTypes]) => [extension, ...mimeTypes])
  .join(',');

export function getFileExtension(fileName = '') {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex < 0) return '';
  return fileName.slice(lastDotIndex).toLowerCase();
}

export function validateEvidenceFile(file) {
  if (!file) {
    return { valid: false, code: 'file/missing', message: 'Selecione um arquivo para enviar.' };
  }

  if (file.size > MAX_EVIDENCE_FILE_SIZE) {
    return { valid: false, code: 'file/too-large', message: 'O arquivo deve ter no máximo 10 MB.' };
  }

  const extension = getFileExtension(file.name);
  const allowedMimeTypes = ALLOWED_EVIDENCE_FILE_TYPES[extension];
  const mimeType = (file.type || '').toLowerCase();

  if (!allowedMimeTypes || !allowedMimeTypes.includes(mimeType)) {
    return { valid: false, code: 'file/invalid-format', message: 'Formato de arquivo não permitido.' };
  }

  return { valid: true, code: null, message: '' };
}
