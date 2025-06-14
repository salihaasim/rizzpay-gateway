
import { supabase } from '@/integrations/supabase/client';

export interface VpaGenerationRequest {
  merchantId: string;
  businessName: string;
  merchantEmail: string;
}

export interface VpaGenerationResponse {
  vpaAddress: string;
  qrCodeUrl: string;
  status: string;
}

export class VpaManagementService {
  private static readonly VPA_DOMAIN = 'rizzpay.sbm';
  
  static async generateMerchantVpa(request: VpaGenerationRequest): Promise<VpaGenerationResponse> {
    try {
      // Generate unique VPA address
      const vpaAddress = await this.createUniqueVpa(request.merchantId, request.businessName);
      
      // Call SBM Bank API to create VPA (mock implementation for now)
      const sbmResponse = await this.callSbmVpaCreationApi(vpaAddress, request);
      
      if (sbmResponse.success) {
        // Update merchant profile with VPA details
        const { error: updateError } = await supabase
          .from('merchant_profiles')
          .update({
            merchant_vpa: vpaAddress,
            vpa_status: 'active',
            vpa_created_at: new Date().toISOString(),
            qr_code_url: sbmResponse.qrCodeUrl
          })
          .eq('id', request.merchantId);

        if (updateError) throw updateError;

        // Create VPA mapping record
        await this.createVpaMapping(request.merchantId, vpaAddress);

        return {
          vpaAddress,
          qrCodeUrl: sbmResponse.qrCodeUrl,
          status: 'active'
        };
      }
      
      throw new Error('SBM Bank VPA creation failed');
    } catch (error) {
      console.error('VPA generation error:', error);
      throw error;
    }
  }

  private static async createUniqueVpa(merchantId: string, businessName: string): Promise<string> {
    const baseVpa = this.sanitizeBusinessName(businessName);
    let vpaAddress = `${baseVpa}@${this.VPA_DOMAIN}`;
    let counter = 1;

    // Check for uniqueness
    while (await this.isVpaExists(vpaAddress)) {
      vpaAddress = `${baseVpa}${counter}@${this.VPA_DOMAIN}`;
      counter++;
    }

    return vpaAddress;
  }

  private static sanitizeBusinessName(businessName: string): string {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
  }

  private static async isVpaExists(vpaAddress: string): Promise<boolean> {
    const { data } = await supabase
      .from('vpa_mappings')
      .select('id')
      .eq('vpa_address', vpaAddress)
      .maybeSingle();
    
    return !!data;
  }

  private static async createVpaMapping(merchantId: string, vpaAddress: string) {
    const { error } = await supabase
      .from('vpa_mappings')
      .insert({
        merchant_id: merchantId,
        vpa_address: vpaAddress,
        bank_provider: 'sbm',
        status: 'active'
      });

    if (error) throw error;
  }

  private static async callSbmVpaCreationApi(vpaAddress: string, request: VpaGenerationRequest) {
    // Mock SBM Bank API call - replace with actual API integration
    console.log('Creating VPA with SBM Bank:', { vpaAddress, request });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(vpaAddress)}`,
      bankReference: `SBM_${Date.now()}`
    };
  }

  static async getMerchantVpa(merchantId: string) {
    const { data, error } = await supabase
      .from('merchant_profiles')
      .select('merchant_vpa, vpa_status, qr_code_url')
      .eq('id', merchantId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async deactivateVpa(merchantId: string) {
    const { error } = await supabase
      .from('merchant_profiles')
      .update({
        vpa_status: 'deactivated'
      })
      .eq('id', merchantId);

    if (error) throw error;

    // Also update VPA mapping
    await supabase
      .from('vpa_mappings')
      .update({
        status: 'deactivated',
        deactivated_at: new Date().toISOString()
      })
      .eq('merchant_id', merchantId);
  }
}
