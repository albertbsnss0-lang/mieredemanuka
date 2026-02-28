(function() {
    // MODIFICĂ AICI: Pune URL-ul Webhook-ului tău din N8N
    const N8N_WEBHOOK_URL = 'https://n8n.tatal-tau.com/webhook/cerb-manuka';
    const AFFILIATE_LINK = 'https://manukashop.ro/collections/miere-de-manuka?utm_campaign=2Performant&utm_source=8dc35e78d&utm_medium=CPS&2pau=8dc35e78d&2ptt=quicklink&2ptu=9659b7651&2prp=LlmbNvLUUlScHKZpWnEELAG6jsLvzhrfbL3i3RTDmGew_rrWBAT2aQ2s_n9pB85v49nVXbryGUmEXAZdxTgGmXvXPvSmkD3B0Rjg-esUYzM&2pdlst=';

    const styles = `
        #cerb-container { position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: sans-serif; }
        #cerb-bubble { width: 60px; height: 60px; background: #f4b41a; border-radius: 50%; border: 3px solid #7b1fa2; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: 0.3s; }
        #cerb-bubble:hover { transform: scale(1.1); }
        #cerb-chat { display: none; width: 330px; height: 480px; background: white; border-radius: 15px; border: 1px solid #7b1fa2; flex-direction: column; overflow: hidden; position: absolute; bottom: 80px; right: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        #cerb-header { background: #7b1fa2; color: white; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; }
        #cerb-messages { flex: 1; padding: 15px; overflow-y: auto; background: #fffdf5; display: flex; flex-direction: column; gap: 10px; }
        .msg { padding: 10px 14px; border-radius: 10px; font-size: 14px; max-width: 85%; }
        .msg-bot { background: #eee; align-self: flex-start; color: #333; }
        .msg-user { background: #7b1fa2; color: white; align-self: flex-end; }
        .cta-button { 
            display: block; width: 100%; padding: 12px; background: #f4b41a; color: #7b1fa2; 
            text-align: center; font-weight: bold; text-decoration: none; border-radius: 8px; 
            margin-top: 10px; border: 2px solid #7b1fa2; box-sizing: border-box;
            animation: pulseCerb 2s infinite;
        }
        @keyframes pulseCerb { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        #cerb-input-box { padding: 10px; display: flex; border-top: 1px solid #ddd; }
        #cerb-query { flex: 1; border: 1px solid #ccc; padding: 8px; border-radius: 5px; outline: none; }
        #cerb-send { background: #7b1fa2; color: white; border: none; padding: 8px 15px; margin-left: 5px; border-radius: 5px; cursor: pointer; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const html = `
        <div id="cerb-chat">
            <div id="cerb-header"><span>🦌 Asistent Cerb</span><span id="close-cerb" style="cursor:pointer">✕</span></div>
            <div id="cerb-messages"><div class="msg msg-bot">Salutare! Te pot ajuta să alegi mierea de Manuka potrivită?</div></div>
            <div id="cerb-input-box">
                <input type="text" id="cerb-query" placeholder="Scrie aici...">
                <button id="cerb-send">➤</button>
            </div>
        </div>
        <div id="cerb-bubble">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#7b1fa2"><path d="M12,2C12,2 10,4 7,4C4,4 2,6 2,9C2,12 5,13 5,13V19L12,22L19,19V13C19,13 22,12 22,9C22,6 20,4 17,4C14,4 12,2 12,2M12,6C13.1,6 14,6.9 14,8C14,9.1 13.1,10 12,10C10.9,10 10,9.1 10,8C10,6.9 10.9,6 12,6Z"/></svg>
        </div>
    `;

    const container = document.createElement('div');
    container.id = 'cerb-container';
    container.innerHTML = html;
    document.body.appendChild(container);

    const bubble = document.getElementById('cerb-bubble');
    const chat = document.getElementById('cerb-chat');
    const close = document.getElementById('close-cerb');
    const input = document.getElementById('cerb-query');
    const send = document.getElementById('cerb-send');
    const messages = document.getElementById('cerb-messages');

    bubble.onclick = () => chat.style.display = (chat.style.display === 'flex' ? 'none' : 'flex');
    close.onclick = () => chat.style.display = 'none';

    async function handleSend() {
        const text = input.value.trim();
        if(!text) return;
        addMsg(text, 'user');
        input.value = '';

        try {
            const res = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            addMsg(data.reply || "Imediat verific...", 'bot');
            if(data.qualified) showButton();
        } catch (e) { addMsg("Eroare conexiune N8N.", 'bot'); }
    }

    function addMsg(t, s) {
        const d = document.createElement('div');
        d.className = `msg msg-${s}`;
        d.innerText = t;
        messages.appendChild(d);
        messages.scrollTop = messages.scrollHeight;
    }

    function showButton() {
        if(document.querySelector('.cta-button')) return; // Nu il punem de doua ori
        const a = document.createElement('a');
        a.href = AFFILIATE_LINK; a.target = "_blank"; a.className = "cta-button";
        a.innerText = "🛒 CUMPĂRĂ MIERE ORIGINALĂ";
        messages.appendChild(a);
        messages.scrollTop = messages.scrollHeight;
    }

    send.onclick = handleSend;
    input.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };
})();