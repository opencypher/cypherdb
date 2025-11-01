// Strip leading "$ " prompts when copying from terminal code blocks
(function () {
  function isTerminalLang(lang) {
    if (!lang) return false;
    const l = String(lang).toLowerCase();
    return [
      'bash',
      'sh',
      'zsh',
      'shell',
      'shellsession',
      'console',
    ].includes(l);
  }

  function detectLangFromPre(pre) {
    if (!pre) return null;
    const dataLang = pre.getAttribute('data-lang') || pre.dataset?.lang;
    if (dataLang) return dataLang;
    const wrapperWithData = pre.closest?.('[data-language]');
    if (wrapperWithData) return wrapperWithData.getAttribute('data-language');
    const code = pre.querySelector('code');
    const m = code?.className?.match(/language-([a-z0-9]+)/i);
    return m?.[1] || null;
  }

  function stripPrompts(text) {
    if (!text) return text;
    // Remove "$ " at the start of each line (optionally preceded by whitespace)
    return text.replace(/^(?:\s*\$\s+)/gm, '');
  }

  function isTerminalFigure(element) {
    const fig = element?.closest?.('figure');
    return !!fig && fig.classList.contains('is-terminal');
  }

  // Intercept user-initiated copy events (manual selection)
  document.addEventListener('copy', function (e) {
    const selection = window.getSelection?.();
    if (!selection || selection.isCollapsed) return;
    const anchorNode = selection.anchorNode;
    const node = anchorNode && (anchorNode.nodeType === 1 ? anchorNode : anchorNode.parentElement);
    const pre = node?.closest?.('pre');
    if (!pre) return;
    const lang = detectLangFromPre(pre);
    const terminalContext = isTerminalLang(lang) || isTerminalFigure(pre);
    if (!terminalContext) return;
    const original = selection.toString();
    const cleaned = stripPrompts(original);
    if (cleaned !== original) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', cleaned);
    }
  });

  // Clean the data-code attribute before Expressive Code reads it (capture phase)
  document.addEventListener('click', function (e) {
    const target = e.target;
    const button = target && (target.closest ? target.closest('button[data-code]') : null);
    if (!button) return;
    if (!isTerminalFigure(button)) return;
    const current = button.getAttribute('data-code') || '';
    const cleaned = stripPrompts(current);
    if (cleaned !== current) {
      button.setAttribute('data-code', cleaned);
    }
  }, true);

  // Also wrap navigator.clipboard.writeText to catch copy button behavior
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async function (text) {
      try {
        // Try to infer if the active element is a copy button near a terminal block
        const active = document.activeElement;
        let pre = active?.closest?.('pre');
        if (!pre) {
          // Look for a sibling/ancestor that contains the pre (Expressive Code wraps code)
          const container = active?.closest?.('figure, div, section, article');
          pre = container?.querySelector?.('pre') || null;
        }
        const lang = detectLangFromPre(pre);
        const terminalContext = isTerminalLang(lang) || isTerminalFigure(active);
        const cleaned = terminalContext ? stripPrompts(text) : text;
        return originalWriteText(cleaned);
      } catch (_) {
        // Fallback to original behavior on any error
        return originalWriteText(text);
      }
    };
  }
})();

// Add user-select: none to spans that start with $
(function () {
  function addDollarClass() {
    const codeBlocks = document.querySelectorAll('pre[data-language] code > div.ec-line > div.code > span:first-child');
    
    codeBlocks.forEach(span => {
      const text = span.textContent || span.innerText;
      if (text && text.trim().startsWith('$')) {
        span.classList.add('starts-with-dollar');
      }
    });
  }
  
  // Process on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDollarClass);
  } else {
    addDollarClass();
  }
  
  // Process when content changes (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        addDollarClass();
      }
    });
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();


