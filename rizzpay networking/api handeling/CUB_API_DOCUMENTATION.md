# CUB API Integration Documentation

## Request Formatting

### JSON Body Structure
All requests must be sent in the exact format CUB specifies:

```json
{
  "from_account": "string",
  "to_account": "string", 
  "txn_amount": "decimal(2)",
  "trace_id": "string",
  "session_id": "string",
  "beneficiary_name": "string",
  "ifsc_code": "string",
  "txn_type": "NEFT/RTGS/IMPS",
  "remarks": "string"
}
```

### Mandatory Fields Validation
- **from_account**: Validate account number length (9-18 digits)
- **to_account**: Validate beneficiary account format
- **txn_amount**: Always 2 decimal precision (e.g., "1000.00")
- **trace_id**: Unique per transaction (UUID format)
- **session_id**: Unique per API call
- **ifsc_code**: Valid 11-character IFSC format

### Data Validation Rules
```javascript
const validatePayoutData = (data) => {
  // Account number validation
  if (!/^\d{9,18}$/.test(data.to_account)) {
    throw new Error("Invalid account number format");
  }
  
  // Amount validation (2 decimals)
  if (!/^\d+\.\d{2}$/.test(data.txn_amount.toString())) {
    throw new Error("Amount must have exactly 2 decimal places");
  }
  
  // IFSC validation
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc_code)) {
    throw new Error("Invalid IFSC code format");
  }
};
```

## Authentication

### Header Requirements
```javascript
const headers = {
  'Content-Type': 'application/json',
  'X-IBM-Client-Id': process.env.CUB_CLIENT_ID,
  'X-IBM-Client-Secret': process.env.CUB_CLIENT_SECRET,
  'Authorization': 'Bearer ' + access_token
};
```

### Secret Management
- Store credentials in AWS Secrets Manager
- Never hardcode in application code
- Implement automatic secret rotation
- Use IAM roles for access control

### Authentication Flow
1. Retrieve secrets from AWS Secrets Manager
2. Generate access token if required
3. Include in API headers
4. Handle token expiry and refresh

## Idempotency & Uniqueness

### ID Generation Strategy
```javascript
import { v4 as uuidv4 } from 'uuid';

const generateTransactionIds = () => {
  return {
    trace_id: uuidv4(), // Unique per transaction
    session_id: uuidv4() // Unique per API call
  };
};

// For retries - reuse same IDs
const retryTransaction = (originalTraceId, originalSessionId) => {
  return {
    trace_id: originalTraceId, // Same trace_id
    session_id: uuidv4() // New session_id for retry
  };
};
```

### Duplicate Prevention
- Store trace_id in database before API call
- Check for existing trace_id before new transactions
- Implement database constraints for uniqueness

## Response Handling

### Response Types
```javascript
const handleApiResponse = (response) => {
  const { status, data } = response;
  
  if (status === 200) {
    if (data.success === true) {
      // ✅ Success - update DB
      return {
        status: 'SUCCESS',
        utr_number: data.utr_number,
        bank_ref_id: data.bank_reference_id
      };
    } else {
      // ❌ Business failure
      return {
        status: 'FAILED',
        reason: data.failure_reason,
        error_code: data.error_code
      };
    }
  }
  
  // Handle HTTP errors
  if (status >= 500) {
    // 🔄 Retry needed
    return {
      status: 'RETRY',
      error: 'Server error'
    };
  }
};
```

### Critical Data Storage
- **utr_number**: Store immediately - critical for tracking
- **bank_reference_id**: Required for reconciliation
- **status_code**: For debugging and analysis
- **response_message**: Full context for issues

## Error & Retry Logic

### Retry Strategy
```javascript
const retryWithBackoff = async (apiCall, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        // Send to dead letter queue
        await sendToDeadLetterQueue(error);
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### Error Categories
1. **Network Errors**: Timeout, connection refused → Retry
2. **Server Errors (5xx)**: Internal server error → Retry
3. **Client Errors (4xx)**: Invalid data → Don't retry, log
4. **Business Errors**: Invalid account → Don't retry, mark failed

### Dead Letter Queue
- Use AWS SQS for failed transactions
- Manual review process for DLQ items
- Alerting for DLQ threshold breaches

## Security & Compliance

### Logging Strategy
```javascript
const logTransaction = (request, response, maskSensitive = true) => {
  const logData = {
    timestamp: new Date().toISOString(),
    trace_id: request.trace_id,
    session_id: request.session_id,
    request: maskSensitive ? maskSensitiveData(request) : request,
    response: maskSensitive ? maskSensitiveData(response) : response,
    status: response.status
  };
  
  // Store in CloudWatch
  console.log(JSON.stringify(logData));
  
  // Store full data in encrypted S3
  await storeInSecureS3(logData);
};

const maskSensitiveData = (data) => {
  return {
    ...data,
    from_account: data.from_account?.replace(/\d(?=\d{4})/g, 'X'),
    to_account: data.to_account?.replace(/\d(?=\d{4})/g, 'X'),
    client_secret: '[MASKED]'
  };
};
```

### Audit Trail
- Enable AWS CloudTrail for all API calls
- Store encrypted logs in S3 with lifecycle policies
- Implement log integrity verification

## Reconciliation

### Daily Reconciliation Process
```javascript
const dailyReconciliation = async (date) => {
  // 1. Fetch RizzPay transactions for the date
  const rizzpayTxns = await getRizzpayTransactions(date);
  
  // 2. Fetch CUB MIS/Settlement report
  const cubReport = await fetchCubMisReport(date);
  
  // 3. Compare and identify mismatches
  const mismatches = compareTxnRecords(rizzpayTxns, cubReport);
  
  // 4. Mark mismatched transactions for review
  await markForManualReview(mismatches);
  
  // 5. Generate reconciliation summary
  await generateReconciliationReport(date, mismatches);
};
```

### Reconciliation Fields
- **UTR Number**: Primary matching field
- **Amount**: Must match exactly
- **Transaction Date**: Date comparison
- **Status**: Success/Failure status match

## Monitoring

### CloudWatch Metrics
```javascript
const publishMetrics = async (metricData) => {
  const params = {
    Namespace: 'RizzPay/CUB/API',
    MetricData: [
      {
        MetricName: 'ResponseTime',
        Value: metricData.responseTime,
        Unit: 'Milliseconds'
      },
      {
        MetricName: 'SuccessRate',
        Value: metricData.successRate,
        Unit: 'Percent'
      },
      {
        MetricName: 'ErrorRate',
        Value: metricData.errorRate,
        Unit: 'Percent'
      }
    ]
  };
  
  await cloudWatch.putMetricData(params).promise();
};
```

### Alert Thresholds
- **Success Rate**: Alert if < 95%
- **Response Time**: Alert if > 5 seconds
- **Error Rate**: Alert if > 5%
- **Dead Letter Queue**: Alert if > 10 items

## Quick Implementation Checklist

✅ **Send properly formatted JSON with unique IDs**
- Validate all mandatory fields
- Generate unique trace_id and session_id
- Format amounts with 2 decimals

✅ **Store every response securely** 
- Log to CloudWatch (masked)
- Store full data in encrypted S3
- Capture UTR numbers immediately

✅ **Retry smartly**
- Exponential backoff for retries
- Dead letter queue for permanent failures
- Separate handling for different error types

✅ **Reconcile daily with CUB MIS**
- Automated daily reconciliation
- Manual review for mismatches
- Comprehensive audit trails