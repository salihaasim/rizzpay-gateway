
import { supabase } from '../config/supabase';

export interface SystemSettings {
  id?: string;
  category: 'general' | 'security' | 'payments' | 'notifications';
  key: string;
  value: any;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export class SettingsService {
  static async getSettings(category?: string) {
    let query = supabase
      .from('system_settings')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }

    return data;
  }

  static async getSetting(key: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('key', key)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error fetching setting: ${error.message}`);
    }

    return data;
  }

  static async updateSetting(key: string, value: any, description?: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value: JSON.stringify(value),
        description,
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating setting: ${error.message}`);
    }

    return data;
  }

  static async updateMultipleSettings(settings: Array<{key: string, value: any, description?: string}>) {
    const settingsData = settings.map(setting => ({
      key: setting.key,
      value: JSON.stringify(setting.value),
      description: setting.description,
      is_active: true,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('system_settings')
      .upsert(settingsData)
      .select();

    if (error) {
      throw new Error(`Error updating settings: ${error.message}`);
    }

    return data;
  }

  static async deleteSetting(key: string) {
    const { error } = await supabase
      .from('system_settings')
      .update({ is_active: false })
      .eq('key', key);

    if (error) {
      throw new Error(`Error deleting setting: ${error.message}`);
    }

    return true;
  }

  static async getGeneralSettings() {
    return this.getSettings('general');
  }

  static async getSecuritySettings() {
    return this.getSettings('security');
  }

  static async getPaymentSettings() {
    return this.getSettings('payments');
  }

  static async getNotificationSettings() {
    return this.getSettings('notifications');
  }
}
