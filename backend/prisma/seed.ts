import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      plan: 'enterprise',
      domain: 'acme.com',
    },
  });
  console.log(`  ✓ Tenant: ${tenant.name}`);

  // Create admin user
  const password = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      name: 'Admin User',
      password,
      role: 'admin',
      tenantId: tenant.id,
    },
  });
  console.log(`  ✓ Admin: ${admin.email} / Admin123!`);

  // Create viewer
  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@acme.com',
      name: 'Viewer User',
      password: await bcrypt.hash('Viewer123!', 12),
      role: 'viewer',
      tenantId: tenant.id,
    },
  });
  console.log(`  ✓ Viewer: ${viewer.email} / Viewer123!`);

  // Create billing accounts
  const accounts = [
    { gcpBillingId: 'Billing-001', name: 'Main Production', displayName: 'Production Environment', budgetAmount: 80000 },
    { gcpBillingId: 'Billing-002', name: 'Dev & Staging', displayName: 'Development & Staging', budgetAmount: 15000 },
    { gcpBillingId: 'Billing-003', name: 'Client Alpha', displayName: 'Alpha Corp Managed', budgetAmount: 25000 },
    { gcpBillingId: 'Billing-004', name: 'ML Research', displayName: 'ML Training Lab', budgetAmount: 30000 },
  ];

  const billingAccounts = [];
  for (const a of accounts) {
    const account = await prisma.billingAccount.create({
      data: { ...a, tenantId: tenant.id, currency: 'USD', status: 'active' },
    });
    billingAccounts.push(account);
    console.log(`  ✓ Billing Account: ${account.name}`);
  }

  // Create projects per billing account
  const projectNames = [
    ['web-prod', 'api-prod', 'cdn-prod'],
    ['dev-sandbox', 'staging-env', 'ci-cd'],
    ['client-portal', 'client-db'],
    ['ml-training', 'ml-inference'],
  ];

  for (let i = 0; i < billingAccounts.length; i++) {
    for (const projName of projectNames[i]) {
      await prisma.gCPProject.create({
        data: {
          gcpProjectId: `${billingAccounts[i].gcpBillingId}-${projName}`,
          billingAccountId: billingAccounts[i].id,
          name: projName,
          status: 'active',
        },
      });
    }
  }
  console.log('  ✓ Projects created');

  // Generate 90 days of cost data
  const services = ['Compute Engine', 'Cloud Storage', 'BigQuery', 'Cloud SQL', 'GKE', 'Cloud Networking', 'Cloud Functions', 'Pub/Sub', 'Cloud CDN', 'Cloud DNS', 'Cloud Load Balancing', 'Cloud IAM'];
  const skus = ['VM-CPU', 'VM-RAM', 'VM-DISK', 'STD-STORAGE', 'NEARLINE', 'COLDLINE', 'QUERY-ONDEMAND', 'QUERY-FLAT', 'DB-CPU', 'DB-RAM', 'DB-STORAGE', 'CLUSTER-FEE', 'NODE-CPU', 'NODE-RAM', 'LB-FWD-RULE', 'LB-DATA', 'DNS-QUERY', 'CDN-EGRESS', 'FUNC-INVOCATION', 'PUBSUB-MSG'];

  const now = new Date();
  for (const account of billingAccounts) {
    const projects = await prisma.gCPProject.findMany({ where: { billingAccountId: account.id } });

    for (let day = 90; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);

      // 3-6 services per day
      const dayServices = services.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 3);

      for (const service of dayServices) {
        const sku = skus[Math.floor(Math.random() * skus.length)];
        const cost = +(Math.random() * 500 + 10).toFixed(2);
        const project = projects[Math.floor(Math.random() * projects.length)];

        await prisma.dailyCost.create({
          data: {
            date,
            billingAccountId: account.id,
            projectId: project?.id || null,
            service,
            sku,
            skuDescription: `${service} - ${sku}`,
            region: ['us-central1', 'us-east1', 'us-west1', 'europe-west1', 'asia-east1'][Math.floor(Math.random() * 5)],
            cost,
            currency: 'USD',
            credits: Math.random() > 0.8 ? +(cost * 0.1).toFixed(2) : 0,
          },
        });
      }
    }
    console.log(`  ✓ 90 days cost data for ${account.name}`);
  }

  // Create some anomalies
  for (const account of billingAccounts) {
    const anomalyDate = new Date(now);
    anomalyDate.setDate(anomalyDate.getDate() - Math.floor(Math.random() * 30) - 1);
    await prisma.costAnomaly.create({
      data: {
        billingAccountId: account.id,
        date: anomalyDate,
        service: 'Compute Engine',
        cost: 2800,
        expectedCost: 1500,
        deviationPct: 86.7,
        severity: 'high',
        reason: 'Unexpected spike in Compute Engine usage',
        status: 'open',
      },
    });
  }
  console.log('  ✓ Cost anomalies created');

  // Create some invoices
  for (let month = 0; month < 6; month++) {
    for (const account of billingAccounts) {
      const invoiceDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
      const amount = +(Math.random() * account.budgetAmount * 0.8 + account.budgetAmount * 0.2).toFixed(2);
      await prisma.invoice.create({
        data: {
          billingAccountId: account.id,
          invoiceNumber: `INV-${account.gcpBillingId}-${invoiceDate.toISOString().split('T')[0]}`,
          invoiceDate,
          dueDate: new Date(invoiceDate.getTime() + 30 * 86400000),
          amount,
          currency: 'USD',
          status: month === 0 ? 'pending' : 'paid',
        },
      });
    }
  }
  console.log('  ✓ Invoices created');

  // Create budgets
  for (const account of billingAccounts) {
    await prisma.budget.create({
      data: {
        billingAccountId: account.id,
        tenantId: tenant.id,
        name: `${account.name} Monthly Budget`,
        amount: account.budgetAmount || 50000,
        currency: 'USD',
        period: 'monthly',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        alertThresholds: [50, 75, 90, 100],
        forecastEnabled: true,
        scope: 'billing_account',
        status: 'active',
      },
    });
  }
  console.log('  ✓ Budgets created');

  // Create audit log
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      userId: admin.id,
      action: 'seed',
      resource: 'system',
      details: { message: 'Database seeded with sample data' },
    },
  });

  console.log('\n✅ Seed complete!');
  console.log('   Login: admin@acme.com / Admin123!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
