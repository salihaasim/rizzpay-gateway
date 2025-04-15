
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface KycData {
  aadhaarCard: string | null;
  panCard: string | null;
  gstCertificate: string | null;
  gstNumber: string | null;
}

export interface Merchant {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  createdAt: string;
  kycStatus?: 'pending' | 'approved' | 'rejected';
  kycData?: KycData;
}

interface ProfileState {
  merchants: Merchant[];
  addMerchant: (merchant: Merchant) => void;
  updateMerchantKycStatus: (merchantId: string, status: 'approved' | 'rejected') => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set) => ({
      merchants: [
        {
          id: '1',
          name: 'Merchant 1',
          email: 'merchant1@example.com',
          company: 'Company 1',
          phone: '+91 9876543210',
          createdAt: '2025-01-01T00:00:00Z',
          kycStatus: 'pending',
          kycData: {
            aadhaarCard: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            panCard: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            gstCertificate: null,
            gstNumber: 'GST123456789'
          }
        },
        {
          id: '2',
          name: 'Merchant 2',
          email: 'merchant2@example.com',
          company: 'Company 2',
          phone: '+91 9876543211',
          createdAt: '2025-01-02T00:00:00Z',
          kycStatus: 'approved',
          kycData: {
            aadhaarCard: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            panCard: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            gstCertificate: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            gstNumber: 'GST987654321'
          }
        },
        {
          id: '3',
          name: 'Merchant 3',
          email: 'merchant3@example.com',
          company: 'Company 3',
          phone: '+91 9876543212',
          createdAt: '2025-01-03T00:00:00Z',
          kycStatus: 'rejected',
          kycData: {
            aadhaarCard: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            panCard: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEWzs7P94mLeAAAAH0lEQVRoge3BAQ0AAADCIPunNsc3YAAAAAAAAAAAADwDKmAAAU6KJzUAAAAASUVORK5CYII=',
            gstCertificate: null,
            gstNumber: null
          }
        },
        {
          id: '4',
          name: 'Merchant 4',
          email: 'merchant4@example.com',
          company: 'Company 4',
          phone: '+91 9876543213',
          createdAt: '2025-01-04T00:00:00Z'
        }
      ],
      
      addMerchant: (merchant) => {
        set((state) => ({
          merchants: [...state.merchants, merchant]
        }));
      },
      
      updateMerchantKycStatus: (merchantId, status) => {
        set((state) => ({
          merchants: state.merchants.map(merchant => 
            merchant.id === merchantId 
              ? { ...merchant, kycStatus: status } 
              : merchant
          )
        }));
      }
    }),
    { name: 'profile-store' }
  )
);
