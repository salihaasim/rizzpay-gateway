
import express from 'express';
import multer from 'multer';
import { uploadReconciliationFile } from '../controllers/ReconciliationController';

const upload = multer({ dest: 'uploads/' }); // temp dir for upload

const router = express.Router();

router.post('/upload', upload.single('file'), uploadReconciliationFile);

export default router;
