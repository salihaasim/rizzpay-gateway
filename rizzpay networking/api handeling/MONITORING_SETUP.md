# CloudWatch Monitoring Setup for CUB API Integration

## Metrics Configuration

### Custom Metrics
```bash
# Create custom metrics for CUB API monitoring
aws logs create-log-group --log-group-name /rizzpay/cub/api-calls
aws logs create-log-group --log-group-name /rizzpay/cub/reconciliation
aws logs create-log-group --log-group-name /rizzpay/cub/security
```

### Key Performance Indicators (KPIs)
```typescript
export const CUB_API_METRICS = {
  // Response Time Metrics
  RESPONSE_TIME: {
    namespace: 'RizzPay/CUB/API',
    metricName: 'ResponseTime',
    unit: 'Milliseconds',
    thresholds: {
      warning: 2000,   // 2 seconds
      critical: 5000   // 5 seconds
    }
  },

  // Success Rate Metrics
  SUCCESS_RATE: {
    namespace: 'RizzPay/CUB/API',
    metricName: 'SuccessRate',
    unit: 'Percent',
    thresholds: {
      warning: 95,     // Below 95%
      critical: 90     // Below 90%
    }
  },

  // Error Rate Metrics
  ERROR_RATE: {
    namespace: 'RizzPay/CUB/API',
    metricName: 'ErrorRate',
    unit: 'Percent',
    thresholds: {
      warning: 2,      // Above 2%
      critical: 5      // Above 5%
    }
  },

  // Transaction Volume
  TRANSACTION_VOLUME: {
    namespace: 'RizzPay/CUB/Transactions',
    metricName: 'TransactionCount',
    unit: 'Count',
    thresholds: {
      warning: 1000,   // Per hour
      critical: 500    // Per hour (low volume alert)
    }
  },

  // Reconciliation Metrics
  RECONCILIATION_RATE: {
    namespace: 'RizzPay/CUB/Reconciliation',
    metricName: 'ReconciliationRate',
    unit: 'Percent',
    thresholds: {
      warning: 98,     // Below 98%
      critical: 95     // Below 95%
    }
  }
};
```

## CloudWatch Alarms

### API Performance Alarms
```typescript
import AWS from 'aws-sdk';

const cloudWatch = new AWS.CloudWatch();

export const createCUBApiAlarms = async (): Promise<void> => {
  const alarms = [
    // High Response Time Alarm
    {
      AlarmName: 'CUB-API-High-Response-Time',
      AlarmDescription: 'CUB API response time is too high',
      MetricName: 'ResponseTime',
      Namespace: 'RizzPay/CUB/API',
      Statistic: 'Average',
      Period: 300, // 5 minutes
      EvaluationPeriods: 2,
      Threshold: 5000, // 5 seconds
      ComparisonOperator: 'GreaterThanThreshold',
      AlarmActions: [
        'arn:aws:sns:region:account:cub-api-alerts'
      ]
    },

    // Low Success Rate Alarm
    {
      AlarmName: 'CUB-API-Low-Success-Rate',
      AlarmDescription: 'CUB API success rate is below threshold',
      MetricName: 'SuccessRate',
      Namespace: 'RizzPay/CUB/API',
      Statistic: 'Average',
      Period: 300, // 5 minutes
      EvaluationPeriods: 3,
      Threshold: 95, // Below 95%
      ComparisonOperator: 'LessThanThreshold',
      AlarmActions: [
        'arn:aws:sns:region:account:cub-api-critical-alerts'
      ]
    },

    // High Error Rate Alarm
    {
      AlarmName: 'CUB-API-High-Error-Rate',
      AlarmDescription: 'CUB API error rate is too high',
      MetricName: 'ErrorRate',
      Namespace: 'RizzPay/CUB/API',
      Statistic: 'Sum',
      Period: 300, // 5 minutes
      EvaluationPeriods: 2,
      Threshold: 5, // Above 5%
      ComparisonOperator: 'GreaterThanThreshold',
      AlarmActions: [
        'arn:aws:sns:region:account:cub-api-critical-alerts'
      ]
    },

    // Low Transaction Volume Alarm
    {
      AlarmName: 'CUB-API-Low-Transaction-Volume',
      AlarmDescription: 'CUB API transaction volume is unusually low',
      MetricName: 'TransactionCount',
      Namespace: 'RizzPay/CUB/Transactions',
      Statistic: 'Sum',
      Period: 3600, // 1 hour
      EvaluationPeriods: 1,
      Threshold: 500, // Less than 500 per hour
      ComparisonOperator: 'LessThanThreshold',
      AlarmActions: [
        'arn:aws:sns:region:account:cub-api-alerts'
      ]
    },

    // Dead Letter Queue Alarm
    {
      AlarmName: 'CUB-API-DLQ-Messages',
      AlarmDescription: 'Messages accumulating in CUB API dead letter queue',
      MetricName: 'ApproximateNumberOfMessages',
      Namespace: 'AWS/SQS',
      Dimensions: [
        {
          Name: 'QueueName',
          Value: 'cub-api-dlq'
        }
      ],
      Statistic: 'Maximum',
      Period: 300, // 5 minutes
      EvaluationPeriods: 1,
      Threshold: 10, // More than 10 messages
      ComparisonOperator: 'GreaterThanThreshold',
      AlarmActions: [
        'arn:aws:sns:region:account:cub-api-critical-alerts'
      ]
    }
  ];

  for (const alarm of alarms) {
    try {
      await cloudWatch.putMetricAlarm(alarm).promise();
      console.log(`Created alarm: ${alarm.AlarmName}`);
    } catch (error) {
      console.error(`Failed to create alarm ${alarm.AlarmName}:`, error);
    }
  }
};
```

## Custom Dashboards

### CUB API Dashboard Configuration
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["RizzPay/CUB/API", "ResponseTime"],
          [".", "SuccessRate"],
          [".", "ErrorRate"]
        ],
        "period": 300,
        "stat": "Average",
        "region": "ap-south-1",
        "title": "CUB API Performance",
        "yAxis": {
          "left": {
            "min": 0
          }
        }
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["RizzPay/CUB/Transactions", "TransactionCount", {"stat": "Sum"}],
          ["RizzPay/CUB/Transactions", "TransactionValue", {"stat": "Sum"}]
        ],
        "period": 3600,
        "region": "ap-south-1",
        "title": "Transaction Volume",
        "yAxis": {
          "left": {
            "min": 0
          }
        }
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["RizzPay/CUB/Reconciliation", "ReconciliationRate"],
          [".", "MismatchCount"],
          [".", "UnmatchedTransactions"]
        ],
        "period": 86400,
        "stat": "Average",
        "region": "ap-south-1",
        "title": "Daily Reconciliation",
        "yAxis": {
          "left": {
            "min": 0,
            "max": 100
          }
        }
      }
    },
    {
      "type": "log",
      "properties": {
        "query": "SOURCE '/rizzpay/cub/api-calls'\n| fields @timestamp, trace_id, http_status, response_time_ms\n| filter http_status >= 400\n| sort @timestamp desc\n| limit 100",
        "region": "ap-south-1",
        "title": "Recent API Errors",
        "view": "table"
      }
    }
  ]
}
```

## Log Insights Queries

### Useful CloudWatch Insights Queries
```sql
-- Top 10 slowest API calls in last hour
fields @timestamp, trace_id, response_time_ms, http_status
| filter @timestamp > @timestamp - 1h
| sort response_time_ms desc
| limit 10

-- Error rate by hour
fields @timestamp, http_status
| filter @timestamp > @timestamp - 24h
| filter http_status >= 400
| stats count() as error_count by bin(5m)

-- Most common error messages
fields @timestamp, error_message
| filter @timestamp > @timestamp - 24h
| filter ispresent(error_message)
| stats count() as error_count by error_message
| sort error_count desc

-- Transaction volume by hour
fields @timestamp, txn_amount
| filter @timestamp > @timestamp - 24h
| stats count() as txn_count, sum(txn_amount) as total_amount by bin(1h)
| sort @timestamp desc

-- Failed transactions analysis
fields @timestamp, trace_id, failure_reason, txn_amount
| filter status = "FAILED"
| filter @timestamp > @timestamp - 24h
| stats count() as failure_count by failure_reason
| sort failure_count desc

-- Security events monitoring
fields @timestamp, source_ip, event_type, trace_id
| filter event_type = "SECURITY_VIOLATION" or event_type = "SUSPICIOUS_ACTIVITY"
| filter @timestamp > @timestamp - 24h
| sort @timestamp desc
```

## SNS Notifications

### Alert Topic Configuration
```typescript
export const createAlertTopics = async (): Promise<void> => {
  const sns = new AWS.SNS();

  const topics = [
    {
      Name: 'cub-api-alerts',
      DisplayName: 'CUB API Alerts',
      Description: 'Non-critical alerts for CUB API monitoring'
    },
    {
      Name: 'cub-api-critical-alerts',
      DisplayName: 'CUB API Critical Alerts',
      Description: 'Critical alerts requiring immediate attention'
    },
    {
      Name: 'cub-reconciliation-alerts',
      DisplayName: 'CUB Reconciliation Alerts',
      Description: 'Daily reconciliation status and issues'
    }
  ];

  for (const topic of topics) {
    try {
      const result = await sns.createTopic({
        Name: topic.Name,
        Attributes: {
          DisplayName: topic.DisplayName,
          Description: topic.Description
        }
      }).promise();

      console.log(`Created SNS topic: ${topic.Name}`);
      console.log(`Topic ARN: ${result.TopicArn}`);

      // Subscribe email endpoints
      await sns.subscribe({
        TopicArn: result.TopicArn!,
        Protocol: 'email',
        Endpoint: process.env.ALERT_EMAIL!
      }).promise();

    } catch (error) {
      console.error(`Failed to create topic ${topic.Name}:`, error);
    }
  }
};
```

## Lambda Function for Custom Metrics

### Metrics Collection Lambda
```typescript
import AWS from 'aws-sdk';
import { Handler } from 'aws-lambda';

const cloudWatch = new AWS.CloudWatch();

export const metricsCollector: Handler = async (event) => {
  try {
    // Collect custom metrics from various sources
    const metrics = await collectMetrics();

    // Publish to CloudWatch
    await publishMetrics(metrics);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Metrics published successfully',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Metrics collection failed:', error);
    throw error;
  }
};

const collectMetrics = async () => {
  // Implementation to collect metrics from:
  // - Database queries
  // - API call logs
  // - System performance
  // - Business metrics
  
  return {
    transactionCount: 0,
    totalAmount: 0,
    successRate: 0,
    averageResponseTime: 0
  };
};

const publishMetrics = async (metrics: any) => {
  const metricData = [
    {
      MetricName: 'TransactionCount',
      Value: metrics.transactionCount,
      Unit: 'Count',
      Timestamp: new Date()
    },
    {
      MetricName: 'TotalTransactionValue',
      Value: metrics.totalAmount,
      Unit: 'None',
      Timestamp: new Date()
    },
    {
      MetricName: 'SuccessRate',
      Value: metrics.successRate,
      Unit: 'Percent',
      Timestamp: new Date()
    },
    {
      MetricName: 'AverageResponseTime',
      Value: metrics.averageResponseTime,
      Unit: 'Milliseconds',
      Timestamp: new Date()
    }
  ];

  await cloudWatch.putMetricData({
    Namespace: 'RizzPay/CUB/BusinessMetrics',
    MetricData: metricData
  }).promise();
};
```

## Monitoring Automation

### EventBridge Rules for Automated Responses
```typescript
export const createEventBridgeRules = async (): Promise<void> => {
  const eventBridge = new AWS.EventBridge();

  const rules = [
    {
      Name: 'CUB-API-Auto-Scale',
      Description: 'Auto-scale based on CUB API load',
      EventPattern: {
        source: ['aws.cloudwatch'],
        'detail-type': ['CloudWatch Alarm State Change'],
        detail: {
          alarmName: ['CUB-API-High-Response-Time'],
          state: {
            value: ['ALARM']
          }
        }
      },
      Targets: [
        {
          Id: '1',
          Arn: 'arn:aws:lambda:region:account:function:auto-scale-handler'
        }
      ]
    },

    {
      Name: 'CUB-API-Circuit-Breaker',
      Description: 'Trigger circuit breaker on high error rate',
      EventPattern: {
        source: ['aws.cloudwatch'],
        'detail-type': ['CloudWatch Alarm State Change'],
        detail: {
          alarmName: ['CUB-API-High-Error-Rate'],
          state: {
            value: ['ALARM']
          }
        }
      },
      Targets: [
        {
          Id: '1',
          Arn: 'arn:aws:lambda:region:account:function:circuit-breaker-handler'
        }
      ]
    }
  ];

  for (const rule of rules) {
    try {
      await eventBridge.putRule({
        Name: rule.Name,
        Description: rule.Description,
        EventPattern: JSON.stringify(rule.EventPattern),
        State: 'ENABLED'
      }).promise();

      await eventBridge.putTargets({
        Rule: rule.Name,
        Targets: rule.Targets
      }).promise();

      console.log(`Created EventBridge rule: ${rule.Name}`);
    } catch (error) {
      console.error(`Failed to create rule ${rule.Name}:`, error);
    }
  }
};