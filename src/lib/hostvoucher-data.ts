

// This file is now client-side safe.
// It fetches data from the Next.js API route instead of directly from the database.

import { Medal, Trophy, Gem, Shield, Crown, Rocket, ImageIcon, Star } from 'lucide-react';


const makeSerializable = (data: any): any => {
    if (data === null || data === undefined) {
        return data;
    }
    // Simple check for something that looks like a date string
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(data)) {
        return new Date(data);
    }
    if (Array.isArray(data)) {
        return data.map(makeSerializable);
    }
    if (typeof data === 'object') {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            newObj[key] = makeSerializable(data[key]);
        }
        return newObj;
    }
    return data;
};

// --- Client-side Data Fetching Functions ---

export async function fetchData(type: string) {
    try {
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!baseUrl && process.env.VERCEL_URL) {
            // Ensure VERCEL_URL has a protocol for fetch to parse correctly
            baseUrl = `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}`;
        }

        const url = baseUrl ? `${baseUrl}/api/data?type=${type}` : `/api/data?type=${type}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${type}`);
        }
        const { data } = await response.json();
        return makeSerializable(data);
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        // Return a default value appropriate for the expected data type
        return type === 'siteSettings' || type === 'achievements' ? {} : [];
    }
}


export function getDeals() { return fetchData('deals'); }
export function getTestimonials() { return fetchData('testimonials'); }
export function getBlogPosts() { return fetchData('blog_posts'); }
export function getMiningTasks() { return fetchData('mining_tasks'); }
export function getHostVoucherTestimonials() { return fetchData('hostvoucher_testimonials'); }
export function getNftShowcase() { return fetchData('nft_showcase'); }
export function getSiteSettings() { return fetchData('siteSettings'); }


// --- Translations and Static Data ---
export const translations: any = {
    en: {
        tagline: "Your #1 source for exclusive tech & digital service offers!",
        picksAndDealsTitle: "👇 Choose Your Perfect Offer Below 👇",
        hottestDeals: "Today's Hottest Offers",
        hosting: "Hosting",
        webHosting: "Web Hosting",
        wordpressHosting: "WordPress Hosting",
        cloudHosting: "Cloud Hosting",
        vps: "VPS",
        vpn: "VPN",
        domains: "Domains",
        instantProWebsite: "Instant Pro Website",
        promotionalVouchers: "Promotional Vouchers",
        request: "Request & Submit",
        findPlan: "Discover the ideal plan, engineered for your success.",
        comparing: "Comparing",
        noDeals: "No offers available for this category.",
        searchPlaceholder: "Search by brand or catalog no...",
        footerRights: "All rights reserved. Built with ❤️ for the best offers.",
        free: "Free",
        aiRecommendButton: "✨ AI-Powered Recommendation",
        aiGenerateDescription: "✨ Generate with AI",
        aiLoading: "AI is thinking...",
        chatbotWelcome: "Hello! I'm your AI assistant. How can I help you find the best deal today?",
        chatbotPlaceholder: "Ask for a recommendation...",
        chatbotTitle: "HostVoucher AI Assistant",
        couponsTitle: "Exclusive Discounts & Coupons",
        allCoupons: "All Coupons",
        noCouponsFound: "No coupons found for this filter.",
        gotCouponTitle: "Got a Discount, Promo, or Coupon Link not listed?",
        gotCouponDescription: "Help the community by sharing it!",
        submitCouponNow: "Submit a Coupon Now",
        requestTitle: "Request a New Deal or Submit a Coupon",
        requestDealDescription: "Can't find the deal you're looking for? Let us know! Have a code to share? Submit it here.",
        requestServiceType: "Service Type:",
        requestSelectService: "Select a service type",
        requestProviderName: "Provider Name:",
        requestYourEmail: "Your Email (for follow-up):",
        requestDealDetails: "Deal Details:",
        requestDealPlaceholder: "Any specific details that can help us find the deal.",
        requestSubmitButton: "Submit Request",
        submitCouponTitle: "Got a Coupon?",
        submitCouponDescription: "Submit your promo code to share with us and other users.",
        submitCouponButton: "Submit Coupon",
        formName: "Name",
        formNamePlaceholder: "Your name",
        formEmail: "E-mail",
        formEmailPlaceholder: "you@example.com",
        formCouponCode: "Coupon Code",
        formDescription: "Description",
        formDescriptionPlaceholder: "e.g., 15% off for new users",
        formPrivacy: "Yes, I have read the privacy policy",
        submitSuccess: "Thank you! Your submission has been received for review.",
        requestSuccess: "Thank you! Your request has been received.",
        aboutTitle: "Who is HostVoucher?",
        aboutDescription: "HostVoucher is your premier global destination for curated digital offers. We partner with world-renowned brands like Hostinger, DigitalOcean, and NordVPN to bring you exclusive, verified promo codes and premium savings. Our mission is to empower your digital journey by providing unparalleled value on essential services, ensuring you always get maximum benefits.",
        faqTitle: "Frequently Asked Questions",
        sortRating: "By Rating",
        sortPriceAsc: "Price: Low to High",
        sortPriceDesc: "Price: High to Low",
        sortNewest: "Newest",
        sortDiscount: "By Discount",
        sortReviews: "Most Reviews",
        sortSales: "Best Selling",
        nftActivationTitle: "Activate Your NFT Mining!",
        nftActivationDescription: "Enter your details to start earning points towards exclusive NFT badges.",
        ethAddress: "Your ETH Wallet Address",
        activateMining: "Activate Mining",
        miningActivated: "NFT Mining Activated!",
        miningActivatedDescription: "You are now earning points. Keep interacting to unlock more badges!",
        badgeGallery: "Badge Gallery",
        badges: "Badges",
        miningActivities: "Mining Activities",
        activityShareCatalog: "Share a catalog item",
        activityShareWebsite: "Share HostVoucher.com on social media",
        activityFollowSocial: "Follow our social media accounts",
        activityEngageSocial: "Like/Retweet/Comment on our posts",
        specialBadgeTitle: "Unlock Special Badges",
        specialBadgeDescription: "Certain actions grant you exclusive, high-value badges!",
        proofOfPurchaseTitle: "Proof of Purchase Badge",
        proofOfPurchaseDescription: "Submit proof that you have purchased a service and left a review to earn an exclusive badge and a huge point bonus!",
        submitProofButton: "Submit Proof of Purchase",
        badgeStore: "Badge Store",
        badgeStoreDescription: "Purchase badges with your points to accelerate your mining rate!",
        nftShowcaseTitle: "NFT Showcase",
        nftShowcaseDescription: "Got an NFT from us? Showcase it here! Link your NFT from a marketplace like OpenSea.",
        submitNftButton: "Submit Your NFT",
        submitTestimonialTitle: "Submit Your Testimonial",
        submitTestimonialDescription: "Share your positive experience with our community. Your feedback helps others make great decisions!",
        submitTestimonialButton: "Submit Testimonial",
        faqs: {
            "request": [
                { q: "What is the true purpose of this 'gamification' system?", a: "Let us be direct. This is not a game. It is a meritocracy. We are not offering 'rewards'; we are identifying and cultivating future market leaders. The points, the badges, the NFTs—they are instruments to measure ambition, execution, and influence. We seek partners, not just customers. This system is designed to find them." },
                { q: "How does my participation create a 'legacy'?", a: "A legacy is not built by what you own, but by what you create. Every digital asset you build on a foundation secured through HostVoucher—be it a startup, an e-commerce store, a blog, a creative portfolio—is a new node in the economy. It is a potential employer. It is a new stream of value in a marketplace. By choosing a superior foundation, you are not merely building a website; you are forging the first link in a chain of economic opportunity that extends far beyond yourself." },
                { q: "You speak of creating 'new businesses' and 'jobs'. Isn't that an exaggeration for a hosting deals site?", a: "It is a statement of causality, not a marketing claim. A business cannot exist in the modern world without a digital presence. A slow, unreliable, or insecure presence is a terminal diagnosis. By providing access to elite, high-performance infrastructure at a strategic entry point, we remove the single greatest technical barrier to entry. We give a new venture the speed and stability it needs to survive its critical early stages. A surviving venture grows. A growing venture hires. That is not an exaggeration; it is the mechanism of the modern economy. We provide the engine." },
                { q: "What is the tangible impact of choosing HostVoucher over a competitor?", a: "The impact is the difference between a tool and a weapon. A competitor gives you a tool—a server, a domain. HostVoucher provides a weapon system. Our curated deals ensure you are over-equipped and under-budgeted, granting you a strategic advantage in capital efficiency. Your competitors must spend more for less performance, a slow bleed on their resources. This efficiency is your first victory. It allows you to reallocate capital to marketing, to product development, to talent—the areas that lead to market domination. The impact is not just a faster website; it is a fundamental shift in the balance of power in your favor." },
                { q: "What do you truly get out of this? What is HostVoucher's end game?", a: "Our success is inextricably linked to yours. We operate on a simple, ruthless principle: we are more profitable when our clients dominate their markets, not merely when they pay their monthly invoices. A client who fails is a liability. A client who builds an empire becomes a long-term strategic partner, a testament to our judgment, and a source of recurring revenue. Our end game is to build a portfolio of winners. Your success is the only metric we care about." }
            ],
            "home": [
                { q: "Why is your brand named \"HostVoucher\"? What does that mean for me?", a: "Our name is our contract with you. \"Hosting\" is the arena, but the \"Voucher\" is your key. This isn't a cheap discount voucher. This is the Voucher you hold for a guaranteed outcome:  <ul class='list-disc list-inside mt-2 space-y-1'><li>A Voucher for Speed: Priority access to the fastest infrastructure.</li><li>A Voucher for Security: Your ticket to an impenetrable digital fortress.</li><li>A Voucher for Success: Your claim to outperform your competitors.</li></ul>When you buy from us, you aren't just paying for a service. You are investing in a guaranteed result." },
                { q: "I'm serious about growing my business. How is HostVoucher the only logical, strategic choice?", a: "Serious people don't gamble. They make calculated investments. Let's do the math: <ul class='list-disc list-inside mt-2 space-y-1'><li><b>Shaky Ground vs. Solid Concrete:</b> Other hosts are shaky ground—slow sites, frequent downtime, weak security. That’s a formula for losing money and trust. HostVoucher is your concrete foundation. We guarantee uptime and speed, so you can focus on building your empire, not putting out fires.</li><li><b>Hidden Costs vs. Smart Investment:</b> Competitors lure you with cheap prices, then bleed you with hidden fees and the high cost of poor performance. Every dollar you invest with HostVoucher is an investment in your ROI through higher conversions, better SEO rankings, and a rock-solid brand reputation.</li><li><b>The Amateur's Choice vs. The Professional's Decision:</b> Strategically, choosing an inferior host to save a few dollars is a fatal short-term decision. Market leaders understand this. They choose tools that grant an unfair advantage. The choice is yours: be an amateur, or be a professional.</li></ul>" },
                { q: "You offer Web Hosting, WordPress Hosting, and Cloud Hosting. How do I choose the right weapon to win?", a: "A master strategist never uses the same weapon for every battle. We provide the complete arsenal; you choose based on your tactics: <ul class='list-disc list-inside mt-2 space-y-1'><li><b>Web Hosting (The Versatile Infantry):</b> This is the foundation of power. Strong, flexible, and ruthlessly reliable for any mission, from a corporate site to a new online store. Choose this to begin your conquest.</li><li><b>WordPress Hosting (The Elite Special Forces):</b> If your primary weapon is WordPress, this is your elite unit. An environment obsessively engineered, fortified, and accelerated specifically for WordPress. No more guesswork, just pure performance. Choose this if you demand the fastest WordPress site.</li><li><b>Cloud Hosting (The Superior Air Force):</b> For when you need limitless scale and power. When a massive traffic spike hits, our Cloud Hosting adapts instantly. The word \"downtime\" doesn't exist here. Choose this if you're planning for massive growth and you do not accept failure.</li></ul>" },
                { q: "What is a Domain, and why should I secure it through HostVoucher?", a: "A domain is your digital real estate. It's the name of your empire. You can buy it anywhere, but securing it with HostVoucher is the difference between leaving it on a store display and locking it in a bank vault. We provide our HV-Shield™ privacy protection for free to hide your data from thieves and spammers—a service others charge for. We're not just selling you a name; we're protecting your most valuable asset." },
                { q: "In a digital world full of spies, how is the HostVoucher VPN my shield?", a: "A standard VPN just hides your IP address. The HostVoucher VPN is your strategic invisibility cloak. It allows you to: <ul class='list-disc list-inside mt-2 space-y-1'><li><b>Scout the Competition:</b> Conduct global market research without geographic restrictions. See the ads and prices they show in other countries.</li><li><b>Secure Your Operations:</b> Encrypt your data on public Wi-Fi, shielding your financial and strategic information from hackers.</li><li><b>Achieve Total Freedom:</b> Access information and tools from around the world without censorship. This isn't a tool for entertainment. This is an intelligence and security tool for smart business owners.</li></ul>" },
                { q: "I already have a website. Isn't migrating a hassle and a risk?", a: "\"Hassle\" is the price you pay for being in the wrong place. \"Risk\" is staying with your current host that is actively holding you back. We eliminate both. Our \"White-Glove\" migration team will move your entire digital operation to our platform with surgical precision—zero downtime, zero cost, zero stress for you. Just sit back and prepare for superior performance. Consider it a strategic evacuation to a more powerful position." },
                { q: "I see HostVoucher offers \"Promotional Vouchers.\" Are these just regular discounts?", a: "No. Discounts are for clearance items. Our Promotional Vouchers are an invitation. They are a limited-time, strategic opportunity we extend to future market leaders (like you) to experience our elite technology at a lower entry cost. We invest in you early, because we are confident that once you feel the power of our platform, you will become a long-term partner. This isn't a sales tactic; it's a recruitment." },
                { q: "Is there a guarantee? How do I know my investment won't be wasted?", a: "We don't offer a weak \"guarantee.\" We offer the HostVoucher Iron-Clad Pact. Within 30 days, if you do not feel a significant increase in speed, a tangible improvement in security, and the backing of a more responsive support team, we will refund your investment in full. We can make this offer because we know our platform delivers. The risk is on us; the reward is on you. It's the most unfair offer you'll find—for our competitors." }
            ],
            "web-hosting": [
                { q: "What is web hosting?", a: "Web hosting is the engine of your website. It's the service that stores all your website files and makes them instantly accessible to visitors worldwide. At HostVoucher, we take the guesswork out of the equation by curating the best, most cost-effective hosting deals, empowering you to launch your online presence with confidence and maximum savings." },
                { q: "How do I migrate to a new hosting provider?", a: "Migrating is simpler than ever! The elite providers featured on HostVoucher typically offer complimentary, automated migration tools. Just select a superior deal through us, and their expert support team will ensure a smooth, seamless transition, often handling all the technical work for you." },
                { q: "How do I purchase hosting?", a: "It's a streamlined process. Browse the exclusive hosting deals on HostVoucher, click 'Secure This Deal' on the plan that fits your vision, and you'll be fast-tracked to the provider's checkout page with your discount automatically applied. It’s the smartest, most efficient way to get started online." },
                { q: "Why does my offline business need a website?", a: "In today's digital-first economy, a website is your 24/7 global storefront, attracting thousands of potential customers far beyond your local vicinity. It builds immense credibility, showcases your expertise, and unlocks new revenue streams. With the unbeatable hosting deals on HostVoucher, establishing a professional online presence has never been more affordable or crucial." },
                { q: "Is hosting rented or purchased?", a: "Hosting is a subscription service, paid monthly or annually. This is a strategic advantage as it eliminates large upfront hardware costs and ensures the provider manages all server maintenance, security, and updates. HostVoucher specializes in finding the best subscription deals to maximize your long-term savings." },
                { q: "What's the difference between a server and hosting?", a: "Think of a server as the powerful physical computer, and hosting as the service of 'renting' a portion of that server's resources. HostVoucher focuses on finding you the best hosting deals, so you get all the power of a world-class server without the massive cost and complexity of owning one." },
                { q: "What's the difference between a domain and hosting?", a: "A domain is your website's address (e.g., YourBusiness.com), while hosting is the 'house' where your website's files 'live'. You need both. Many hosting packages on HostVoucher conveniently include a free domain for the first year, providing exceptional initial value." },
                { q: "Can I upgrade my hosting package?", a: "Absolutely. All providers we partner with offer seamless upgrade paths. As your business grows, you can instantly scale up your plan. Starting with an affordable, powerful deal from HostVoucher means you have more budget to invest in growth before needing an upgrade." },
                { q: "Are the hosting prices inclusive of tax?", a: "Prices shown are typically pre-tax. The final price, including any applicable taxes, will be clearly displayed on the provider's checkout page before you commit. Clicking our 'Secure This Deal' links ensures you always see the most accurate, up-to-date pricing." },
                { q: "Why should I use web hosting?", a: "To be visible on the internet, you need web hosting. It ensures your site is fast, secure, and always online for your customers. Using HostVoucher to find your provider guarantees you're getting a reliable, high-performance service at the best possible price on the market." },
            ],
            "wordpress-hosting": [
                 { q: "Why choose WordPress hosting?", a: "WordPress hosting is a high-performance solution specifically engineered for WordPress. It guarantees superior speed, enhanced security, and seamless ease-of-use. Plans often include one-click installations, automatic updates, and specialized expert support, making it the definitive choice for any serious WordPress site owner. With HostVoucher, you're not just getting hosting; you're getting a launchpad for your WordPress success at an unmatched value." },
                 { q: "Is WordPress hosting optimized for performance?", a: "Absolutely! WordPress hosting from our premier partners, hand-picked by HostVoucher, is meticulously optimized for the platform. This means lightning-fast load times, seamless user experiences, and robust backend efficiency, all designed to give your WordPress site an unparalleled edge." },
                 { q: "What security features does WordPress hosting offer?", a: "Our featured WordPress hosting providers offer an impenetrable fortress of security. Expect automatic malware scanning, robust firewalls, DDoS protection, and free SSL certificates, safeguarding your site from threats. HostVoucher ensures you get enterprise-grade security without the enterprise price tag." },
                 { q: "Can I use an existing domain with WordPress hosting?", a: "Yes, integrating your existing domain is effortless! All WordPress hosting deals on HostVoucher support easy domain mapping, ensuring your brand identity remains consistent while leveraging our partners' superior hosting infrastructure. Your online presence, amplified." },
                 { q: "Does it include one-click WordPress installation?", a: "Indeed! Every WordPress hosting plan you find through HostVoucher simplifies your journey with one-click WordPress installation. This means you can launch your powerful, feature-rich website in minutes, not hours, allowing you to focus on content creation, not technical setup." },
                 { q: "Will my WordPress site be automatically updated?", a: "Many premium WordPress hosting plans available via HostVoucher include automatic WordPress core and plugin updates. This ensures your site always runs on the latest, most secure versions, freeing you from manual maintenance and keeping your digital asset future-proof." },
                 { q: "What kind of support is available for WordPress hosting?", a: "When you choose a WordPress hosting deal from HostVoucher, you gain access to dedicated WordPress experts from our esteemed partners. They offer 24/7 specialized support, ensuring any WordPress-specific query or challenge is resolved swiftly and efficiently, keeping your site running flawlessly." },
                 { q: "Is WordPress hosting scalable for growth?", a: "Absolutely! WordPress hosting solutions from HostVoucher's curated list are designed with scalability in mind. As your audience expands, you can effortlessly upgrade your resources, ensuring your website always performs optimally, even during peak traffic. Grow with confidence, powered by HostVoucher's value." },
                 { q: "What's the difference between shared and WordPress hosting?", a: "While shared hosting is general-purpose, WordPress hosting is specifically engineered for WordPress. It offers optimized servers, enhanced security, and specialized tools crucial for peak WordPress performance. HostVoucher brings you the best of these specialized solutions for superior results." },
                 { q: "Can I host multiple WordPress websites on one plan?", a: "Many of the WordPress hosting plans highlighted on HostVoucher offer the flexibility to host multiple WordPress websites. This provides incredible value and convenience for agencies, developers, or anyone managing several online ventures, all under one powerful, cost-effective umbrella." },
                 { q: "Is a free domain included with WordPress hosting?", a: "A fantastic benefit! Many premium WordPress hosting deals secured by HostVoucher include a **free domain registration** for the first year. This is just one more way HostVoucher delivers unbeatable value, empowering you to establish your online brand with zero initial domain cost." },
                 { q: "What is a staging environment in WordPress hosting?", a: "A staging environment, often included in advanced WordPress hosting plans from our partners, allows you to test changes, updates, or new features on a clone of your live site without affecting visitors. This ensures a seamless, error-free deployment and is a testament to the professional-grade tools HostVoucher brings to you." },
            ],
             "cloud-hosting": [
                { q: "What is Cloud Hosting?", a: "Cloud Hosting represents the pinnacle of modern hosting technology. Instead of being confined to a single server, your website leverages a vast, interconnected network of servers. This architecture provides unparalleled reliability (no downtime from a single point of failure), incredible scalability (instantly adapting to traffic surges), and peak performance. It's the ultimate solution for ambitious, growing businesses, and HostVoucher brings you the most competitive deals to power your enterprise." },
                { q: "Is Cloud Hosting difficult to manage?", a: "Not at all. The world-class providers featured on <strong>HostVoucher</strong> equip you with intuitive, user-friendly control panels and often offer fully managed services. This makes managing the immense power of the cloud as simple as standard hosting, giving you a significant competitive advantage without the complexity. Focus on your vision; let the cloud handle the heavy lifting." },
                { q: "What makes Cloud Hosting superior to traditional hosting?", a: "Cloud Hosting, especially the premium options available through <strong>HostVoucher</strong>, offers superior flexibility, scalability, and uptime. Unlike traditional hosting, resources are drawn from a network of servers, meaning no single point of failure and instantaneous resource allocation to handle any traffic spike, guaranteeing your site is always available and fast." },
                { q: "Is Cloud Hosting suitable for small businesses?", a: "Yes, even small businesses can greatly benefit from the advantages of Cloud Hosting, particularly with the value-driven deals from <strong>HostVoucher</strong>. Its scalability means you only pay for the resources you need, making it a cost-effective solution that grows with your business, without requiring a large upfront investment." },
                { q: "How does Cloud Hosting improve website performance?", a: "Cloud Hosting significantly boosts performance by distributing your website's load across multiple servers. This minimizes latency, improves global reach, and ensures lightning-fast page load times, essential for SEO and user experience. With deals from <strong>HostVoucher</strong>, your website will soar above the competition." },
                { q: "What are the security benefits of Cloud Hosting?", a: "Cloud Hosting, when chosen from our top-tier partners on <strong>HostVoucher</strong>, offers multi-layered security. Data is often replicated across multiple servers, minimizing the risk of loss, and advanced network security measures protect against cyber threats, providing peace of mind for your valuable online assets." },
                { q: "Can I scale my Cloud Hosting resources easily?", a: "Effortless scalability is a core advantage of Cloud Hosting, and our partners excel at this. Through <strong>HostVoucher</strong>, you can find plans that allow you to instantly increase or decrease CPU, RAM, and storage with just a few clicks, ensuring your resources always precisely match your demand, optimizing both cost and performance." },
                { q: "Does Cloud Hosting support different operating systems?", a: "Yes, flexibility is key! The top Cloud Hosting providers available through <strong>HostVoucher</strong> offer support for a wide range of operating systems, including various Linux distributions and Windows Server. This empowers you to choose the environment that best suits your application and development preferences." },
                { q: "Are data backups included with Cloud Hosting?", a: "Robust data backup solutions are standard with the Cloud Hosting plans featured on <strong>HostVoucher</strong>. Many providers offer automatic daily or weekly backups and easy restoration options, ensuring your data is always secure and recoverable, protecting your business from unforeseen events." },
                { q: "What kind of support can I expect with Cloud Hosting?", a: "Our premier Cloud Hosting partners provide premium, expert support around the clock. Whether you're a beginner or an advanced user, their dedicated teams are available 24/7 to assist with technical queries, server management, and optimization, ensuring your cloud environment on <strong>HostVoucher</strong> is always performing at its peak." },
                { q: "How does billing for Cloud Hosting work?", a: "Cloud Hosting often utilizes a 'pay-as-you-go' or resource-based billing model, offering transparency and cost-efficiency. With <strong>HostVoucher</strong>, you'll find clear pricing structures for various tiers, ensuring you understand exactly what you're paying for and allowing you to budget effectively for your advanced hosting needs." },
                { q: "Can I migrate my existing website to Cloud Hosting?", a: "Absolutely! Migrating your existing website to a superior Cloud Hosting environment is seamless with the providers found on <strong>HostVoucher</strong>. Many offer complimentary migration services, or intuitive tools, ensuring a smooth transition with minimal downtime, so you can quickly harness the power of the cloud." },
            ],
            vps: [
                { q: "What is a VPS?", a: "A Virtual Private Server (VPS) is the strategic upgrade from shared hosting. It provides a dedicated private slice of a server, giving you vastly greater power, granular control, and robust flexibility for your growing website or application—all without the high cost of a dedicated physical server. HostVoucher is your source for the most competitive VPS deals on the market." },
                { q: "What is a Cloud VPS?", a: "A Cloud VPS enhances the traditional VPS model by distributing resources across a 'cloud' of multiple physical servers. This provides superior reliability and seamless scalability. The best Cloud VPS providers, offering this advanced infrastructure, are all featured on HostVoucher." },
                { q: "Is renting a Cloud VPS cheaper than building a server?", a: "Emphatically, yes. Building and maintaining your own server involves massive upfront hardware costs, plus ongoing expenses for power, cooling, security, and IT staff. Renting a Cloud VPS through a HostVoucher deal gives you enterprise-grade power for a low, predictable monthly cost." },
                { q: "What is a Managed Cloud VPS?", a: "A Managed Cloud VPS is the ultimate hassle-free, premium solution. The hosting provider handles all the complex technical work—security hardening, patching, updates, and server maintenance—so you can focus 100% on growing your business. We highlight the best managed deals on HostVoucher for entrepreneurs who value their time and peace of mind." },
                { q: "Managed VPS vs. Managed Cloud VPS?", a: "The key difference is the underlying infrastructure. A Managed VPS is a managed service on a single server, whereas a Managed Cloud VPS provides the same white-glove management but with the superior reliability and on-demand scalability of a cloud infrastructure. Explore both options on HostVoucher to see which best fits your strategic goals." },
            ],
            vpn: [
                { q: "What is a VPN?", a: "A Virtual Private Network (VPN) is your private key to a secure, unrestricted internet. It encrypts your entire online connection, shielding your sensitive data from hackers on public Wi-Fi, while masking your IP address to ensure total privacy and the freedom to access global content. HostVoucher secures the best VPN deals, making premium digital protection accessible to everyone." },
                { q: "How do I subscribe to a VPN?", a: "It's effortless. Simply browse our roster of trusted VPN providers, select a deal that catches your eye, and click 'Secure This Deal'. You'll be taken to their site to complete your subscription at an exclusive discounted rate, secured through HostVoucher." },
                { q: "How much does a VPN cost?", a: "VPN costs vary, but long-term plans offer the best value. Through HostVoucher, you can find exclusive deals starting from just a few dollars per month—an incredibly small price for complete online security and digital freedom." },
                { q: "How do I upgrade my plan?", a: "All top-tier VPN providers we feature offer simple upgrade paths within your user account on their website. If your needs grow and you require more features, an upgrade is just a few clicks away." },
                { q: "Do VPNs accept PayPal?","a":"Yes, the vast majority of our trusted VPN partners, like ExpressVPN and NordVPN, accept PayPal along with major credit cards and other secure payment methods. You can confirm all options on their checkout page after clicking our deal link." },
                { q: "How to choose a VPN provider?","a":"Look for strong encryption (AES-256), a strict and audited no-logs policy, a vast global server network, and fast connection speeds. We've done the hard work by curating only the top providers on HostVoucher that excel in all these critical areas." },
                { q: "What is the most important thing in a VPN?", a: "Trust. The single most important factor is the provider's unwavering commitment to your privacy, proven by a strict, independently audited no-logs policy and a robust security architecture. Every provider on HostVoucher is selected with this trust factor as our top priority." },
                { q: "Is it legal to use a VPN?", a: "In most countries, using a VPN for privacy and security is completely legal and a smart digital practice. Just remember that any activity that's illegal without a VPN is still illegal with one." },
                { q: "Why choose a paid VPN over a free one?", a: "Free VPNs often come with a hidden price: slow speeds, strict data caps, and, most alarmingly, the potential selling of your browsing data. A premium paid VPN, especially when secured through a HostVoucher deal, guarantees top-tier speeds, unlimited bandwidth, and an unshakeable commitment to your privacy and security." },
                { q: "Can a VPN bypass censorship?", a: "Yes, this is one of its most powerful capabilities. By connecting to a server in another country, a VPN can help you bypass local internet restrictions and access a truly unrestricted, global internet." },
                { q: "What devices do top VPNs support?","a":"Leading providers like those featured on HostVoucher support almost every device imaginable: Windows, macOS, Android, iOS, Linux, routers, smart TVs, and more. A single subscription often covers simultaneous use on multiple devices." },
                { q: "Should I use a VPN when traveling?","a":"Absolutely—it's essential for modern travel. A VPN keeps your connection secure on untrusted hotel or airport Wi-Fi and allows you to access your favorite home content and services as if you never left." },
            ],
            domain: [
                { q: "What is a domain?", a: "A domain is your unique, memorable address on the internet (like 'YourBrand.com'). It's the first step to building a professional online identity, and with HostVoucher, you can find fantastic deals on both the domain and the hosting to bring it to life." },
                { q: "Why do you need a domain?", a: "A custom domain name makes your business look professional, builds brand credibility, and is far easier for customers to remember than a social media handle. It's a critical asset for any serious business." },
                { q: "What can be done after buying a domain?", a: "Once you own a domain, you can connect it to a website, create professional email addresses (like 'you@YourBrand.com'), and build the central hub for your brand online. Many hosting packages on HostVoucher even include a free domain to get you started." },
                { q: "How to check domain availability?", a: "Simply use the search function on any of our featured domain registrar partners. After clicking a deal on HostVoucher, you'll be taken to their site where you can instantly check if your desired name is available." },
                { q: "What are the requirements to register a domain name?", a: "For most common extensions like .com, all you need is valid contact information. It's a quick and straightforward process that our partners have streamlined." },
                { q: "What are the tips for a good domain name?", a: "Keep it short, easy to spell, and memorable. Try to include keywords related to your business. A .com is usually the best choice for global appeal. Get creative and check availability through a deal on HostVoucher." },
                { q: "What if the desired domain is not available?", a: "Don't worry! Try a different extension (like .net or .co), add a relevant word (e.g., 'get', 'store'), or use a thesaurus for creative alternatives. The perfect name is out there!" },
                { q: "How long is a domain active?", a: "You register a domain for a set period, typically one year or more. You must renew it before it expires to keep it. Many registrars on HostVoucher offer multi-year discounts for even greater savings." },
                { q: "Do I get full rights & access to the domain I bought?", a: "Yes. When you register a domain through one of our trusted partners, you are the sole owner and have full control over its settings (DNS) as long as you keep the registration active." },
                { q: "Are domain prices tax-inclusive?", a: "Listed prices are generally pre-tax. The final price, including any applicable taxes and mandatory ICANN fees, will be clearly shown at checkout. Our deals ensure you get the lowest possible base price." },
                { q: "How to renew a domain?", a: "Renewal is easy through your account dashboard on the registrar's website. We recommend setting up auto-renewal to ensure you never accidentally lose your valuable domain name." },
                { q: "What is a domain transfer?", a: "A domain transfer is the process of moving your domain from one registrar to another. People do this to consolidate their domains or to take advantage of better pricing and features—like the ones you find on HostVoucher." },
                { q: "What are the requirements for a domain transfer?", a: "Generally, the domain must be at least 60 days old, unlocked at your current registrar, and you'll need an authorization code (EPP code) from them. The process is straightforward." },
                { q: "Which domains can be transferred?", a: "Most common domain extensions like .com, .net, .org, and many more can be easily transferred. Our partners offer seamless transfer services." },
                { q: "What is a .COM domain?", a: ".COM is the most recognized and sought-after domain extension in the world. It signifies a commercial entity and carries a sense of global trust and authority." },
                { q: "What are the benefits of a .COM domain?", a: "It's the gold standard. A .COM domain is instantly credible, easy for customers to remember, and great for SEO. It's the premier choice for any serious business, and we feature the best .COM deals on HostVoucher." },
                { q: "How to check an active website domain?", a: "You can use a 'WHOIS lookup' tool, available for free on many sites. It provides public registration information about a domain, such as the registrar and registration dates." },
            ],
            coupons: [
                { q: "How do I use HostVoucher's coupon codes?", a: "We've made it effortless. Simply find a deal you love on HostVoucher and click 'View Offer' or 'Copy Coupon'. Our intelligent system often applies the discount for you automatically. If a code is copied, just paste it into the promo box at the provider's checkout. Maximum savings are always just a click away." },
                { q: "Can a coupon be used once or multiple times?","a": "This depends on the provider's terms. Most coupons are for one-time use, especially for new customers, to give you the best possible start. The goal is to lock in the lowest price for your initial purchase, which you can find right here on HostVoucher." },
                { q: "Can coupon codes be combined with other codes?", a: "Generally, providers allow only one coupon code per transaction. The great news is that HostVoucher always strives to feature the single best deal available, ensuring you get the maximum possible discount without needing to stack." },
                { q: "What are the latest coupons available?", a: "You're in the right place! This page is constantly updated by our team to bring you the freshest, most valuable deals. The offers you see right now are the latest ones we've secured for the HostVoucher community." },
                { q: "Are coupons valid forever?", a: "The best deals are, by nature, time-sensitive. We always display expiration dates when provided by our partners. To avoid missing out on significant savings, we highly recommend securing any deal you like as soon as you see it. On HostVoucher, opportunity favors the decisive." },
                { q: "How do I get domain & hosting coupons?", a: "Right here on HostVoucher! We are your dedicated source for the best coupons. Bookmark this page and subscribe to our newsletter (at the bottom of the page) to have the hottest deals delivered directly to you." },
                { q: "Are there coupons for migrating hosting?", a: "While there aren't specific 'transfer' coupons, the massive discounts for new customers on HostVoucher are usually far better! You save much more by using our new customer offers, and many hosts even offer free migration to make the switch seamless." },
                { q: "How long will this coupon last?", a: "Each coupon has a different lifespan set by the provider. The most effective strategy is to act fast. If a deal looks good, it's best to secure it. Explore the offers now and lock in your savings." },
                { q: "Will I get the coupon price again on renewal?", a: "Promotional prices are typically for the initial subscription term. This is why the smartest strategy is to lock in the longest term possible (e.g., 2-4 years) through a HostVoucher link. This maximizes your savings and secures our exclusive low rate for years to come, protecting you from future price increases." },
            ],
        },
        popularBrandsTitle: "Popular Stores",
        newsletterTitle: "Join Our Newsletter!",
        newsletterDescription: "Get the latest deals, discounts, and voucher codes in your inbox by subscribing with your E-mail.",
        subscribe: "Subscribe",
        editorProfileTitle: "Meet Our Specialist",
        editorProfileDescription: "Satoshi is the editor for HostVoucher, always ensuring the promo codes on our pages are the best and most up-to-date verified offers for smarter online shopping.",
        hostingMegaMenuTitle: "Unlock Your Digital Potential",
        hostingMegaMenuDescription: "From lightning-fast web hosting to robust cloud solutions, find the perfect foundation for your website. We deliver the best deals from trusted providers.",
        webHostingMegaMenuDesc: "Affordable and reliable plans for new projects.",
        cloudHostingMegaMenuDesc: "Scalable power for growing businesses.",
        wordpressHostingMegaMenuDesc: "Optimized for speed and security on WordPress."
    }
};

export const currencyData = [
    { country: 'Argentina', lang: 'Español', code: 'ARS', symbol: 'ARS$', key: 'ARS' },
    { country: 'Brasil', lang: 'Português', code: 'BRL', symbol: 'R$', key: 'BRL' },
    { country: 'Colombia', lang: 'Español', code: 'COP', symbol: 'COP$', key: 'COP' },
    { country: 'Česko', lang: 'Čeština', code: 'CZK', symbol: 'Kč', key: 'CZK' },
    { country: 'Danmark', lang: 'Dansk', code: 'DKK', symbol: 'kr.', key: 'DKK' },
    { country: 'Deutschland', lang: 'Deutsch', code: 'EUR', symbol: '€', key: 'EUR-DE' },
    { country: 'Eesti', lang: 'Eesti', code: 'EUR', symbol: '€', key: 'EUR-EE' },
    { country: 'Ελλάδα', lang: 'Ελληνικά', code: 'EUR', symbol: '€', key: 'EUR-GR' },
    { country: 'España', lang: 'Español', code: 'EUR', symbol: '€', key: 'EUR-ES' },
    { country: 'France', lang: 'Français', code: 'EUR', symbol: '€', key: 'EUR-FR' },
    { country: 'Hrvatska', lang: 'Hrvatski', code: 'EUR', symbol: '€', key: 'EUR-HR' },
    { country: 'India', lang: 'English', code: 'INR', symbol: '₹', key: 'India-INR' },
    { country: 'भारत', lang: 'हिंदी', code: 'INR', symbol: '₹', key: 'भारत-INR' },
    { country: 'Southeast Asia', lang: 'English', code: 'USD', symbol: '$', key: 'USD-SEA' },
    { country: 'Italia', lang: 'Italiano', code: 'EUR', symbol: '€', key: 'EUR-IT' },
    { country: 'Japan', lang: '日本語', code: 'JPY', symbol: '¥', key: 'JPY' },
    { country: 'Latvija', lang: 'Latviešu', code: 'EUR', symbol: '€', key: 'EUR-LV' },
    { country: 'Lietuva', lang: 'Lietuvių', code: 'EUR', symbol: '€', key: 'EUR-LT' },
    { country: 'Magyarország', lang: 'Magyar', code: 'HUF', symbol: 'Ft', key: 'HUF' },
    { country: 'Malaysia', lang: 'English', code: 'MYR', symbol: 'RM', key: 'MYR' },
    { country: 'México', lang: 'Español', code: 'MXN', symbol: 'MXN$', key: 'MXN' },
    { country: 'Nederland', lang: 'Nederlands', code: 'EUR', symbol: '€', key: 'EUR-NL' },
    { country: 'Norge', lang: 'Norsk', code: 'NOK', symbol: 'kr', key: 'NOK' },
    { country: 'Pakistan', lang: 'English', code: 'PKR', symbol: '₨', key: 'PKR' },
    { country: 'Philippines', lang: 'English', code: 'PHP', symbol: '₱', key: 'PHP' },
    { country: 'Polska', lang: 'Polski', code: 'PLN', symbol: 'zł', key: 'PLN' },
    { country: 'Portugal', lang: 'Português', code: 'EUR', symbol: '€', key: 'EUR-PT' },
    { country: 'România', lang: 'Română', code: 'RON', symbol: 'lei', key: 'RON' },
    { country: 'Slovensko', lang: 'Slovenčina', code: 'EUR', symbol: '€', key: 'EUR-SK' },
    { country: 'Suomi', lang: 'Suomi', code: 'EUR', symbol: '€', key: 'EUR-FI' },
    { country: 'Sverige', lang: 'Svenska', code: 'SEK', symbol: 'kr', key: 'SEK' },
    { country: 'Türkiye', lang: 'Türkçe', code: 'TRY', symbol: '₺', key: 'TRY' },
    { country: 'Україна', lang: 'Українська', code: 'UAH', symbol: '₴', key: 'UAH' },
    { country: 'United Kingdom', lang: 'English', code: 'GBP', symbol: '£', key: 'GBP' },
    { country: 'United States', lang: 'English', code: 'USD', symbol: '$', key: 'USD' },
    { country: 'Việt Nam', lang: 'Tiếng Việt', code: 'VND', symbol: '₫', key: 'VND' },
    { country: 'الدول العربية', lang: 'العربية', code: 'SAR', symbol: 'ر.س', key: 'SAR' },
    { country: 'יִשְׂרָאֵל', lang: 'עברית', code: 'ILS', symbol: '₪', key: 'ILS' },
    { country: 'ประเทศไทย', lang: 'ไทย', code: 'THB', symbol: '฿', key: 'THB' },
    { country: '대한민국', lang: '한국어', code: 'KRW', symbol: '₩', key: 'KRW' },
    { country: '中国', lang: '中文', code: 'CNY', symbol: '¥', key: 'CNY' },
];

export const badgeTiers: any = {
    daily: [
        { name: 'Daily Bronze', price: 10000000, Icon: 'Medal', color: 'text-amber-700', bg: 'bg-amber-700/10' },
        { name: 'Daily Silver', price: 25000000, Icon: 'Medal', color: 'text-slate-400', bg: 'bg-slate-400/10' },
        { name: 'Daily Gold', price: 50000000, Icon: 'Medal', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Daily Platinum', price: 100000000, Icon: 'Medal', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { name: 'Daily Diamond', price: 200000000, Icon: 'Medal', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { name: 'Daily Master', price: 350000000, Icon: 'Medal', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { name: 'Daily Grandmaster', price: 500000000, Icon: 'Medal', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { name: 'Daily Champion', price: 750000000, Icon: 'Medal', color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { name: 'Daily Legend', price: 1000000000, Icon: 'Medal', color: 'text-red-500', bg: 'bg-red-500/10' },
        { name: 'Daily God', price: 1500000000, Icon: 'Medal', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    ],
    monthly: [
        { name: 'Monthly Iron Trophy', price: 100000000, Icon: 'Trophy', color: 'text-slate-500', bg: 'bg-slate-500/10' },
        { name: 'Monthly Bronze Trophy', price: 250000000, Icon: 'Trophy', color: 'text-amber-700', bg: 'bg-amber-700/10' },
        { name: 'Monthly Silver Trophy', price: 500000000, Icon: 'Trophy', color: 'text-slate-400', bg: 'bg-slate-400/10' },
        { name: 'Monthly Gold Trophy', price: 1000000000, Icon: 'Trophy', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Monthly Crystal Trophy', price: 2000000000, Icon: 'Trophy', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { name: 'Monthly Sapphire Trophy', price: 3500000000, Icon: 'Trophy', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Monthly Ruby Trophy', price: 5000000000, Icon: 'Trophy', color: 'text-red-500', bg: 'bg-red-500/10' },
        { name: 'Monthly Emerald Trophy', price: 7500000000, Icon: 'Trophy', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Monthly Obsidian Trophy', price: 10000000000, Icon: 'Trophy', color: 'text-gray-300', bg: 'bg-gray-300/10' },
        { name: 'Legendary Trophy', price: 15000000000, Icon: 'Trophy', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ],
    seasonal: [
        { name: 'Spring Shield', price: 500000000, Icon: 'Shield', color: 'text-green-400', bg: 'bg-green-400/10' },
        { name: 'Summer Crown', price: 1000000000, Icon: 'Crown', color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { name: 'Autumn Rocket', price: 2000000000, Icon: 'Rocket', color: 'text-amber-600', bg: 'bg-amber-600/10' },
        { name: 'Winter Shield', price: 4000000000, Icon: 'Shield', color: 'text-sky-400', bg: 'bg-sky-400/10' },
        { name: 'Sandstorm Crown', price: 6000000000, Icon: 'Crown', color: 'text-yellow-300', bg: 'bg-yellow-300/10' },
        { name: 'Deep Sea Rocket', price: 8000000000, Icon: 'Rocket', color: 'text-blue-600', bg: 'bg-blue-600/10' },
        { name: 'Jungle Shield', price: 10000000000, Icon: 'Shield', color: 'text-lime-500', bg: 'bg-lime-500/10' },
        { name: 'Magma Crown', price: 15000000000, Icon: 'Crown', color: 'text-red-600', bg: 'bg-red-600/10' },
        { name: 'Aurora Rocket', price: 20000000000, Icon: 'Rocket', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
        { name: 'Cosmic Crown', price: 30000000000, Icon: 'Crown', color: 'text-indigo-400', bg: 'bg-indigo-400/10', isEpic: true },
    ],
    yearly: [
        { name: 'Annual Gem', price: 5000000000, Icon: 'Gem', color: 'text-teal-400', bg: 'bg-teal-400/10' },
        { name: 'Annual Sapphire', price: 10000000000, Icon: 'Gem', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Annual Emerald', price: 20000000000, Icon: 'Gem', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Annual Ruby', price: 35000000000, Icon: 'Gem', color: 'text-red-500', bg: 'bg-red-500/10' },
        { name: 'Annual Amethyst', price: 50000000000, Icon: 'Gem', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Annual Topaz', price: 75000000000, Icon: 'Gem', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { name: 'Annual Opal', price: 100000000000, Icon: 'Gem', color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { name: 'Black Diamond Annual', price: 150000000000, Icon: 'Gem', color: 'text-slate-300', bg: 'bg-slate-300/10' },
        { name: 'Rainbow Diamond Annual', price: 200000000000, Icon: 'Gem', color: 'text-cyan-300', bg: 'bg-cyan-300/10' },
        { name: 'Eternal Gem', price: 300000000000, Icon: 'Gem', color: 'text-rose-400', bg: 'bg-rose-400/10', isEpic: true },
    ],
    special: [
        { name: 'Screenshot Contributor', id: 'screenshot_contributor', icon: 'ImageIcon', points: 25000000, color: 'text-green-400', bg: 'bg-green-400/10', description: 'Submits proof of purchase and usage.' },
        { name: 'Loyal Reviewer', id: 'loyal_reviewer', icon: 'Star', points: 2500, color: 'text-yellow-400', bg: 'bg-yellow-400/10', description: 'Provides a rating after using a service.' }
    ]
};
