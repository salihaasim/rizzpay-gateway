
import { Router } from 'express';
import { validateBody } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { loginSchema, registerSchema } from '../validators/schemas';
import { AdminService } from '../services/AdminService';
import jwt from 'jsonwebtoken';

const router = Router();

// Login endpoint
router.post('/login',
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // For demo purposes - in production, implement proper password hashing
    if (email === 'admin@rizzpay.com' && password === 'rizzpay123') {
      const token = jwt.sign(
        { 
          email, 
          role: 'admin',
          id: 'admin-001'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: 'admin-001',
            email,
            role: 'admin',
            full_name: 'Admin User'
          }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  })
);

// Register endpoint
router.post('/register',
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, full_name, role = 'admin' } = req.body;
    
    try {
      const newAdmin = await AdminService.createAdmin({
        email,
        full_name,
        role,
        is_active: true
      });
      
      res.json({
        success: true,
        message: 'Admin registration successful',
        data: newAdmin
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  })
);

// Logout endpoint
router.post('/logout',
  asyncHandler(async (req, res) => {
    // In a stateless JWT system, logout is handled client-side
    // Here you could implement token blacklisting if needed
    res.json({
      success: true,
      message: 'Logout successful'
    });
  })
);

// Token refresh endpoint
router.post('/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    // Implement refresh token logic here
    res.json({
      success: true,
      message: 'Token refresh endpoint - implement refresh logic',
      data: { refreshToken }
    });
  })
);

export default router;
