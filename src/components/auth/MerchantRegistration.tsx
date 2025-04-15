
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useTransactionStore } from '@/stores/transactionStore';
import KycDocumentUpload, { KycDocuments } from '@/components/kyc/KycDocumentUpload';

// Validation schema for merchant registration
const merchantSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }).optional(),
  businessName: z.string().min(2, { message: "Business name is required" }),
  businessType: z.string().min(2, { message: "Business type is required" }).optional(),
  gstNumber: z.string().optional()
});

type MerchantFormValues = z.infer<typeof merchantSchema>;

const MerchantRegistration = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUserRole, initializeWallet } = useTransactionStore();
  const [kycDocuments, setKycDocuments] = useState<KycDocuments>({
    aadhaarCard: null,
    panCard: null,
    gstCertificate: null
  });

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      businessName: "",
      businessType: "",
      gstNumber: ""
    },
  });

  const handleKycDocumentsChange = (documents: KycDocuments) => {
    setKycDocuments(documents);
  };

  const handleKycValidation = (): boolean => {
    // Check for required KYC documents
    if (!kycDocuments.aadhaarCard || !kycDocuments.panCard) {
      toast({
        title: "KYC documents required",
        description: "Please upload both Aadhaar Card and PAN Card documents",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit = async (data: MerchantFormValues) => {
    // Validate KYC documents first
    if (!handleKycValidation()) return;
    
    setLoading(true);
    
    try {
      // Convert files to base64 strings for storage
      const kycData = {
        aadhaarCard: kycDocuments.aadhaarCard ? await convertFileToBase64(kycDocuments.aadhaarCard) : null,
        panCard: kycDocuments.panCard ? await convertFileToBase64(kycDocuments.panCard) : null,
        gstCertificate: kycDocuments.gstCertificate ? await convertFileToBase64(kycDocuments.gstCertificate) : null,
        gstNumber: data.gstNumber || null
      };

      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase().auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        toast({
          title: "Registration failed",
          description: authError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!authData.user?.id) {
        toast({
          title: "Registration failed",
          description: "Failed to create user account",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 2. Create the merchant record in the merchants table with KYC data
      const { error: merchantError } = await supabase()
        .from('merchants')
        .insert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          business_name: data.businessName,
          business_type: data.businessType || null,
          kyc_data: kycData,
          kyc_status: 'pending'
        });

      if (merchantError) {
        toast({
          title: "Registration partially failed",
          description: "Your account was created but merchant details could not be saved. Please contact support.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 3. Set user role and initialize wallet
      setUserRole('merchant', data.email);
      initializeWallet(data.email);

      toast({
        title: "Registration successful",
        description: "Your merchant account has been created! KYC verification is pending.",
      });

      // 4. Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Business LLC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Input placeholder="Retail, Restaurant, Service..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number <span className="text-muted-foreground text-sm">(if applicable)</span></FormLabel>
              <FormControl>
                <Input placeholder="22AAAAA0000A1Z5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* KYC Document Upload Component */}
        <KycDocumentUpload onDocumentsChange={handleKycDocumentsChange} />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register Merchant Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default MerchantRegistration;
