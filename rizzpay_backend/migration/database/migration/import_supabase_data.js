
#!/usr/bin/env node

/**
 * Import Supabase exported data to AWS RDS PostgreSQL
 * This script imports the data exported from Supabase into AWS RDS
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

class DataImporter {
  constructor(environment = 'test') {
    this.environment = environment;
    this.exportDir = path.join(__dirname, '../export/exported_data');
    
    // Database connection based on environment
    this.dbConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'rizzpay',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: this.environment === 'prod' ? { rejectUnauthorized: false } : false
    };
    
    this.pool = new Pool(this.dbConfig);
  }

  async validateConnection() {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  async createSchema() {
    console.log('📋 Creating database schema...');
    
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../schema/rizzpay_schema.sql'),
      'utf8'
    );
    
    try {
      await this.pool.query(schemaSQL);
      console.log('✅ Schema created successfully');
    } catch (error) {
      console.error('❌ Schema creation failed:', error.message);
      throw error;
    }
  }

  async importTableData(tableName) {
    const dataFile = path.join(this.exportDir, `${tableName}_data.json`);
    
    if (!fs.existsSync(dataFile)) {
      console.log(`⚠️ No data file found for ${tableName}`);
      return;
    }

    console.log(`📊 Importing data for ${tableName}...`);
    
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      
      if (!data || data.length === 0) {
        console.log(`ℹ️ No data to import for ${tableName}`);
        return;
      }

      // Generate insert query dynamically
      const columns = Object.keys(data[0]);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const query = `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT DO NOTHING
      `;

      let imported = 0;
      for (const row of data) {
        try {
          const values = columns.map(col => row[col]);
          await this.pool.query(query, values);
          imported++;
        } catch (error) {
          console.error(`Error importing row for ${tableName}:`, error.message);
        }
      }

      console.log(`✅ Imported ${imported}/${data.length} records for ${tableName}`);
    } catch (error) {
      console.error(`❌ Failed to import ${tableName}:`, error.message);
    }
  }

  async importAllData() {
    console.log('🚀 Starting data import...');
    
    // Import order matters due to foreign key constraints
    const importOrder = [
      'user_roles',
      'merchant_profiles',
      'merchants',
      'merchant_accounts',
      'merchant_payout_settings',
      'kyc_submissions',
      'merchant_documents',
      'transactions',
      'payout_requests',
      'payout_ledger',
      'payout_webhooks',
      'bank_transactions',
      'bulk_upload_files',
      'fund_transfer_jobs',
      'ip_whitelist',
      'webhook_whitelist',
      'api_request_logs',
      'utr_logs'
    ];

    for (const tableName of importOrder) {
      await this.importTableData(tableName);
    }

    console.log('🎉 Data import completed!');
  }

  async validateImport() {
    console.log('🔍 Validating imported data...');
    
    const summaryFile = path.join(this.exportDir, 'export_summary.json');
    if (!fs.existsSync(summaryFile)) {
      console.log('⚠️ No export summary found, skipping validation');
      return;
    }

    const exportSummary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
    const validation = {
      timestamp: new Date().toISOString(),
      environment: this.environment,
      tables: {},
      totalImported: 0
    };

    for (const [tableName, exportInfo] of Object.entries(exportSummary.tables)) {
      try {
        const result = await this.pool.query(`SELECT COUNT(*) FROM ${tableName}`);
        const importedCount = parseInt(result.rows[0].count);
        
        validation.tables[tableName] = {
          exported: exportInfo.recordCount,
          imported: importedCount,
          match: exportInfo.recordCount === importedCount
        };
        
        validation.totalImported += importedCount;
        
        console.log(`📊 ${tableName}: ${importedCount}/${exportInfo.recordCount} records`);
      } catch (error) {
        validation.tables[tableName] = {
          exported: exportInfo.recordCount,
          imported: 0,
          match: false,
          error: error.message
        };
      }
    }

    // Save validation report
    fs.writeFileSync(
      path.join(__dirname, `import_validation_${this.environment}.json`),
      JSON.stringify(validation, null, 2)
    );

    console.log(`📋 Import Validation Complete:`);
    console.log(`Total Imported: ${validation.totalImported}`);
    console.log(`Total Expected: ${exportSummary.totalRecords}`);
  }

  async close() {
    await this.pool.end();
  }
}

// CLI execution
if (require.main === module) {
  async function main() {
    const environment = process.argv[2] || 'test';
    
    try {
      const importer = new DataImporter(environment);
      
      if (!(await importer.validateConnection())) {
        process.exit(1);
      }
      
      await importer.createSchema();
      await importer.importAllData();
      await importer.validateImport();
      await importer.close();
      
      console.log('🎉 Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  }
  
  main();
}

module.exports = DataImporter;
