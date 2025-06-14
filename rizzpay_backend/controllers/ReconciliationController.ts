
import { Request, Response } from 'express';
import { ReconciliationService } from '../services/ReconciliationService';
import path from 'path';
import fs from 'fs';

export const uploadReconciliationFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const adminId = req.body.admin_id;
    if (!file || !adminId) {
      return res.status(400).json({ error: 'Missing file or admin_id' });
    }
    const result = await ReconciliationService.processReconciliationFile(
      file.path,
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

// List logs (paginated)
export const getReconciliationLogs = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await ReconciliationService.listLogs(page, limit);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Single log detail
export const getReconciliationLogDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const detail = await ReconciliationService.getLogDetail(id);
    if (!detail) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(detail);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Manual override (force match/unmatch in log)
export const manualOverride = async (req: Request, res: Response) => {
  try {
    const { log_id, entry_index, payout_id, override_status, notes } = req.body;
    if (!log_id || entry_index === undefined || !override_status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await ReconciliationService.manualOverride(
      log_id, entry_index, payout_id, override_status, notes
    );
    res.json({ message: 'Manual override applied', ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Export reconciliation CSV summary
export const exportReconciliationLogCsv = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const csv = await ReconciliationService.exportLogToCsv(id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=reconciliation-${id}.csv`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
