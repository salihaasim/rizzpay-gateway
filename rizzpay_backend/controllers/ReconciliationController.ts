
import { Request, Response } from 'express';
import { ReconciliationService } from '../services/ReconciliationService';
import path from 'path';
import fs from 'fs';

export const uploadReconciliationFile = async (req: Request, res: Response) => {
  try {
    // Retrieve uploaded file and admin ID
    const file = req.file;
    const adminId = req.body.admin_id;

    if (!file || !adminId) {
      return res.status(400).json({ error: 'Missing file or admin_id' });
    }
    const filePath = file.path;
    const result = await ReconciliationService.processReconciliationFile(
      filePath,
      adminId,
      file.originalname
    );
    res.json({
      message: 'Reconciliation processed',
      ...result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
