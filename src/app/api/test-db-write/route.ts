import { executeQuery } from '@/lib/db-connection';
import { NextResponse } from 'next/server';

/**
 * Database Write Test API
 * POST /api/test-db-write
 * 
 * Test apakah database bisa menerima write operations
 * Ini adalah endpoint untuk testing saja, bukan production
 */

export async function POST(request: Request) {
  try {
    console.log('🧪 [Test] Starting database write test...');

    // Generate unique test ID
    const testId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const testEmail = `${testId}@test.local`;
    const testName = `Test User ${new Date().toLocaleTimeString()}`;

    console.log(`[Test] Test ID: ${testId}`);

    // STEP 1: Test INSERT
    console.log('[Test] STEP 1: Testing INSERT...');
    try {
      await executeQuery(
        'INSERT INTO admin_users (id, email, name) VALUES (?, ?, ?)',
        [testId, testEmail, testName]
      );
      console.log('✅ [Test] INSERT successful');
    } catch (error: any) {
      console.error('❌ [Test] INSERT failed:', error.message);
      throw new Error(`INSERT failed: ${error.message}`);
    }

    // STEP 2: Test SELECT/READ
    console.log('[Test] STEP 2: Testing SELECT...');
    let readResult;
    try {
      readResult = await executeQuery(
        'SELECT * FROM admin_users WHERE id = ?',
        [testId]
      );
      
      if (!readResult || readResult.length === 0) {
        throw new Error('No data returned from SELECT');
      }
      
      console.log('✅ [Test] SELECT successful');
      console.log('[Test] Read data:', readResult[0]);
    } catch (error: any) {
      console.error('❌ [Test] SELECT failed:', error.message);
      throw new Error(`SELECT failed: ${error.message}`);
    }

    // STEP 3: Test UPDATE
    console.log('[Test] STEP 3: Testing UPDATE...');
    try {
      const newName = `Updated ${new Date().toLocaleTimeString()}`;
      await executeQuery(
        'UPDATE admin_users SET name = ? WHERE id = ?',
        [newName, testId]
      );
      console.log('✅ [Test] UPDATE successful');
    } catch (error: any) {
      console.error('❌ [Test] UPDATE failed:', error.message);
      throw new Error(`UPDATE failed: ${error.message}`);
    }

    // STEP 4: Test DELETE
    console.log('[Test] STEP 4: Testing DELETE...');
    try {
      await executeQuery(
        'DELETE FROM admin_users WHERE id = ?',
        [testId]
      );
      console.log('✅ [Test] DELETE successful');
    } catch (error: any) {
      console.error('❌ [Test] DELETE failed:', error.message);
      throw new Error(`DELETE failed: ${error.message}`);
    }

    // STEP 5: Verify DELETE
    console.log('[Test] STEP 5: Verifying DELETE...');
    try {
      const verifyResult = await executeQuery(
        'SELECT * FROM admin_users WHERE id = ?',
        [testId]
      );
      
      if (verifyResult && verifyResult.length > 0) {
        throw new Error('Record was not deleted');
      }
      
      console.log('✅ [Test] DELETE verified - record is gone');
    } catch (error: any) {
      console.error('❌ [Test] Verification failed:', error.message);
      throw new Error(`Verification failed: ${error.message}`);
    }

    console.log('🎉 [Test] All tests PASSED!');

    return NextResponse.json(
      {
        status: 'success',
        message: 'All database write operations working correctly!',
        operations: [
          { operation: 'INSERT', status: 'passed' },
          { operation: 'SELECT', status: 'passed' },
          { operation: 'UPDATE', status: 'passed' },
          { operation: 'DELETE', status: 'passed' }
        ],
        test_id: testId,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ [Test] Write test FAILED:', error.message);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Database write test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Test endpoint untuk verify database operations:
 * 
 * curl -X POST https://your-domain.com/api/test-db-write
 * 
 * Expected response:
 * {
 *   "status": "success",
 *   "message": "All database write operations working correctly!",
 *   "operations": [
 *     { "operation": "INSERT", "status": "passed" },
 *     { "operation": "SELECT", "status": "passed" },
 *     { "operation": "UPDATE", "status": "passed" },
 *     { "operation": "DELETE", "status": "passed" }
 *   ]
 * }
 */
