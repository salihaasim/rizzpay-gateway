
import { supabase } from '../config/supabase';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  permissions?: any;
  department?: string;
}

export class AdminService {
  static async listAdmins(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Error fetching admins: ${error.message}`);
    }

    return {
      admins: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  static async createAdmin(adminData: Omit<AdminUser, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('admin_users')
      .insert(adminData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }

    return data;
  }

  static async getAdminById(adminId: string) {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error) {
      throw new Error(`Error fetching admin: ${error.message}`);
    }

    return data;
  }

  static async updateAdmin(adminId: string, updates: Partial<AdminUser>) {
    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', adminId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating admin: ${error.message}`);
    }

    return data;
  }

  static async deactivateAdmin(adminId: string) {
    return this.updateAdmin(adminId, { is_active: false });
  }

  static async getAdminActivity(adminId?: string, limit: number = 50) {
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (adminId) {
      query = query.eq('user_id', adminId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching admin activity: ${error.message}`);
    }

    return data;
  }
}
