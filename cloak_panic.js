(function(){
  const LS = {
    CLOAK: 'settings_cloak_choice',
    PANIC_KEY: 'settings_panic_key',
    PANIC_URL: 'settings_panic_url'
  };

  const CLOAK_INFO = {
    classroom: { title: 'Google Classroom', icon: 'https://ssl.gstatic.com/classroom/favicon.ico' },
    gmail: { title: 'Gmail', icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico' },
    docs: { title: 'Google Docs', icon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png' },
    slides: { title: 'Google Slides', icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico' }
  };

  const originalTitle = document.title || '';
  const originalFavicon = document.querySelector("link[rel~='icon']")?.href || 'favicon.ico';

  function setFavicon(href){
    if(!href) return;
    const stamp = href + '?v=' + Date.now();
    let link = document.querySelector("link[rel~='icon']");
    if(!link){
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = stamp;
  }

  function applyCloak(choice){
    if(!choice || !CLOAK_INFO[choice]){
      document.title = originalTitle;
      setFavicon(originalFavicon);
      return;
    }
    const info = CLOAK_INFO[choice];
    document.title = info.title;
    setFavicon(info.icon);
  }

  // Load saved settings
  const savedCloak = localStorage.getItem(LS.CLOAK);
  if(savedCloak) applyCloak(savedCloak);

  const savedKey = localStorage.getItem(LS.PANIC_KEY);
  const savedUrl = localStorage.getItem(LS.PANIC_URL);
  if(savedKey && savedUrl){
    window.addEventListener('keydown', function(e){
      const active = document.activeElement;
      const typing = active && (active.tagName==='INPUT'||active.tagName==='TEXTAREA'||active.isContentEditable);
      if(typing) return;
      if(e.key.toLowerCase() === savedKey.toLowerCase()){
        window.location.href = savedUrl;
      }
    }, true);
  }

  // UI bindings
  window.addEventListener('load', () => {
    const cloakSelect = document.getElementById('cloakSelect');
    const panicUrlInput = document.getElementById('panicUrl');
    const setKeyBtn = document.getElementById('setKeyBtn');
    const clearKeyBtn = document.getElementById('clearKeyBtn');
    const saveBtn = document.getElementById('saveBtn');
    const testPanicBtn = document.getElementById('testPanicBtn');
    const keyDisplay = document.getElementById('keyDisplay');
    let listening = false;
    let panicKey = savedKey;

    if(cloakSelect) cloakSelect.value = savedCloak || '';
    if(panicUrlInput) panicUrlInput.value = savedUrl || '';
    if(keyDisplay) keyDisplay.textContent = panicKey || 'Not set';

    setKeyBtn?.addEventListener('click', ()=>{
      listening = true;
      keyDisplay.textContent = 'Press any key...';
    });

    clearKeyBtn?.addEventListener('click', ()=>{
      listening = false;
      panicKey = null;
      keyDisplay.textContent = 'Not set';
      localStorage.removeItem(LS.PANIC_KEY);
    });

    window.addEventListener('keydown', function(e){
      if(listening){
        if(!['Shift','Control','Alt','Meta'].includes(e.key)){
          panicKey = e.key;
          keyDisplay.textContent = panicKey;
          listening = false;
          localStorage.setItem(LS.PANIC_KEY, panicKey);
        }
      }
    });

    saveBtn?.addEventListener('click', ()=>{
      localStorage.setItem(LS.CLOAK, cloakSelect.value);
      localStorage.setItem(LS.PANIC_URL, panicUrlInput.value);
      if(panicKey) localStorage.setItem(LS.PANIC_KEY, panicKey);
      alert("Settings saved!");
    });

    testPanicBtn?.addEventListener('click', ()=>{
      localStorage.setItem(LS.CLOAK, cloakSelect.value);
      localStorage.setItem(LS.PANIC_URL, panicUrlInput.value);
      if(panicKey) localStorage.setItem(LS.PANIC_KEY, panicKey);
      window.location.href = panicUrlInput.value || 'https://www.google.com';
    });
  });
})();
