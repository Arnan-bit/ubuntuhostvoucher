#!/usr/bin/env node

// Script to update digital product images with better professional designs
const API_BASE = 'http://localhost:9002';

const imageUpdates = [
    {
        name: 'Learn Procreate: The Ultimate Guide',
        newImage: 'https://placehold.co/400x300/10B981/FFFFFF.png?text=📚+Learn+Procreate+Guide&font=montserrat'
    },
    {
        name: 'Custom Animated Wedding Invitation',
        newImage: 'https://placehold.co/400x300/EC4899/FFFFFF.png?text=💒+Wedding+Invitation&font=montserrat'
    },
    {
        name: 'Ghibli Style Portrait',
        newImage: 'https://placehold.co/400x300/3B82F6/FFFFFF.png?text=🎨+Ghibli+Portrait&font=montserrat'
    },
    {
        name: 'Professional Object Removal',
        newImage: 'https://placehold.co/400x300/F59E0B/FFFFFF.png?text=✨+Object+Removal&font=montserrat'
    },
    {
        name: 'Personal Landing Page Website',
        newImage: 'https://placehold.co/400x300/8B5CF6/FFFFFF.png?text=💻+Landing+Page&font=montserrat'
    },
    {
        name: 'Personalized Birthday Video Greeting',
        newImage: 'https://placehold.co/400x300/F472B6/FFFFFF.png?text=🎉+Birthday+Video&font=montserrat'
    }
];

async function updateProductImages() {
    try {
        console.log('🎨 Updating digital product images with professional designs...\n');
        
        // Get all products
        const response = await fetch(`${API_BASE}/api/data?type=deals`);
        const result = await response.json();
        const products = Array.isArray(result) ? result : (result.data || []);
        
        console.log(`📋 Found ${products.length} products`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const imageUpdate of imageUpdates) {
            console.log(`🔍 Looking for: ${imageUpdate.name}`);
            
            // Find the product
            const product = products.find(p => 
                p.name && p.name.toLowerCase().includes(imageUpdate.name.toLowerCase())
            );
            
            if (!product) {
                console.log(`❌ Product not found: ${imageUpdate.name}\n`);
                errorCount++;
                continue;
            }
            
            console.log(`✅ Found product: ${product.name}`);
            console.log(`📸 Current image: ${product.image}`);
            console.log(`🎨 New image: ${imageUpdate.newImage}`);
            
            // Update the product with new image
            const updatedProduct = {
                ...product,
                image: imageUpdate.newImage
            };
            
            const updateResponse = await fetch(`${API_BASE}/api/action`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'saveProduct', payload: updatedProduct })
            });
            
            if (updateResponse.ok) {
                console.log(`✅ Updated image for: ${product.name}`);
                successCount++;
            } else {
                console.log(`❌ Failed to update: ${product.name}`);
                errorCount++;
            }
            
            console.log(''); // Empty line for spacing
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        console.log(`📊 Summary:`);
        console.log(`  ✅ Success: ${successCount}`);
        console.log(`  ❌ Errors: ${errorCount}`);
        console.log(`  📈 Total: ${imageUpdates.length}`);
        
        if (successCount > 0) {
            console.log(`\n🎉 Digital product images updated successfully!`);
            console.log(`💡 New features:`);
            console.log(`   🎨 Professional placeholder designs`);
            console.log(`   📱 Emoji icons for better recognition`);
            console.log(`   🎯 Consistent branding across products`);
            console.log(`   ⚡ Optimized for fast loading`);
            console.log(`   📐 Perfect 400x300 aspect ratio`);
            
            console.log(`\n🌐 Visit http://localhost:9002 to see the updated catalog!`);
        }
        
    } catch (error) {
        console.error('❌ Error updating product images:', error.message);
    }
}

updateProductImages();
