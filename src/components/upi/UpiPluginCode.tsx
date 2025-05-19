
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Check, Copy, Code as CodeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const UpiPluginCode = () => {
  const { currentMerchant } = useMerchantAuth();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  
  // Get merchant API key
  const apiKey = currentMerchant?.apiKey || 'rizz_api_key_placeholder';
  
  // Code snippets for different languages
  const codeSnippets = {
    html: `<!-- Add this HTML where you want the UPI QR button to appear -->
<button id="rizzpay-upi-button" class="rizzpay-button">
  Pay with UPI QR
</button>

<!-- Include RizzPay UPI plugin script -->
<script src="https://cdn.rizzpay.com/js/upi-plugin.js"></script>

<script>
  // Initialize RizzPay UPI QR plugin
  document.addEventListener('DOMContentLoaded', function() {
    const rizzpayUPI = new RizzPayUPI({
      apiKey: '${apiKey}',
      merchantName: '${currentMerchant?.fullName || "Your Business Name"}',
      buttonId: 'rizzpay-upi-button',
      onSuccess: function(transactionId) {
        console.log('Payment successful with ID:', transactionId);
        // Handle successful payment
      },
      onFailure: function(error) {
        console.error('Payment failed:', error);
        // Handle payment failure
      }
    });
  });
</script>`,

    react: `import React from 'react';
import { useEffect } from 'react';

const UpiPaymentButton = () => {
  useEffect(() => {
    // Load RizzPay UPI script
    const script = document.createElement('script');
    script.src = 'https://cdn.rizzpay.com/js/upi-plugin.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      // Initialize RizzPay UPI QR plugin
      window.RizzPayUPI && new window.RizzPayUPI({
        apiKey: '${apiKey}',
        merchantName: '${currentMerchant?.fullName || "Your Business Name"}',
        buttonId: 'rizzpay-upi-button',
        onSuccess: function(transactionId) {
          console.log('Payment successful with ID:', transactionId);
          // Handle successful payment
        },
        onFailure: function(error) {
          console.error('Payment failed:', error);
          // Handle payment failure
        }
      });
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button id="rizzpay-upi-button" className="your-button-class">
      Pay with UPI QR
    </button>
  );
};

export default UpiPaymentButton;`,

    javascript: `// Simple JavaScript integration (can be added to any website)

// Add this button to your HTML
// <button id="rizzpay-upi-button">Pay with UPI QR</button>

// Load RizzPay UPI script
function loadRizzPayScript() {
  const script = document.createElement('script');
  script.src = 'https://cdn.rizzpay.com/js/upi-plugin.js';
  script.async = true;
  document.body.appendChild(script);
  
  script.onload = initializeRizzPay;
}

// Initialize RizzPay UPI plugin
function initializeRizzPay() {
  if (!window.RizzPayUPI) return;
  
  new window.RizzPayUPI({
    apiKey: '${apiKey}',
    merchantName: '${currentMerchant?.fullName || "Your Business Name"}',
    buttonId: 'rizzpay-upi-button',
    onSuccess: function(transactionId) {
      console.log('Payment successful with ID:', transactionId);
      // Handle successful payment
    },
    onFailure: function(error) {
      console.error('Payment failed:', error);
      // Handle payment failure
    }
  });
}

// Load script when page loads
document.addEventListener('DOMContentLoaded', loadRizzPayScript);`,

    php: `<?php
// PHP integration example with HTML

// Your RizzPay API key should be stored in a secure environment variable
// This is just for demonstration purposes
$apiKey = '${apiKey}';
$merchantName = '${currentMerchant?.fullName || "Your Business Name"}';

// Function to generate a unique transaction ID (optional)
function generateTransactionId() {
  return 'txn_' . uniqid();
}

// You can customize this based on your application's needs
$transactionId = generateTransactionId();
$amount = isset($_POST['amount']) ? (float)$_POST['amount'] : 0;
?>

<!DOCTYPE html>
<html>
<head>
  <title>UPI Payment</title>
</head>
<body>
  <h2>Pay with UPI</h2>
  
  <?php if ($amount > 0): ?>
    <p>Amount to pay: ₹<?php echo number_format($amount, 2); ?></p>
    
    <!-- RizzPay UPI Button -->
    <button id="rizzpay-upi-button">Pay ₹<?php echo number_format($amount, 2); ?> with UPI</button>
    
    <!-- Include RizzPay UPI plugin script -->
    <script src="https://cdn.rizzpay.com/js/upi-plugin.js"></script>
    
    <script>
      // Initialize RizzPay UPI QR plugin
      document.addEventListener('DOMContentLoaded', function() {
        const rizzpayUPI = new RizzPayUPI({
          apiKey: '<?php echo $apiKey; ?>',
          merchantName: '<?php echo $merchantName; ?>',
          buttonId: 'rizzpay-upi-button',
          amount: <?php echo $amount; ?>,
          transactionId: '<?php echo $transactionId; ?>',
          onSuccess: function(transactionId) {
            console.log('Payment successful with ID:', transactionId);
            window.location.href = 'payment-success.php?id=' + transactionId;
          },
          onFailure: function(error) {
            console.error('Payment failed:', error);
            alert('Payment failed: ' + error);
          }
        });
      });
    </script>
  <?php else: ?>
    <p>Please enter an amount to pay:</p>
    <form method="post">
      <input type="number" name="amount" step="0.01" min="1" required />
      <button type="submit">Continue</button>
    </form>
  <?php endif; ?>
</body>
</html>`
  };

  const handleCopyCode = (language: string) => {
    navigator.clipboard.writeText(codeSnippets[language as keyof typeof codeSnippets]);
    setCopiedTab(language);
    toast.success(`${language.toUpperCase()} code copied to clipboard`);
    
    setTimeout(() => {
      setCopiedTab(null);
    }, 2000);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="html" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>
          </div>
          
          {Object.entries(codeSnippets).map(([language, code]) => (
            <TabsContent key={language} value={language} className="relative">
              <div className="absolute top-2 right-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopyCode(language)}
                  className="h-8 px-2"
                >
                  {copiedTab === language ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="ml-2">{copiedTab === language ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
              
              <div className="relative bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words">{code}</pre>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CodeIcon className="h-4 w-4 mt-0.5" />
                  <p>
                    To integrate the UPI payment plugin in your {language.toUpperCase()} project, copy and paste the above code. 
                    Make sure to customize the parameters according to your needs.
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UpiPluginCode;
