const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const HOMEPAGE_URL = 'http://localhost:1313/';
const SCREENSHOT_DIR = path.join(__dirname, 'portal_test_screenshots');

// Create screenshot directory
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function testPortalAnimation() {
    console.log('🚀 Starting Portal Animation Test...\n');

    const browser = await puppeteer.launch({
        headless: false, // Show browser so you can see what happens
        slowMo: 50,      // Slow down so we can see actions
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();

    // Listen to console messages from the page
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Portal') || text.includes('Button') || text.includes('🌀')) {
            console.log('  📄 Page Console:', text);
        }
    });

    try {
        // Step 1: Go to homepage
        console.log('1️⃣  Navigating to homepage...');
        await page.goto(HOMEPAGE_URL, { waitUntil: 'networkidle2' });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_homepage_loaded.png'), fullPage: false });
        console.log('   ✅ Homepage loaded\n');

        // Step 2: Check battle mode
        console.log('2️⃣  Checking battle mode status...');
        const battleModeDisabled = await page.evaluate(() => {
            return document.body.classList.contains('battle-mode-disabled');
        });

        if (battleModeDisabled) {
            console.log('   ⚠️  BATTLE MODE IS OFF! Turning it on...');
            await page.click('.battle-toggle');
            await new Promise(resolve => setTimeout(resolve, 500));
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_battle_mode_enabled.png'), fullPage: false });
        } else {
            console.log('   ✅ Battle mode is ON\n');
        }

        // Step 3: Find the button
        console.log('3️⃣  Looking for "Start Your Project" button...');
        const button = await page.$('#start-project-btn');

        if (!button) {
            console.error('   ❌ BUTTON NOT FOUND!');
            console.log('   🔍 Checking what buttons exist on page...');

            const buttons = await page.evaluate(() => {
                const btns = document.querySelectorAll('button, a.btn, a[href*="service"]');
                return Array.from(btns).map(b => ({
                    tag: b.tagName,
                    id: b.id,
                    text: b.textContent.trim().substring(0, 50),
                    href: b.href
                }));
            });

            console.log('   Found buttons:', JSON.stringify(buttons, null, 2));
            await browser.close();
            return false;
        }

        console.log('   ✅ Button found!\n');

        // Step 4: Take screenshot before click
        console.log('4️⃣  Taking screenshot before click...');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_before_click.png'), fullPage: false });
        console.log('   ✅ Screenshot saved\n');

        // Step 5: Click button and capture animation
        console.log('5️⃣  Clicking button and capturing animation...');

        // Click the button (don't await navigation yet)
        const clickPromise = button.click();

        // Immediately start capturing screenshots
        const screenshots = [];
        const startTime = Date.now();

        for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms intervals
            const elapsed = Date.now() - startTime;
            const screenshotPath = path.join(SCREENSHOT_DIR, `04_animation_${String(i).padStart(2, '0')}_${elapsed}ms.png`);
            await page.screenshot({ path: screenshotPath, fullPage: false });
            screenshots.push(screenshotPath);

            // Check if portal overlay exists
            const portalExists = await page.evaluate(() => {
                return document.querySelector('.portal-overlay') !== null;
            });

            if (portalExists && i === 5) {
                console.log(`   🌀 PORTAL DETECTED at ${elapsed}ms!`);
            }
        }

        console.log(`   ✅ Captured ${screenshots.length} screenshots\n`);

        // Step 6: Check if portal was created
        console.log('6️⃣  Validating portal animation...');

        // Go back to check what happened
        await page.goto(HOMEPAGE_URL, { waitUntil: 'networkidle2' });

        // Check the CSS to ensure our styles are loaded
        const portalStyles = await page.evaluate(() => {
            const styles = window.getComputedStyle(document.createElement('div'));
            // Check if custom CSS is loaded
            const customCSS = Array.from(document.styleSheets).find(sheet =>
                sheet.href && sheet.href.includes('custom')
            );

            return {
                customCSSLoaded: !!customCSS,
                customCSSHref: customCSS ? customCSS.href : null
            };
        });

        console.log('   CSS Check:', JSON.stringify(portalStyles, null, 2));

        // Check if portal CSS exists in stylesheet
        const portalCSSExists = await page.evaluate(() => {
            const sheets = Array.from(document.styleSheets);
            for (let sheet of sheets) {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    const hasPortalOverlay = rules.some(rule =>
                        rule.selectorText && rule.selectorText.includes('portal-overlay')
                    );
                    const hasPortalRing = rules.some(rule =>
                        rule.selectorText && rule.selectorText.includes('portal-ring')
                    );
                    const hasPortalCore = rules.some(rule =>
                        rule.selectorText && rule.selectorText.includes('portal-core')
                    );

                    if (hasPortalOverlay || hasPortalRing || hasPortalCore) {
                        return {
                            found: true,
                            sheet: sheet.href,
                            hasOverlay: hasPortalOverlay,
                            hasRing: hasPortalRing,
                            hasCore: hasPortalCore
                        };
                    }
                } catch (e) {
                    // CORS issues, skip
                }
            }
            return { found: false };
        });

        console.log('   Portal CSS in Stylesheet:', JSON.stringify(portalCSSExists, null, 2));

        console.log('\n✅ TEST COMPLETE!');
        console.log(`📁 Screenshots saved to: ${SCREENSHOT_DIR}`);
        console.log('👀 Review the screenshots to see what happened!\n');

    } catch (error) {
        console.error('❌ ERROR during test:', error);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'ERROR.png'), fullPage: true });
    } finally {
        console.log('🔍 Keeping browser open for 5 seconds for inspection...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await browser.close();
    }
}

// Run the test
testPortalAnimation().catch(console.error);
