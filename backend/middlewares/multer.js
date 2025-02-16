import multer from 'multer'

const storage = multer.memoryStorage()

export const singleUpload = multer({storage}).single('file')

export const multipleUpload = multer({ storage }).fields([
    { name: 'addressDocument', maxCount: 1 },
    { name: 'cnicDocument', maxCount: 1 },
    { name: 'policeDocument', maxCount: 1 },
]);