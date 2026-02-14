const fs = require('fs');
const path = require('path');

// مسیر اصلی که فایل‌ها در آن ساخته می‌شوند
const baseDir = path.join(__dirname, 'elements', 'snap-card');

const files = {
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

// تابع ساخت فایل‌ها
console.log("🛠️ Building Elements...");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

Object.entries(files).forEach(([f, content]) => {
    const p = path.join(baseDir, f);
    if (!fs.existsSync(path.dirname(p))) fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
});
console.log("✅ Elements Built Successfully!");
