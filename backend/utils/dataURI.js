import DataUriParser from 'datauri/parser.js';
export const getDataUri = (file) => {
    try {
        const parser = new DataUriParser();

        // Ensure file and file.buffer exist
        if (!file || !file.buffer) {
            throw new Error('File or file.buffer is missing');
        }

        const extName = path.extname(file.originalname).toString();
        if (!extName) {
            throw new Error('File extension is missing');
        }

        // Format the data URI and return it
        const dataUri = parser.format(extName, file.buffer);
        
        // Ensure the format method provides valid content
        if (!dataUri.content) {
            throw new Error('Failed to generate data URI');
        }

        return dataUri;
    } catch (error) {
        console.error('Error in getDataUri:', error);
        throw error; // Rethrow the error to be caught by the calling function
    }
};
