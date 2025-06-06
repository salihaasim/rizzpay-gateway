
#!/usr/bin/env node

/**
 * Supabase Database Export Tool
 * Exports schema, data, and configurations from Supabase to prepare for AWS migration
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

class SupabaseExporter {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.exportDir = path.join(__dirname, 'exported_data');
    
    // Ensure export directory exists
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }
  }

  async exportSchema() {
    console.log('🔍 Exporting database schema...');
    
    // Export table information
    const { data: tables, error } = await this.supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');

    if (error) {
      console.error('Error fetching tables:', error);
      return;
    }

    // Save table list
    fs.writeFileSync(
      path.join(this.exportDir, 'tables.json'),
      JSON.stringify(tables, null, 2)
    );

    console.log(`✅ Exported ${tables.length} tables`);
    return tables;
  }

  async exportTableData(tableName) {
    console.log(`📊 Exporting data from ${tableName}...`);
    
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*');

      if (error) {
        console.error(`Error exporting ${tableName}:`, error);
        return null;
      }

      // Save table data
      const fileName = `${tableName}_data.json`;
      fs.writeFileSync(
        path.join(this.exportDir, fileName),
        JSON.stringify(data, null, 2)
      );

      console.log(`✅ Exported ${data?.length || 0} records from ${tableName}`);
      return data;
    } catch (err) {
      console.error(`Failed to export ${tableName}:`, err.message);
      return null;
    }
  }

  async exportAllData() {
    console.log('🚀 Starting full database export...');
    
    // Known tables from your schema
    const knownTables = [
      'merchant_profiles',
      'merchants',
      'transactions',
      'payout_requests',
      'merchant_accounts',
      'bulk_upload_files',
      'fund_transfer_jobs',
      'kyc_submissions',
      'merchant_documents',
      'merchant_payout_settings',
      'payout_ledger',
      'payout_webhooks',
      'bank_transactions',
      'api_request_logs',
      'ip_whitelist',
      'webhook_whitelist',
      'utr_logs',
      'user_roles'
    ];

    const exportSummary = {
      timestamp: new Date().toISOString(),
      tables: {},
      totalRecords: 0
    };

    for (const tableName of knownTables) {
      const data = await this.exportTableData(tableName);
      exportSummary.tables[tableName] = {
        recordCount: data?.length || 0,
        exported: data !== null
      };
      exportSummary.totalRecords += data?.length || 0;
    }

    // Save export summary
    fs.writeFileSync(
      path.join(this.exportDir, 'export_summary.json'),
      JSON.stringify(exportSummary, null, 2)
    );

    console.log('📋 Export Summary:');
    console.log(`Total Records: ${exportSummary.totalRecords}`);
    console.log(`Export Directory: ${this.exportDir}`);
    
    return exportSummary;
  }

  async exportFunctions() {
    console.log('⚙️ Exporting database functions...');
    
    // Export custom functions (these need to be manually reviewed)
    const functions = [
      'get_or_create_api_key',
      'log_whitelist_activity',
      'calculate_payout_net_amount',
      'get_merchant_wallet_balance',
      'update_updated_at_column'
    ];

    const functionExport = {
      functions: functions,
      note: 'These functions need to be recreated in AWS RDS PostgreSQL',
      migrationRequired: true
    };

    fs.writeFileSync(
      path.join(this.exportDir, 'database_functions.json'),
      JSON.stringify(functionExport, null, 2)
    );

    console.log('✅ Database functions list exported');
  }

  async generateMigrationSQL() {
    console.log('📝 Generating migration SQL scripts...');
    
    // This would generate SQL scripts for AWS RDS
    const migrationSQL = `
-- RizzPay Database Migration Scripts
-- Generated on: ${new Date().toISOString()}

-- Create database
CREATE DATABASE rizzpay_prod;
CREATE DATABASE rizzpay_uat;
CREATE DATABASE rizzpay_test;

-- Note: Import your schema and data using the exported JSON files
-- Use the data import scripts in the migration/ directory
`;

    fs.writeFileSync(
      path.join(this.exportDir, 'migration_setup.sql'),
      migrationSQL
    );

    console.log('✅ Migration SQL scripts generated');
  }
}

// CLI execution
if (require.main === module) {
  async function main() {
    try {
      const exporter = new SupabaseExporter();
      
      await exporter.exportSchema();
      await exporter.exportAllData();
      await exporter.exportFunctions();
      await exporter.generateMigrationSQL();
      
      console.log('🎉 Database export completed successfully!');
      console.log('📂 Check the exported_data/ directory for all exported files');
      
    } catch (error) {
      console.error('❌ Export failed:', error.message);
      process.exit(1);
    }
  }
  
  main();
}

module.exports = SupabaseExporter;
