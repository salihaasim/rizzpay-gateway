
import express from 'express';
import multer from 'multer';
import {
  uploadReconciliationFile,
  getReconciliationLogs,
  getReconciliationLogDetail,
  manualOverride,
  exportReconciliationLogCsv
} from '../controllers/ReconciliationController';

const upload = multer({ dest: 'uploads/' }); // temp dir for upload

const router = express.Router();

router.post('/upload', upload.single('file'), uploadReconciliationFile);
router.get('/logs', getReconciliationLogs);
router.get('/logs/:id', getReconciliationLogDetail);
router.post('/override', manualOverride);
router.get('/export/:id', exportReconciliationLogCsv);

export default router;
