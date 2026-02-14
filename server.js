const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// استفاده از پورت محیطی یا ۳۰۰۰
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // برای دسترسی خارجی در PaaS

// مسیر اصلی المان‌ها
const ELEMENT_DIR = path.join(__dirname, 'elements', 'snap-card');

// =========================================================
// 1. DATA & FILE GENERATION LOGIC (ادغام شده)
// =========================================================
const filesContent = {
    // --- Config ---
    'config.json': JSON.stringify({
        id: "snap_card_v1",
        name: "Snapchat Card",
        skeleton: "skeleton.html",
        styles: "style.css",
        default_data: { title_text: "ADD ME", link_url: "#" },
        slots: {
            background: { title: "Background", folder: "backgrounds" },
            profile: { title: "Profile", folder: "profiles" },
            badge: { title: "Badge", folder: "badges" },
            mascot: { title: "Mascot", folder: "mascots" },
            button: { title: "Button", folder: "buttons" }
        }
    }, null, 2),

    // --- Skeleton ---
    'skeleton.html': `
<div class="snap-wrapper">
  <a href="{{link_url}}" class="snap-card">
    <div id="slot-background" class="slot-layer"></div>
    <div id="slot-badge" class="slot-abs-top"></div>
    <div id="slot-mascot" class="slot-abs-bottom"></div>
    <div class="card-inner-layout">
        <div id="slot-profile" class="slot-box placeholder-white"></div>
        <div class="snap-content"><h2 class="snap-title">{{title_text}}</h2></div>
        <div id="slot-button" class="slot-box placeholder-white"></div>
    </div>
  </a>
</div>`,

    // --- Styles ---
    'style.css': `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap');
.snap-wrapper { display: flex; justify-content: center; width: 100%; padding: 20px; font-family: 'Outfit', sans-serif; box-sizing: border-box; }
.snap-card { position: relative; width: 100%; max-width: 600px; min-height: 110px; border-radius: 20px; display: flex; align-items: center; box-shadow: 0 15px 40px rgba(0,0,0,0.15); transition: 0.2s; overflow: visible !important; background: #f0f0f0; }
.snap-card:hover { transform: translateY(-4px); }
.slot-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; border-radius: 20px; overflow: hidden; }
.card-inner-layout { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0 20px; box-sizing: border-box; }
.snap-content { flex-grow: 1; text-align: center; }
.snap-title { font-size: 18px; margin: 0; color: #000; text-transform: uppercase; }
.slot-box { display: flex; align-items: center; justify-content: center; }
.slot-abs-top { position: absolute; top: -12px; right: 25px; z-index: 10; }
.slot-abs-bottom { position: absolute; bottom: -15px; right: 75px; z-index: 10; }
.placeholder-white:empty { width: 60px; height: 60px; background: rgba(255,255,255,0.8); border: 2px dashed #ccc; border-radius: 10px; }
`,

    // --- Components ---
    'backgrounds/bg_yellow.html': `<div style="width:100%; height:100%; background: #FFFC00;"></div>`,
    'backgrounds/bg_dark.html': `<div style="width:100%; height:100%; background: #222; color:white;"></div>`,
    
    'profiles/profile_circle.html': `<style>.pc{width:70px;height:70px;border-radius:50%;overflow:hidden;border:3px solid #fff;}.pc img{width:100%;height:100%;object-fit:cover;}</style><div class="pc"><img src="https://via.placeholder.com/100" alt="p"></div>`,
    'profiles/profile_square.html': `<style>.ps{width:65px;height:65px;border-radius:12px;overflow:hidden;border:2px solid #000;}.ps img{width:100%;height:100%;object-fit:cover;}</style><div class="ps"><img src="https://via.placeholder.com/100" alt="p"></div>`,

    'buttons/btn_plus.html': `<style>.bp{width:50px;height:50px;background:#000;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;}.snap-card:hover .bp{background:#fff;color:#000;}</style><div class="bp"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></div>`,
    'buttons/btn_arrow.html': `<style>.ba{width:50px;height:50px;background:#3b82f6;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;border:2px solid #fff;}</style><div class="ba">➜</div>`,

    'mascots/ghost.html': `<div style="font-size:30px; filter:drop-shadow(0 5px 5px rgba(0,0,0,0.2)); animation:f 3s infinite;">👻</div><style>@keyframes f{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}</style>`,
    'mascots/fire.html': `<div style="font-size:32px; filter:drop-shadow(0 0 10px orange);">🔥</div>`,

    'badges/badge_sub.html': `<div style="background:#000;color:yellow;padding:5px 10px;border-radius:5px;font-size:10px;font-weight:bold;transform:rotate(5deg);">SUBSCRIBE</div>`,
    'badges/badge_new.html': `<div style="background:red;color:white;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:bold;border:2px solid white;">NEW</div>`
};

function setupFiles() {
    console.log("⚙️ Checking/Creating files...");
    
    // ساخت پوشه اصلی اگر نباشد
    if (!fs.existsSync(ELEMENT_DIR)) {
        fs.mkdirSync(ELEMENT_DIR, { recursive: true });
    }

    // ساخت تمام فایل‌ها
    Object.entries(filesContent).forEach(([filePath, content]) => {
        const fullPath = path.join(ELEMENT_DIR, filePath);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // همیشه فایل را بازنویسی میکنیم تا مطمئن شویم وجود دارد
        fs.writeFileSync(fullPath, content);
    });
    console.log("✅ Files ready.");
}

// =========================================================
// 2. SERVER & API LOGIC
// =========================================================

// API Config
app.get('/api/config', (req, res) => {
    const configPath = path.join(ELEMENT_DIR, 'config.json');
    // اگر به هر دلیلی فایل نبود، دوباره بساز
    if (!fs.existsSync(configPath)) setupFiles();

    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const steps = [];

    for (const [key, value] of Object.entries(rawConfig.slots)) {
        const folderPath = path.join(ELEMENT_DIR, value.folder);
        let options = [];
        if (fs.existsSync(folderPath)) {
            options = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.html'))
                .map(f => ({ 
                    id: f, 
                    name: f.replace('.html', ''), 
                    file: f 
                }));
        }
        steps.push({ key: key + '_style', label: value.title, source_folder: value.folder, options });
    }
    res.json({ ...rawConfig, steps });
});

// API File
app.get('/api/file', (req, res) => {
    const safePath = path.normalize(req.query.path || '').replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(ELEMENT_DIR, safePath);
    
    if (fs.existsSync(fullPath)) {
        res.json({ content: fs.readFileSync(fullPath, 'utf-8') });
    } else {
        res.status(404).json({ content: "" });
    }
});

app.use('/', (req, res) => {
    res.send("Snap Builder Backend is Running! 🚀");
});

// =========================================================
// 3. STARTUP
// =========================================================

// اول فایل‌ها را میسازیم
setupFiles();

// بعد سرور را روشن میکنیم
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
