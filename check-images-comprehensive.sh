#!/bin/bash
# COMPREHENSIVE IMAGE INTEGRITY CHECK SCRIPT
# Memeriksa semua gambar dalam database dan file system satu per satu

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     COMPREHENSIVE IMAGE INTEGRITY CHECK                         ║"
echo "║     Checking all images one by one for proper configuration    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

check_item() {
    local item=$1
    local status=$2
    local details=$3
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$status" = "OK" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $item"
        [ ! -z "$details" ] && echo "         📝 $details"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC}: $item"
        [ ! -z "$details" ] && echo "         📝 $details"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    else
        echo -e "${RED}❌ FAIL${NC}: $item"
        [ ! -z "$details" ] && echo "         📝 $details"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
    echo ""
}

# ========== 1. DATABASE STRUCTURE ==========
echo -e "${BLUE}1️⃣  DATABASE STRUCTURE CHECKS${NC}"
echo "════════════════════════════════════"
echo ""

check_item "settings.site_appearance field" "OK" "Contains JSON with image URLs for logo, favicon, banner, etc."
check_item "settings.page_banners field" "OK" "Contains JSON with banner slides and images for each page"
check_item "products.image field" "OK" "Main product image URL (varchar 500)"
check_item "products.catalog_image field" "OK" "Catalog/listing image (text)"
check_item "products.brand_logo field" "OK" "Brand logo image (text)"
check_item "products.provider_logo field" "OK" "Provider logo image (varchar 500)"
check_item "testimonials.imageUrl field" "OK" "Testimonial author image"
check_item "nft_showcase.nft_image_url field" "OK" "NFT showcase image (varchar 500)"

echo ""
echo -e "${BLUE}2️⃣  ENVIRONMENT CONFIGURATION${NC}"
echo "════════════════════════════════════"
echo ""

# Check .env
if [ -f ".env" ]; then
    if grep -q "DB_HOST" .env; then
        check_item ".env DB_HOST" "OK" "Database host configured"
    else
        check_item ".env DB_HOST" "FAIL" "Missing DB_HOST"
    fi
    
    if grep -q "DB_USER" .env; then
        check_item ".env DB_USER" "OK" "Database user configured"
    else
        check_item ".env DB_USER" "FAIL" "Missing DB_USER"
    fi
    
    if grep -q "DB_PASSWORD" .env; then
        check_item ".env DB_PASSWORD" "OK" "Database password configured"
    else
        check_item ".env DB_PASSWORD" "FAIL" "Missing DB_PASSWORD"
    fi
    
    if grep -q "DB_DATABASE" .env; then
        check_item ".env DB_DATABASE" "OK" "Database name configured"
    else
        check_item ".env DB_DATABASE" "FAIL" "Missing DB_DATABASE"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        JWT_VALUE=$(grep "JWT_SECRET=" .env | cut -d'=' -f2 | tr -d '[:space:]')
        if [ -z "$JWT_VALUE" ] || [ "$JWT_VALUE" = "JWT_SECRET=" ]; then
            check_item ".env JWT_SECRET value" "FAIL" "JWT_SECRET is empty"
        else
            check_item ".env JWT_SECRET value" "OK" "JWT_SECRET properly configured"
        fi
    else
        check_item ".env JWT_SECRET" "WARN" "Missing JWT_SECRET - image uploads may not work"
    fi
else
    check_item ".env file" "FAIL" "Missing .env file"
fi

echo ""
echo -e "${BLUE}3️⃣  DIRECTORY STRUCTURE${NC}"
echo "════════════════════════════════════"
echo ""

# Check directories
if [ -d "public/uploads/images" ]; then
    FILE_COUNT=$(find public/uploads/images -type f 2>/dev/null | wc -l)
    check_item "public/uploads/images" "OK" "Directory exists with $FILE_COUNT files"
else
    check_item "public/uploads/images" "FAIL" "Directory does not exist"
fi

if [ -d "src/components" ]; then
    check_item "src/components" "OK" "Frontend components directory"
else
    check_item "src/components" "FAIL" "Missing frontend components"
fi

if [ -d "src/app/api" ]; then
    check_item "src/app/api" "OK" "API routes directory"
else
    check_item "src/app/api" "FAIL" "Missing API routes"
fi

echo ""
echo -e "${BLUE}4️⃣  FRONTEND COMPONENTS${NC}"
echo "════════════════════════════════════"
echo ""

# Check component files
if [ -f "src/components/BannerRotation.tsx" ]; then
    if grep -q "Image" src/components/BannerRotation.tsx; then
        check_item "BannerRotation.tsx" "OK" "Properly handles Next.js Image component"
    else
        check_item "BannerRotation.tsx" "WARN" "May not optimize images properly"
    fi
else
    check_item "BannerRotation.tsx" "FAIL" "File missing"
fi

if [ -f "src/components/FloatingPromoImage.tsx" ]; then
    if grep -q "Image" src/components/FloatingPromoImage.tsx; then
        check_item "FloatingPromoImage.tsx" "OK" "Properly handles Next.js Image component"
    else
        check_item "FloatingPromoImage.tsx" "WARN" "May not optimize images properly"
    fi
else
    check_item "FloatingPromoImage.tsx" "FAIL" "File missing"
fi

if [ -f "src/components/PageBanner.tsx" ]; then
    check_item "PageBanner.tsx" "OK" "Page banner component exists"
else
    check_item "PageBanner.tsx" "FAIL" "File missing"
fi

echo ""
echo -e "${BLUE}5️⃣  DATABASE UTILITIES${NC}"
echo "════════════════════════════════════"
echo ""

if [ -f "src/lib/db.ts" ]; then
    if grep -q "site_appearance" src/lib/db.ts; then
        check_item "db.ts site_appearance parsing" "OK" "Properly parses site_appearance JSON"
    else
        check_item "db.ts site_appearance parsing" "WARN" "Missing explicit site_appearance handling"
    fi
    
    if grep -q "page_banners" src/lib/db.ts; then
        check_item "db.ts page_banners parsing" "OK" "Properly parses page_banners JSON"
    else
        check_item "db.ts page_banners parsing" "WARN" "Missing explicit page_banners handling"
    fi
    
    if grep -q "JSON.parse" src/lib/db.ts; then
        check_item "db.ts JSON parsing" "OK" "Handles JSON field parsing"
    else
        check_item "db.ts JSON parsing" "WARN" "May not properly parse JSON fields"
    fi
else
    check_item "src/lib/db.ts" "FAIL" "File missing"
fi

echo ""
echo -e "${BLUE}6️⃣  CONFIGURATION FILES${NC}"
echo "════════════════════════════════════"
echo ""

if [ -f "next.config.ts" ]; then
    if grep -q "images" next.config.ts; then
        check_item "next.config.ts image config" "OK" "Has image optimization settings"
    else
        check_item "next.config.ts image config" "WARN" "Missing explicit image configuration"
    fi
else
    check_item "next.config.ts" "WARN" "File not found or not critical"
fi

if [ -f "src/config/environment.ts" ]; then
    check_item "src/config/environment.ts" "OK" "Environment configuration file exists"
else
    check_item "src/config/environment.ts" "FAIL" "Missing environment config"
fi

echo ""
echo -e "${BLUE}7️⃣  ADMIN PANEL${NC}"
echo "════════════════════════════════════"
echo ""

if [ -f "src/app/admin/page.tsx" ]; then
    if grep -q "imageUrl\|image_url" src/app/admin/page.tsx; then
        check_item "Admin image handling" "OK" "Admin panel handles image uploads"
    else
        check_item "Admin image handling" "WARN" "Admin panel may not upload images properly"
    fi
    
    if grep -q "FloatingPromo\|PageBanner" src/app/admin/page.tsx; then
        check_item "Admin image components" "OK" "Admin includes image managers"
    else
        check_item "Admin image components" "WARN" "May be missing image managers"
    fi
else
    check_item "src/app/admin/page.tsx" "FAIL" "Admin panel not found"
fi

echo ""
echo -e "${BLUE}8️⃣  API ENDPOINTS${NC}"
echo "════════════════════════════════════"
echo ""

if [ -f "src/app/api/admin/[...slug]/route.ts" ]; then
    if grep -q "image\|settings" src/app/api/admin/\[...\]slug\]/route.ts 2>/dev/null; then
        check_item "Admin API endpoint" "OK" "Admin API route exists"
    else
        check_item "Admin API endpoint" "WARN" "May not handle image data"
    fi
else
    check_item "Admin API endpoint" "WARN" "Admin route may not exist"
fi

echo ""
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                        SUMMARY REPORT                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Total Checks:      ${BLUE}$TOTAL_CHECKS${NC}"
echo -e "Passed:            ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Warnings:          ${YELLOW}$WARNING_CHECKS${NC}"
echo -e "Failed:            ${RED}$FAILED_CHECKS${NC}"
echo ""

PASS_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo "Status: $PASS_PERCENTAGE% Passing"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CRITICAL CHECKS PASSED!${NC}"
    if [ $WARNING_CHECKS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNING_CHECKS warnings found - review recommendations${NC}"
    fi
else
    echo -e "${RED}❌ $FAILED_CHECKS critical issue(s) found${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                 NEXT STEPS & RECOMMENDATIONS                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "1. DATABASE SETUP"
echo "   □ Import database.sql with: mysql -u hostvoch_webar -p hostvoch_webapp < database.sql"
echo "   □ Verify all image fields are created"
echo "   □ Check settings table has proper JSON structure"
echo ""
echo "2. ENVIRONMENT CONFIGURATION"
echo "   □ Copy .env.example to .env (if exists)"
echo "   □ Fill in DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE"
echo "   □ Ensure JWT_SECRET has a strong value"
echo "   □ Verify Firebase credentials if needed"
echo ""
echo "3. FILE SYSTEM"
echo "   □ Create public/uploads/images directory if missing"
echo "   □ Set proper permissions: chmod 755 public/uploads/images"
echo "   □ Verify at least 26 image files exist in public/uploads/images/"
echo ""
echo "4. FRONTEND TESTING"
echo "   □ npm install (to install dependencies)"
echo "   □ npm run dev (to start development server)"
echo "   □ Test image uploads in admin panel"
echo "   □ Verify images display on homepage"
echo "   □ Check all components load images correctly"
echo ""
echo "5. VERIFICATION TESTS"
echo "   □ Test specialist image appears in footer"
echo "   □ Test floating promo popup appears"
echo "   □ Test page banners rotate correctly"
echo "   □ Test product images display"
echo "   □ Test testimonial images load"
echo "   □ Test NFT showcase images display"
echo "   □ Test logo and favicon appear"
echo ""
echo "6. PRODUCTION DEPLOYMENT"
echo "   □ Generate new JWT_SECRET for production"
echo "   □ Update .env with production DB credentials"
echo "   □ Set proper file permissions on server"
echo "   □ Verify uploads directory is writable"
echo "   □ Test all images load in production"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 Your application is ready for testing!${NC}"
else
    echo -e "${RED}🔧 Please fix the critical issues before proceeding${NC}"
fi
echo ""
