import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GcpBillingService {
  private readonly logger = new Logger(GcpBillingService.name);

  async syncCosts(credentialsJson: string, billingAccountId: string) {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(credentialsJson),
        scopes: ['https://www.googleapis.com/auth/cloud-billing.readonly'],
      });

      const cloudbilling = google.cloudbilling({ version: 'v1', auth });
      const billing = google.cloudbilling({ version: 'v1', auth });

      // Fetch billing account info
      const accountInfo = await cloudbilling.billingAccounts.get({
        name: `billingAccounts/${billingAccountId}`,
      });

      this.logger.log(`Synced billing account: ${accountInfo.data.displayName}`);
      return { status: 'success', data: accountInfo.data };
    } catch (error: any) {
      this.logger.error(`GCP sync failed: ${error.message}`);
      return { status: 'failed', error: error.message };
    }
  }

  async syncBigQueryExport(projectId: string, datasetId: string, tableId: string) {
    // BigQuery billing export integration
    // Requires: bigquery.datasets.get, bigquery.tables.get, bigquery.jobs.create
    this.logger.log(`BigQuery sync configured: ${projectId}.${datasetId}.${tableId}`);
    return { status: 'configured', projectId, datasetId, tableId };
  }
}
