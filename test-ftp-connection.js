const { Client } = require('basic-ftp');

async function testFTPConnection() {
    console.log('🧪 Testing FTP Connection...');
    
    const ftpConfig = {
        host: '41.216.185.84',
        user: 'uploaderar@hostvocher.com',
        password: '231191493ra@ptF'
    };

    console.log('🔧 FTP Config:', {
        host: ftpConfig.host,
        user: ftpConfig.user,
        password: ftpConfig.password ? '***' : 'NOT SET'
    });

    const client = new Client(30000);
    client.ftp.verbose = true;

    try {
        console.log('🔗 Connecting to FTP server...');
        await client.access({
            host: ftpConfig.host,
            user: ftpConfig.user,
            password: ftpConfig.password,
            secure: false
        });
        
        console.log('✅ FTP connection successful!');
        
        // List current directory
        console.log('📁 Listing current directory...');
        const list = await client.list();
        console.log('Directory contents:');
        list.forEach(item => {
            console.log(`  ${item.type === 1 ? 'DIR' : 'FILE'}: ${item.name} (${item.size} bytes)`);
        });
        
        // Check if uploads directory exists
        console.log('📁 Checking uploads directory...');
        try {
            await client.cd('/public_html/uploads/images');
            console.log('✅ Uploads directory exists');
            
            const uploadsList = await client.list();
            console.log(`📊 Found ${uploadsList.length} files in uploads directory`);
            
        } catch (e) {
            console.log('⚠️ Uploads directory does not exist, creating...');
            await client.ensureDir('/public_html/uploads/images');
            console.log('✅ Uploads directory created');
        }
        
    } catch (error) {
        console.error('❌ FTP connection failed:', {
            message: error.message,
            code: error.code
        });
    } finally {
        if (!client.closed) {
            await client.close();
            console.log('🔌 FTP connection closed');
        }
    }
}

// Run test if this file is executed directly
if (require.main === module) {
    testFTPConnection();
}

module.exports = { testFTPConnection };
