            const STORAGE_KEY = "english-vocabulary-practice-v1";
    const CASE_STORAGE_KEY = "english-case-translation-v1";
    const THEME_TRANSLATION_STORAGE_KEY = "english-theme-reading-translation-v1";

    function splitSlashValues(value) {
      return String(value || "").split(/[\/／]/).map(part => part.trim()).filter(Boolean);
    }

    function expandEnglishSlashTerm(term) {
      const parts = splitSlashValues(term);
      if (parts.length < 2) return [term];
      const tailWords = parts[parts.length - 1].split(/\s+/).filter(Boolean);
      const suffix = tailWords.length > 1 ? tailWords.slice(1).join(" ") : "";
      return parts.map(part => {
        if (part.includes(" ") || !suffix) return part;
        return `${part} ${suffix}`;
      });
    }

    function expandSlashVocab(items) {
      return items.flatMap(item => {
        if (item.category !== "Words & Phrases") return [item];
        const terms = expandEnglishSlashTerm(item.term);
        const meanings = splitSlashValues(item.meaning);
        if (terms.length < 2 || meanings.length !== terms.length) return [item];
        return terms.map((term, index) => ({
          ...item,
          term,
          meaning: meanings[index],
          answers: [term]
        }));
      });
    }

    const STUDY_VOCAB = expandSlashVocab(VOCAB);
    const units = [...new Set(STUDY_VOCAB.map(item => item.unit))].sort();
    const caseUnits = [...new Set(CASES.map(item => item.unit))].sort();
    const themeTranslationUnits = [...new Set(THEME_READING_TRANSLATIONS.map(item => item.unit))].sort();
    const textKnowledgeUnits = [...new Set(KNOWLEDGE_CARDS.filter(item => item.track === "textbook").map(item => item.unit))].sort();
    const writingKnowledgeUnits = [...new Set(KNOWLEDGE_CARDS.filter(item => item.track === "writing").map(item => item.unit))].sort();
    const CLOZE_BLANKS_PER_ATTEMPT = 10;
    const CLOZE_WORD_BANK_SIZE = 15;
    const CLOZE_DISTRACTOR_COUNT = CLOZE_WORD_BANK_SIZE - CLOZE_BLANKS_PER_ATTEMPT;
    const CLOZE_WORD_BANK_LABELS = "ABCDEFGHIJKLMNO".split("");
    const categories = ["Medical terminology", "Words & Phrases"];
    let state = {
      unit: units[0],
      category: categories[0],
      mode: "review",
      index: 0,
      revealed: false,
      submitted: false,
      lastInput: "",
      pool: []
    };
    let caseState = {
      unit: caseUnits[0],
      mode: "practice",
      index: 0,
      submitted: false,
      lastInput: "",
      showHints: false,
      pool: []
    };
    let themeTranslationState = {
      unit: themeTranslationUnits[0],
      mode: "practice",
      index: 0,
      submitted: false,
      lastInput: "",
      showHints: false,
      pool: []
    };
    let clozeState = {
      caseItem: null,
      blanks: [],
      wordBank: [],
      candidatePool: [],
      submitted: false,
      showOriginal: false
    };
    let lastClozeInteraction = {
      activeId: "",
      scrollY: 0
    };
    let knowledgeState = {
      track: "textbook",
      unit: textKnowledgeUnits[0] || "Unit5"
    };
    let progress = loadProgress();
    let caseProgress = loadCaseProgress();
    let themeTranslationProgress = loadThemeTranslationProgress();

    const $ = id => document.getElementById(id);
    const screens = ["homeScreen", "categoryScreen", "practiceScreen", "casePracticeScreen", "themeTranslationScreen", "clozeScreen", "knowledgeScreen"];

    function keyOf(item) {
      return `${item.unit}|${item.category}|${item.term}|${item.meaning}`;
    }

    function loadProgress() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    }

    function saveProgress() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }

    function loadCaseProgress() {
      try {
        return JSON.parse(localStorage.getItem(CASE_STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    }

    function saveCaseProgress() {
      localStorage.setItem(CASE_STORAGE_KEY, JSON.stringify(caseProgress));
    }

    function loadThemeTranslationProgress() {
      try {
        return JSON.parse(localStorage.getItem(THEME_TRANSLATION_STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    }

    function saveThemeTranslationProgress() {
      localStorage.setItem(THEME_TRANSLATION_STORAGE_KEY, JSON.stringify(themeTranslationProgress));
    }

    function record(item, correct) {
      const key = keyOf(item);
      const row = progress[key] || { seen: 0, correct: 0, wrong: false, mastered: false, last: "" };
      row.seen += 1;
      if (correct) row.correct += 1;
      row.wrong = correct ? row.wrong : true;
      if (!correct) row.mastered = false;
      row.last = new Date().toISOString();
      progress[key] = row;
      saveProgress();
    }

    function setMastered(item, mastered) {
      const key = keyOf(item);
      const row = progress[key] || { seen: 0, correct: 0, wrong: false, mastered: false, last: "" };
      row.mastered = mastered;
      if (mastered) {
        row.wrong = false;
        row.last = new Date().toISOString();
      }
      progress[key] = row;
      saveProgress();
    }

    function setWrong(item, wrong) {
      const key = keyOf(item);
      const row = progress[key] || { seen: 0, correct: 0, wrong: false, mastered: false, last: "" };
      row.wrong = wrong;
      if (wrong) row.mastered = false;
      progress[key] = row;
      saveProgress();
    }

    function showScreen(id) {
      screens.forEach(s => $(s).classList.toggle("active", s === id));
      $("resetBtn").hidden = id !== "homeScreen";
      const isLearning = id === "practiceScreen" || id === "casePracticeScreen" || id === "themeTranslationScreen" || id === "clozeScreen";
      document.body.classList.toggle("learning-active", isLearning);
      $("supportToggleBtn").closest(".support-card").hidden = isLearning;
      if (isLearning) {
        $("supportPanel").hidden = true;
        $("supportToggleBtn").setAttribute("aria-expanded", "false");
      }
    }

    let speechVoices = [];

    function loadSpeechVoices() {
      if (!("speechSynthesis" in window)) return [];
      speechVoices = window.speechSynthesis.getVoices();
      return speechVoices;
    }

    if ("speechSynthesis" in window) {
      loadSpeechVoices();
      window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
    }

    function showSpeechMessage(message) {
      const target = document.getElementById("casePracticeScreen").classList.contains("active") ? $("caseFeedback") : $("feedback");
      if (target) {
        target.textContent = message;
        target.className = "feedback bad";
      } else {
        alert(message);
      }
    }

    function selectEnglishVoice(preferredLang = "en-US") {
      const voices = speechVoices.length ? speechVoices : loadSpeechVoices();
      return voices.find(voice => voice.lang === preferredLang)
        || voices.find(voice => voice.lang === "en-US")
        || voices.find(voice => voice.lang === "en-GB")
        || voices.find(voice => voice.lang && voice.lang.toLowerCase().startsWith("en-"))
        || null;
    }

    function speakText(text, options = {}) {
      const clean = String(text || "").trim();
      if (!clean) return;
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        showSpeechMessage("当前浏览器不支持语音朗读。请尝试使用 Chrome、Edge 或 Safari。");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = options.lang || "en-US";
      utterance.rate = options.rate ?? 0.85;
      utterance.pitch = options.pitch ?? 1;
      const voice = selectEnglishVoice(utterance.lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }

    function stopSpeaking() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }

    function speakWord(word) {
      speakText(word, { lang: "en-US", rate: 0.85, pitch: 1 });
    }

    function speakWordSlow(word) {
      speakText(word, { lang: "en-US", rate: 0.58, pitch: 1 });
    }

    function speakSentence(sentence) {
      speakText(sentence, { lang: "en-US", rate: 0.82, pitch: 1 });
    }

    function exampleText(item) {
      return item?.example || item?.sentence || item?.phrase || "";
    }

    function renderWordSpeechControls(item, context = "review") {
      if (!item) return "";
      const example = exampleText(item);
      const label = context === "zhToEn" || context === "mistakes" || context === "enToEn" ? "🔊 正确读音" : "🔊 单词";
      const slow = context === "review" ? `<button type="button" data-speech-action="wordSlow">🐢 慢速</button>` : "";
      const exampleButton = example ? `<button type="button" data-speech-action="example">📖 例句</button>` : "";
      return `<div class="speech-row"><button type="button" data-speech-action="word">${label}</button>${slow}${exampleButton}</div>`;
    }

    function renderCaseSpeechControls() {
      return `<div class="speech-row"><button type="button" data-speech-action="caseSentence">🔊 读本句</button><button type="button" data-speech-action="caseSentenceSlow">🐢 慢速</button></div>`;
    }

    function renderThemeTranslationSpeechControls() {
      return `<div class="speech-row"><button type="button" data-speech-action="themeTranslationSentence">🔊 读本段</button><button type="button" data-speech-action="themeTranslationSentenceSlow">🐢 慢速</button></div>`;
    }

    function scopedItems() {
      return STUDY_VOCAB.filter(item => item.unit === state.unit && item.category === state.category);
    }

    function hasEnglishExplanation(item) {
      return Boolean(item.note && item.note.trim());
    }

    function activeItems() {
      const base = state.mode === "enToEn" ? scopedItems().filter(hasEnglishExplanation) : scopedItems();
      if (state.mode === "mistakes") return base.filter(item => progress[keyOf(item)]?.wrong);
      if (state.mode === "correct") return base.filter(item => {
        const row = progress[keyOf(item)];
        return row?.correct > 0 && !row.wrong && !row.mastered;
      });
      return base.filter(item => !progress[keyOf(item)]?.mastered);
    }

    function renderHome() {
      $("unitGrid").innerHTML = units.map(unit => {
        const count = STUDY_VOCAB.filter(item => item.unit === unit).length;
        return `<button class="tile" data-unit="${unit}"><strong>${unit}</strong><span>${count} 个项目</span></button>`;
      }).join("");
      document.querySelectorAll("[data-unit]").forEach(btn => {
        btn.addEventListener("click", () => {
          state.unit = btn.dataset.unit;
          $("categoryTitle").textContent = state.unit;
          renderCategories();
          showScreen("categoryScreen");
        });
      });
      $("caseUnitGrid").innerHTML = caseUnits.map(unit => {
        const count = CASES.filter(item => item.unit === unit).length;
        return `<button class="tile" data-case-unit="${unit}"><strong>${unit}</strong><span>${count} 个翻译句</span></button>`;
      }).join("");
      document.querySelectorAll("[data-case-unit]").forEach(btn => {
        btn.addEventListener("click", () => {
          caseState.unit = btn.dataset.caseUnit;
          caseState.mode = "practice";
          caseState.index = 0;
          caseState.submitted = false;
          caseState.showHints = false;
          refreshCasePool();
          showScreen("casePracticeScreen");
          renderCasePractice();
        });
      });
      $("themeTranslationUnitGrid").innerHTML = themeTranslationUnits.map(unit => {
        const count = THEME_READING_TRANSLATIONS.filter(item => item.unit === unit).length;
        return `<button class="tile" data-theme-translation-unit="${unit}"><strong>${unit}</strong><span>${count} 个段落</span></button>`;
      }).join("");
      document.querySelectorAll("[data-theme-translation-unit]").forEach(btn => {
        btn.addEventListener("click", () => {
          themeTranslationState.unit = btn.dataset.themeTranslationUnit;
          themeTranslationState.mode = "practice";
          themeTranslationState.index = 0;
          themeTranslationState.submitted = false;
          themeTranslationState.lastInput = "";
          themeTranslationState.showHints = false;
          refreshThemeTranslationPool();
          showScreen("themeTranslationScreen");
          renderThemeTranslationPractice();
        });
      });
      $("textKnowledgeGrid").innerHTML = textKnowledgeUnits.map(unit => {
        const count = KNOWLEDGE_CARDS.filter(item => item.track === "textbook" && item.unit === unit).length;
        return `<button class="tile" data-knowledge-track="textbook" data-knowledge-unit="${unit}"><strong>${unit}</strong><span>${count} 张课文卡片</span></button>`;
      }).join("");
      $("writingKnowledgeGrid").innerHTML = writingKnowledgeUnits.map(unit => {
        const count = KNOWLEDGE_CARDS.filter(item => item.track === "writing" && item.unit === unit).length;
        return `<button class="tile" data-knowledge-track="writing" data-knowledge-unit="${unit}"><strong>${unit}</strong><span>${count} 张 Writing 卡片</span></button>`;
      }).join("");
      document.querySelectorAll("[data-knowledge-track]").forEach(btn => {
        btn.addEventListener("click", () => {
          knowledgeState.track = btn.dataset.knowledgeTrack;
          knowledgeState.unit = btn.dataset.knowledgeUnit;
          showScreen("knowledgeScreen");
          renderKnowledgeCards();
        });
      });
      $("clozeGrid").innerHTML = CLOZE_CASES.map(item => {
        const coreCount = clozeCandidatePoolForCase(item).length;
        const practiceCount = Math.min(CLOZE_BLANKS_PER_ATTEMPT, coreCount);
        return `<button class="tile" data-cloze-case="${item.caseId}"><strong>${item.unit} / ${item.caseId}</strong><span>${escapeHtml(item.title)} · 题库 ${coreCount} 个，每次 ${practiceCount} 空</span></button>`;
      }).join("");
      document.querySelectorAll("[data-cloze-case]").forEach(btn => {
        btn.addEventListener("click", () => {
          startCloze(btn.dataset.clozeCase);
        });
      });
    }

    function renderCategories() {
      $("categoryGrid").innerHTML = categories.map(category => {
        const count = STUDY_VOCAB.filter(item => item.unit === state.unit && item.category === category).length;
        return `<button class="tile" data-category="${category}" ${count ? "" : "disabled"}><strong>${category}</strong><span>${count} 个项目</span></button>`;
      }).join("");
      document.querySelectorAll("[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
          state.category = btn.dataset.category;
          state.mode = "review";
          state.index = 0;
          state.revealed = false;
          state.submitted = false;
          state.lastInput = "";
          refreshPool();
          showScreen("practiceScreen");
          renderPractice();
        });
      });
    }

    function refreshPool() {
      state.pool = activeItems();
      if (state.index >= state.pool.length) state.index = 0;
    }

    function isWritingMode(mode) {
      return mode === "enToZh" || mode === "zhToEn" || mode === "enToEn" || mode === "mistakes";
    }

    function allowedModesForCurrentCategory() {
      if (state.category === "Words & Phrases") return ["review", "zhToEn"];
      return ["review", "enToZh", "zhToEn", "enToEn", "correct", "mistakes"];
    }

    function normalizeCurrentMode() {
      const allowed = allowedModesForCurrentCategory();
      if (!allowed.includes(state.mode)) {
        state.mode = allowed[0];
        state.index = 0;
        state.submitted = false;
        state.lastInput = "";
      }
      document.querySelectorAll("[data-mode]").forEach(btn => {
        btn.hidden = !allowed.includes(btn.dataset.mode);
      });
    }

    function normalizeAnswer(value) {
      return value.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
    }

    function normalizeMeaning(value) {
      return value.toLowerCase().replace(/[\s,，;；.。:：、/()（）]/g, "").trim();
    }

    function meaningAnswers(item) {
      const parts = item.meaning.split(/[;；,，、/]/).map(part => part.trim()).filter(Boolean);
      return [...new Set([item.meaning, ...parts])];
    }

    function termAnswers(item) {
      const answers = new Set([item.term, ...item.answers]);
      for (const value of [...answers]) {
        if (!value.includes("/")) continue;
        const parts = value.split("/").map(part => part.trim()).filter(Boolean);
        parts.forEach(part => answers.add(part));
        const tailWords = parts[parts.length - 1].split(/\s+/);
        const suffix = tailWords.length > 1 ? tailWords[tailWords.length - 1] : "";
        if (suffix) {
          parts.slice(0, -1).forEach(part => {
            if (!part.includes(" ")) answers.add(`${part} ${suffix}`);
          });
        }
      }
      return [...answers];
    }

    function isCorrect(input, item) {
      if (state.mode === "enToZh") {
        const answer = normalizeMeaning(input);
        if (!answer) return false;
        return meaningAnswers(item).some(value => normalizeMeaning(value) === answer);
      }
      const answer = normalizeAnswer(input);
      if (!answer) return false;
      return termAnswers(item).some(a => normalizeAnswer(a) === answer);
    }

    function currentItem() {
      refreshPool();
      return state.pool[state.index];
    }

    function renderPractice() {
      normalizeCurrentMode();
      document.querySelectorAll("[data-mode]").forEach(btn => btn.classList.toggle("active", btn.dataset.mode === state.mode));
      $("currentScope").textContent = `${state.unit} / ${state.category}`;
      refreshPool();
      updateStats();
      renderMistakes();
      const item = currentItem();
      $("positionText").textContent = state.pool.length ? `${state.index + 1} / ${state.pool.length}` : "0 / 0";
      $("feedback").textContent = "";
      $("feedback").className = "feedback";
      $("masterBtn").disabled = !item || (isWritingMode(state.mode) && !state.submitted);
      $("prevBtn").disabled = !item || state.pool.length < 2;
      $("nextBtn").disabled = !item || state.pool.length < 2;
      $("mainBtn").hidden = state.mode === "review" || state.mode === "correct";
      $("nextBtn").hidden = isWritingMode(state.mode) && state.submitted;
      if (!item) {
        $("promptLabel").textContent = "没有可练习的项目";
        $("promptText").textContent = state.mode === "mistakes" ? "当前没有错词" : (state.mode === "correct" ? "当前没有正确词" : (state.mode === "enToEn" ? "当前没有带英文解释的词" : "当前没有待练习词"));
        $("answerArea").innerHTML = "";
        $("mainBtn").disabled = true;
        $("nextBtn").hidden = false;
        return;
      }
      $("mainBtn").disabled = false;
      if (isWritingMode(state.mode)) {
        renderDictation(item);
      } else {
        renderReview(item);
      }
    }

    function renderReview(item) {
      $("promptLabel").textContent = state.mode === "correct" ? "正确" : "记忆";
      $("promptText").textContent = item.term;
      $("mainBtn").textContent = "下一个";
      const breakdown = state.mode === "review"
        ? (item.category === "Medical terminology" ? renderBreakdown(item) : renderWordFormation(item))
        : "";
      const speech = renderWordSpeechControls(item, state.mode === "review" ? "review" : "correct");
      $("answerArea").innerHTML = `${speech}<div class="meaning">${escapeHtml(item.meaning)}</div>${item.note ? `<div class="note">${escapeHtml(item.note)}</div>` : ""}${breakdown}`;
    }

    function wordFormationForItem(item) {
      if (typeof WORD_FORMATION === "undefined" || !item) return null;
      const exact = WORD_FORMATION[`${item.unit}::${item.term}`];
      if (exact) return exact;
      return Object.values(WORD_FORMATION).find(row => {
        if (row.unit !== item.unit) return false;
        return expandEnglishSlashTerm(row.term).some(term => normalizeAnswer(term) === normalizeAnswer(item.term));
      }) || null;
    }

    function renderWordFormation(item) {
      if (item.category !== "Words & Phrases") return "";
      const formation = wordFormationForItem(item);
      if (!formation?.parts?.length) return "";
      return renderBreakdown({ breakdown: formation });
    }

    function renderBreakdown(item) {
      if (!item.breakdown || !item.breakdown.parts?.length) return "";
      const parts = item.breakdown.parts.map(part => `
        <div class="breakdown-part">
          <b>${escapeHtml(part.label)}</b>
          ${part.meaning ? `<span>${escapeHtml(part.meaning)}</span>` : ""}
        </div>
      `).join("");
      const hint = item.breakdown.hint ? `<div class="breakdown-hint">${escapeHtml(item.breakdown.hint)}</div>` : "";
      return `
        <div class="breakdown">
          <div class="breakdown-title">构词拆解</div>
          <div class="breakdown-parts">${parts}</div>
          ${hint}
        </div>
      `;
    }

    const isCoarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches || false;
    const isTouchDevice = isCoarsePointer || navigator.maxTouchPoints > 1 || "ontouchstart" in window;
    const isIPadOS = /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || isIPadOS || isTouchDevice;
    if (isTouchDevice) document.body.classList.add("touch-device");

    /* ── Keyboard-open detector (mobile only) ── */
    if (isMobile && window.visualViewport) {
      const vv = window.visualViewport;
      const KEYBOARD_THRESHOLD = 150;
      let fullHeight = vv.height;
      vv.addEventListener('resize', () => {
        const diff = fullHeight - vv.height;
        document.body.classList.toggle('keyboard-open', diff > KEYBOARD_THRESHOLD);
      });
      // Update fullHeight when orientation changes or keyboard fully closes
      window.addEventListener('resize', () => { fullHeight = Math.max(fullHeight, window.visualViewport.height); });
    }

    function renderDictation(item) {
      const englishDefinitionMode = state.mode === "enToEn";
      const englishAnswer = state.mode !== "enToZh";
      $("mainBtn").hidden = false;
      $("nextBtn").hidden = state.submitted;
      $("masterBtn").disabled = !item || !state.submitted;
      $("promptLabel").textContent = state.mode === "enToZh" ? "英译中" : (englishDefinitionMode ? "英译英" : (state.mode === "mistakes" ? "错词：中译英" : "中译英"));
      $("promptText").textContent = englishDefinitionMode ? item.note : (englishAnswer ? item.meaning : item.term);
      $("mainBtn").textContent = state.submitted ? "下一个" : "提交";
      const answerText = englishAnswer ? item.term : item.meaning;
      const extra = englishDefinitionMode ? "；" + escapeHtml(item.meaning) : (englishAnswer && item.note ? "；" + escapeHtml(item.note) : "");
      const speechContext = state.mode === "enToZh" ? "enToZh" : (englishDefinitionMode ? "enToEn" : "zhToEn");

      if (state.submitted) {
        /* ── Mobile path: keep input alive so keyboard stays open ── */
        if (isMobile) {
          const existingInput = $("answerInput");
          if (existingInput) {
            // Keep the input but make it visually indicate submitted state
            existingInput.readOnly = true;
            existingInput.style.borderColor = 'var(--line-strong)';
            existingInput.style.opacity = '0.7';
          }
          // Show results inline below the input (don't destroy it)
          let resultDiv = document.getElementById("mobileInlineResult");
          if (!resultDiv) {
            resultDiv = document.createElement("div");
            resultDiv.id = "mobileInlineResult";
            resultDiv.className = "mobile-inline-result";
            $("answerArea").appendChild(resultDiv);
          }
          const speech = renderWordSpeechControls(item, speechContext);
          resultDiv.innerHTML = `
            ${speech}
            <div class="reference user-answer"><strong>你的答案：</strong>${escapeHtml(state.lastInput || "")}</div>
            <div class="reference"><strong>参考答案：</strong>${escapeHtml(answerText)}${extra}</div>
          `;
          return;
        }
        /* ── Desktop path: original behavior ── */
        const speech = renderWordSpeechControls(item, speechContext);
        $("answerArea").innerHTML = `
          ${speech}
          <div class="reference user-answer"><strong>你的答案：</strong>${escapeHtml(state.lastInput || "")}</div>
          <div class="reference"><strong>参考答案：</strong>${escapeHtml(answerText)}${extra}</div>
        `;
        return;
      }

      /* ── Not submitted: show input field ── */
      /* On mobile, try to reuse existing input to preserve keyboard focus */
      const existingInput = $("answerInput");
      if (isMobile && existingInput && document.activeElement === existingInput) {
        // Reuse the input — just clear it and update placeholder
        existingInput.value = "";
        existingInput.readOnly = false;
        existingInput.style.borderColor = '';
        existingInput.style.opacity = '';
        existingInput.placeholder = englishAnswer ? "输入英文" : "输入中文释义";
        // Remove any inline result
        const oldResult = document.getElementById("mobileInlineResult");
        if (oldResult) oldResult.remove();
        return;
      }

      $("answerArea").innerHTML = `
        <div class="answer-row">
          <input id="answerInput" type="text" enterkeyhint="done" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${englishAnswer ? "输入英文" : "输入中文释义"}">
        </div>
      `;
      const input = $("answerInput");
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
      if (isMobile) {
        // Scroll to keep the prompt visible
        setTimeout(() => {
          const card = input.closest('.study-card');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          handleEnter();
        }
      });
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
    }

    function updateStats() {
      const items = state.mode === "enToEn" ? scopedItems().filter(hasEnglishExplanation) : scopedItems();
      let seen = 0, correctCount = 0, mastered = 0, wrong = 0;
      for (const item of items) {
        const row = progress[keyOf(item)];
        if (row?.seen) seen += 1;
        if (row?.correct > 0 && !row.wrong && !row.mastered) correctCount += 1;
        if (row?.mastered && !row.wrong) mastered += 1;
        if (row?.wrong) wrong += 1;
      }
      $("totalStat").textContent = items.length;
      $("seenStat").textContent = seen;
      $("correctStat").textContent = correctCount;
      $("masteredStat").textContent = mastered;
      $("wrongStat").textContent = wrong;
    }

    function renderMistakes() {
      const wrongItems = scopedItems().filter(item => progress[keyOf(item)]?.wrong);
      $("mistakeList").innerHTML = wrongItems.length ? wrongItems.map(item => `
        <div class="list-item">
          <strong>${escapeHtml(item.term)}</strong>
          <span>${escapeHtml(item.meaning)}</span>
        </div>
      `).join("") : `<div class="muted">暂无错词</div>`;
    }

    function submitAnswer() {
      const item = currentItem();
      if (!item) return;
      const input = $("answerInput");
      if (!input) return;
      const value = input.value.trim();
      if (!value) return;
      const ok = isCorrect(value, item);
      state.lastInput = value;
      record(item, ok);
      if (ok) setWrong(item, false);
      $("feedback").textContent = ok ? "✓ 正确" : "✗ 错误";
      $("feedback").className = `feedback ${ok ? "good" : "bad"}`;
      state.submitted = true;
      renderDictation(item);
      // Re-apply feedback after render (renderDictation may reset it)
      $("feedback").textContent = ok ? "✓ 正确" : "✗ 错误";
      $("feedback").className = `feedback ${ok ? "good" : "bad"}`;
      updateStats();
      renderMistakes();

    }

    function nextItem() {
      refreshPool();
      if (!state.pool.length) {
        renderPractice();
        return;
      }
      state.index = (state.index + 1) % state.pool.length;
      state.revealed = false;
      state.submitted = false;
      state.lastInput = "";
      renderPractice();
    }

    function prevItem() {
      refreshPool();
      if (!state.pool.length) return;
      state.index = (state.index - 1 + state.pool.length) % state.pool.length;
      state.revealed = false;
      state.submitted = false;
      state.lastInput = "";
      renderPractice();
    }

    function mainAction() {
      const item = currentItem();
      if (!item) return;
      if (isWritingMode(state.mode)) {
        if (state.submitted) {
          nextItem();
        } else {
          submitAnswer();
        }
        return;
      }
      nextItem();
    }

    function handleEnter() {
      if (document.getElementById("practiceScreen").classList.contains("active")) {
        mainAction();
        return;
      }
      if (document.getElementById("casePracticeScreen").classList.contains("active")) {
        caseMainAction();
        return;
      }
      if (document.getElementById("themeTranslationScreen").classList.contains("active")) {
        themeTranslationMainAction();
        return;
      }
      if (document.getElementById("clozeScreen").classList.contains("active")) {
        submitCloze();
      }
    }

    function shufflePool() {
      refreshPool();
      for (let i = state.pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.pool[i], state.pool[j]] = [state.pool[j], state.pool[i]];
      }
      state.index = 0;
      state.revealed = false;
      state.submitted = false;
      state.lastInput = "";
      renderPractice();
    }

    function caseKeyOf(item) {
      return item.id;
    }

    function scopedCases() {
      return CASES.filter(item => item.unit === caseState.unit);
    }

    function activeCases() {
      const base = scopedCases();
      if (caseState.mode !== "mistakes") return base;
      return base.filter(item => caseProgress[caseKeyOf(item)]?.wrong);
    }

    function refreshCasePool() {
      caseState.pool = activeCases();
      if (caseState.index >= caseState.pool.length) caseState.index = 0;
    }

    function currentCase() {
      refreshCasePool();
      return caseState.pool[caseState.index];
    }

    function recordCase(item, level) {
      const key = caseKeyOf(item);
      const row = caseProgress[key] || { seen: 0, good: 0, wrong: false, last: "", level: "" };
      row.seen += 1;
      row.level = level;
      row.last = new Date().toISOString();
      if (level === "good") {
        row.good += 1;
        row.wrong = false;
      } else {
        row.wrong = true;
      }
      caseProgress[key] = row;
      saveCaseProgress();
    }

    function setCaseWrong(item, wrong) {
      const key = caseKeyOf(item);
      const row = caseProgress[key] || { seen: 0, good: 0, wrong: false, last: "", level: "" };
      row.wrong = wrong;
      caseProgress[key] = row;
      saveCaseProgress();
    }

    function updateCaseStats() {
      const items = scopedCases();
      let seen = 0, good = 0, wrong = 0;
      for (const item of items) {
        const row = caseProgress[caseKeyOf(item)];
        if (row?.seen) seen += 1;
        if (row?.good) good += 1;
        if (row?.wrong) wrong += 1;
      }
      $("caseTotalStat").textContent = items.length;
      $("caseSeenStat").textContent = seen;
      $("caseGoodStat").textContent = good;
      $("caseWrongStat").textContent = wrong;
    }

    function renderCaseMistakes() {
      const wrongItems = scopedCases().filter(item => caseProgress[caseKeyOf(item)]?.wrong);
      $("caseMistakeList").innerHTML = wrongItems.length ? wrongItems.map(item => `
        <div class="list-item">
          <strong>${escapeHtml(item.english)}</strong>
          <span>${escapeHtml(item.translation)}</span>
        </div>
      `).join("") : `<div class="muted">暂无错句</div>`;
    }

    function renderKeywords(item) {
      if (!caseState.showHints && !caseState.submitted && caseState.mode !== "compare") return "";
      const detailedGroups = item.keywordGroups || [];
      if (detailedGroups.length) {
        const groups = detailedGroups.map((group, index) => {
          const title = group.title || `第${index + 1}句`;
          const english = group.english ? `<div class="keyword-line"><strong>英文：</strong>${escapeHtml(group.english)}</div>` : "";
          const translation = group.translation ? `<div class="keyword-line"><strong>中文：</strong>${escapeHtml(group.translation)}</div>` : "";
          const terms = (group.terms || []).map(term => {
            const pronunciation = term.pronunciation ? ` <span class="keyword-pron">${escapeHtml(term.pronunciation)}</span>` : "";
            const pos = term.pos ? ` <span class="keyword-pos">${escapeHtml(term.pos)}</span>` : "";
            const meaning = term.meaning ? ` ${escapeHtml(term.meaning)}` : "";
            const notes = term.notes?.length ? `<div class="keyword-note">${term.notes.map(escapeHtml).join("<br>")}</div>` : "";
            return `<li><span class="keyword-term">${escapeHtml(term.term)}</span>${pronunciation}${pos}${meaning}${notes}</li>`;
          }).join("");
          return `
            <div class="keyword-group">
              <div class="keyword-group-title">${escapeHtml(title)}</div>
              ${english}
              ${translation}
              <ol class="keyword-list">${terms}</ol>
            </div>
          `;
        }).join("");
        return `<div class="keyword-panel"><div class="keyword-title">生词解析</div><div class="keyword-groups">${groups}</div></div>`;
      }
      if (!item.keywords.length) return `<div class="keyword-panel"><div class="keyword-title">生词解析</div><div class="muted">暂无关键词</div></div>`;
      return `<div class="keyword-panel"><div class="keyword-title">生词解析</div><div class="keywords">${item.keywords.map(k => `<span class="keyword">${escapeHtml(k.term)}：${escapeHtml(k.meaning)}</span>`).join("")}</div></div>`;
    }

    function renderCasePractice() {
      document.querySelectorAll("[data-case-mode]").forEach(btn => btn.classList.toggle("active", btn.dataset.caseMode === caseState.mode));
      refreshCasePool();
      updateCaseStats();
      renderCaseMistakes();
      const item = currentCase();
      $("caseScope").textContent = `${caseState.unit} / Case Translation`;
      $("casePositionText").textContent = caseState.pool.length ? `${caseState.index + 1} / ${caseState.pool.length}` : "0 / 0";
      $("caseFeedback").textContent = "";
      $("caseFeedback").className = "feedback";
      $("casePrevBtn").disabled = !item || caseState.pool.length < 2;
      $("caseNextBtn").disabled = !item || caseState.pool.length < 2;
      $("caseHintBtn").disabled = !item;
      $("caseGoodBtn").disabled = !item || !caseState.submitted;
      $("caseWeakBtn").disabled = !item || !caseState.submitted;
      $("caseMainBtn").hidden = caseState.submitted;
      $("caseNextBtn").hidden = caseState.submitted || caseState.mode === "compare";
      if (!item) {
        $("casePromptLabel").textContent = "没有可练习的项目";
        $("caseEnglish").textContent = caseState.mode === "mistakes" ? "当前没有错句" : "这个 Unit 暂无病例翻译内容";
        $("caseAnswerArea").innerHTML = "";
        $("caseMainBtn").disabled = true;
        $("caseMainBtn").hidden = false;
        $("caseNextBtn").hidden = false;
        return;
      }
      $("caseMainBtn").disabled = false;
      if (!caseState.submitted) $("caseMainBtn").hidden = false;
      $("casePromptLabel").textContent = caseState.mode === "compare" ? "对照模式" : "英译中";
      $("caseEnglish").textContent = item.english;
      $("caseMainBtn").textContent = caseState.submitted ? "正确" : (caseState.mode === "compare" ? "下一个" : "提交");

      if (isMobile && caseState.submitted && caseState.mode !== "compare") {
        /* Mobile: keep textarea alive, show results inline */
        const existingTA = $("caseInput");
        if (existingTA) {
          existingTA.readOnly = true;
          existingTA.style.opacity = '0.7';
          existingTA.style.minHeight = '60px';
        }
        let resultDiv = document.getElementById("mobileCaseResult");
        if (!resultDiv) {
          resultDiv = document.createElement("div");
          resultDiv.id = "mobileCaseResult";
          resultDiv.className = "mobile-inline-result";
          $("caseAnswerArea").appendChild(resultDiv);
        }
        resultDiv.innerHTML = `
          <div class="reference user-answer"><strong>你的译文：</strong>${escapeHtml(caseState.lastInput || "")}</div>
          <div class="reference"><strong>参考译文：</strong>${escapeHtml(item.translation)}</div>
          ${renderKeywords(item)}
        `;
        return;
      }

      const yourAnswer = caseState.submitted
        ? `<div class="reference user-answer"><strong>你的译文：</strong>${escapeHtml(caseState.lastInput || "")}</div>`
        : "";
      const reference = (caseState.submitted || caseState.mode === "compare")
        ? `<div class="reference"><strong>参考译文：</strong>${escapeHtml(item.translation)}</div>`
        : "";
      const input = (caseState.mode === "compare" || caseState.submitted) ? "" : `
        <textarea id="caseInput" enterkeyhint="done" autocomplete="off" placeholder="输入你的中文翻译。按回车提交，Shift+Enter 换行。"></textarea>
      `;
      $("caseAnswerArea").innerHTML = `${renderCaseSpeechControls()}${input}${yourAnswer}${reference}${renderKeywords(item)}`;
      const textarea = $("caseInput");
      if (textarea) {
        textarea.addEventListener("keydown", event => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            handleEnter();
          }
        });
        if (isMobile) {
          setTimeout(() => {
            const card = textarea.closest('.study-card');
            if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }

    function submitCaseTranslation() {
      const item = currentCase();
      if (!item) return;
      const textarea = $("caseInput");
      caseState.lastInput = textarea ? textarea.value.trim() : "";
      caseState.submitted = true;
      caseState.showHints = true;
      renderCasePractice();
      $("caseFeedback").textContent = "对照参考译文后自评分";
      // On mobile, update button states without full re-render
      if (isMobile) {
        $("caseGoodBtn").disabled = false;
        $("caseWeakBtn").disabled = false;
        $("caseMainBtn").hidden = true;
      }
    }

    function nextCase() {
      refreshCasePool();
      if (!caseState.pool.length) {
        renderCasePractice();
        return;
      }
      caseState.index = (caseState.index + 1) % caseState.pool.length;
      caseState.submitted = false;
      caseState.lastInput = "";
      caseState.showHints = false;
      renderCasePractice();
    }

    function prevCase() {
      refreshCasePool();
      if (!caseState.pool.length) return;
      caseState.index = (caseState.index - 1 + caseState.pool.length) % caseState.pool.length;
      caseState.submitted = false;
      caseState.lastInput = "";
      caseState.showHints = false;
      renderCasePractice();
    }

    function caseMainAction() {
      const item = currentCase();
      if (caseState.submitted) {
        if (item) recordCase(item, "good");
        nextCase();
        return;
      }
      if (caseState.mode === "compare") {
        nextCase();
      } else {
        submitCaseTranslation();
      }
    }

    function themeTranslationKeyOf(item) {
      return item.id;
    }

    function scopedThemeTranslations() {
      return THEME_READING_TRANSLATIONS.filter(item => item.unit === themeTranslationState.unit);
    }

    function activeThemeTranslations() {
      const base = scopedThemeTranslations();
      if (themeTranslationState.mode !== "mistakes") return base;
      return base.filter(item => themeTranslationProgress[themeTranslationKeyOf(item)]?.wrong);
    }

    function refreshThemeTranslationPool() {
      themeTranslationState.pool = activeThemeTranslations();
      if (themeTranslationState.index >= themeTranslationState.pool.length) themeTranslationState.index = 0;
    }

    function currentThemeTranslation() {
      refreshThemeTranslationPool();
      return themeTranslationState.pool[themeTranslationState.index];
    }

    function recordThemeTranslation(item, level) {
      const key = themeTranslationKeyOf(item);
      const row = themeTranslationProgress[key] || { seen: 0, good: 0, wrong: false, last: "", level: "" };
      row.seen += 1;
      row.level = level;
      row.last = new Date().toISOString();
      if (level === "good") {
        row.good += 1;
        row.wrong = false;
      } else {
        row.wrong = true;
      }
      themeTranslationProgress[key] = row;
      saveThemeTranslationProgress();
    }

    function setThemeTranslationWrong(item, wrong) {
      const key = themeTranslationKeyOf(item);
      const row = themeTranslationProgress[key] || { seen: 0, good: 0, wrong: false, last: "", level: "" };
      row.wrong = wrong;
      themeTranslationProgress[key] = row;
      saveThemeTranslationProgress();
    }

    function updateThemeTranslationStats() {
      const items = scopedThemeTranslations();
      let seen = 0, good = 0, wrong = 0;
      for (const item of items) {
        const row = themeTranslationProgress[themeTranslationKeyOf(item)];
        if (row?.seen) seen += 1;
        if (row?.good) good += 1;
        if (row?.wrong) wrong += 1;
      }
      $("themeTranslationTotalStat").textContent = items.length;
      $("themeTranslationSeenStat").textContent = seen;
      $("themeTranslationGoodStat").textContent = good;
      $("themeTranslationWrongStat").textContent = wrong;
    }

    function renderThemeTranslationMistakes() {
      const wrongItems = scopedThemeTranslations().filter(item => themeTranslationProgress[themeTranslationKeyOf(item)]?.wrong);
      $("themeTranslationMistakeList").innerHTML = wrongItems.length ? wrongItems.map(item => `
        <div class="list-item">
          <strong>${escapeHtml(item.english)}</strong>
          <span>${escapeHtml(item.translation)}</span>
        </div>
      `).join("") : `<div class="muted">暂无错段</div>`;
    }

    function renderThemeTranslationHints(item) {
      return "";
    }

    function renderThemeTranslationPractice() {
      document.querySelectorAll("[data-theme-translation-mode]").forEach(btn => btn.classList.toggle("active", btn.dataset.themeTranslationMode === themeTranslationState.mode));
      refreshThemeTranslationPool();
      updateThemeTranslationStats();
      renderThemeTranslationMistakes();
      const item = currentThemeTranslation();
      $("themeTranslationScope").textContent = `${themeTranslationState.unit} / Theme Reading Translation`;
      $("themeTranslationPositionText").textContent = themeTranslationState.pool.length ? `${themeTranslationState.index + 1} / ${themeTranslationState.pool.length}` : "0 / 0";
      $("themeTranslationFeedback").textContent = "";
      $("themeTranslationFeedback").className = "feedback";
      $("themeTranslationPrevBtn").disabled = !item || themeTranslationState.pool.length < 2;
      $("themeTranslationNextBtn").disabled = !item || themeTranslationState.pool.length < 2;
      $("themeTranslationGoodBtn").disabled = !item || !themeTranslationState.submitted;
      $("themeTranslationWeakBtn").disabled = !item || !themeTranslationState.submitted;
      $("themeTranslationMainBtn").hidden = themeTranslationState.submitted;
      $("themeTranslationNextBtn").hidden = themeTranslationState.submitted || themeTranslationState.mode === "compare";
      if (!item) {
        $("themeTranslationPromptLabel").textContent = "没有可练习的段落";
        $("themeTranslationEnglish").textContent = themeTranslationState.mode === "mistakes" ? "当前没有错段" : "这个 Unit 暂无 Theme Reading 翻译内容";
        $("themeTranslationAnswerArea").innerHTML = "";
        $("themeTranslationMainBtn").disabled = true;
        $("themeTranslationMainBtn").hidden = false;
        $("themeTranslationNextBtn").hidden = false;
        return;
      }
      $("themeTranslationMainBtn").disabled = false;
      if (!themeTranslationState.submitted) $("themeTranslationMainBtn").hidden = false;
      $("themeTranslationPromptLabel").textContent = themeTranslationState.mode === "compare" ? `${item.heading} / 对照阅读` : `${item.heading} / 英译中`;
      $("themeTranslationEnglish").textContent = item.english;
      $("themeTranslationMainBtn").textContent = themeTranslationState.submitted ? "正确" : (themeTranslationState.mode === "compare" ? "下一段" : "提交");
      if (isMobile && themeTranslationState.submitted && themeTranslationState.mode !== "compare") {
        const existingTA = $("themeTranslationInput");
        if (existingTA) {
          existingTA.readOnly = true;
          existingTA.style.opacity = "0.7";
          existingTA.style.minHeight = "70px";
        }
        let resultDiv = document.getElementById("mobileThemeTranslationResult");
        if (!resultDiv) {
          resultDiv = document.createElement("div");
          resultDiv.id = "mobileThemeTranslationResult";
          resultDiv.className = "mobile-inline-result";
          $("themeTranslationAnswerArea").appendChild(resultDiv);
        }
        resultDiv.innerHTML = `
          <div class="reference user-answer"><strong>你的译文：</strong>${escapeHtml(themeTranslationState.lastInput || "")}</div>
          <div class="reference"><strong>参考译文：</strong>${escapeHtml(item.translation)}</div>
          ${renderThemeTranslationHints(item)}
        `;
        return;
      }
      const yourAnswer = themeTranslationState.submitted
        ? `<div class="reference user-answer"><strong>你的译文：</strong>${escapeHtml(themeTranslationState.lastInput || "")}</div>`
        : "";
      const reference = (themeTranslationState.submitted || themeTranslationState.mode === "compare")
        ? `<div class="reference"><strong>参考译文：</strong>${escapeHtml(item.translation)}</div>`
        : "";
      const input = (themeTranslationState.submitted || themeTranslationState.mode === "compare") ? "" : `
        <textarea id="themeTranslationInput" enterkeyhint="done" autocomplete="off" placeholder="输入你的中文翻译。按回车提交，Shift+Enter 换行。"></textarea>
      `;
      $("themeTranslationAnswerArea").innerHTML = `${renderThemeTranslationSpeechControls()}${input}${yourAnswer}${reference}${renderThemeTranslationHints(item)}`;
      const textarea = $("themeTranslationInput");
      if (textarea) {
        textarea.addEventListener("keydown", event => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            handleEnter();
          }
        });
      }
    }

    function submitThemeTranslation() {
      const item = currentThemeTranslation();
      if (!item) return;
      const textarea = $("themeTranslationInput");
      themeTranslationState.lastInput = textarea ? textarea.value.trim() : "";
      themeTranslationState.submitted = true;
      themeTranslationState.showHints = true;
      renderThemeTranslationPractice();
      $("themeTranslationFeedback").textContent = "对照参考译文后自评。";
    }

    function nextThemeTranslation() {
      refreshThemeTranslationPool();
      if (!themeTranslationState.pool.length) {
        renderThemeTranslationPractice();
        return;
      }
      themeTranslationState.index = (themeTranslationState.index + 1) % themeTranslationState.pool.length;
      themeTranslationState.submitted = false;
      themeTranslationState.lastInput = "";
      themeTranslationState.showHints = false;
      renderThemeTranslationPractice();
    }

    function prevThemeTranslation() {
      refreshThemeTranslationPool();
      if (!themeTranslationState.pool.length) return;
      themeTranslationState.index = (themeTranslationState.index - 1 + themeTranslationState.pool.length) % themeTranslationState.pool.length;
      themeTranslationState.submitted = false;
      themeTranslationState.lastInput = "";
      themeTranslationState.showHints = false;
      renderThemeTranslationPractice();
    }

    function themeTranslationMainAction() {
      const item = currentThemeTranslation();
      if (themeTranslationState.submitted) {
        if (item) recordThemeTranslation(item, "good");
        nextThemeTranslation();
      } else if (themeTranslationState.mode === "compare") {
        nextThemeTranslation();
      } else {
        submitThemeTranslation();
      }
    }

    function scopedKnowledgeCards() {
      return KNOWLEDGE_CARDS.filter(item => item.track === knowledgeState.track && item.unit === knowledgeState.unit);
    }

    function renderKnowledgeCards() {
      const cards = scopedKnowledgeCards();
      const trackLabel = knowledgeState.track === "writing" ? "Writing PPT Knowledge" : "Textbook PPT Knowledge";
      $("knowledgeScope").textContent = `${knowledgeState.unit} / ${trackLabel}`;
      $("knowledgeTitle").textContent = knowledgeState.track === "writing" ? "Writing 复习卡片" : "课文复习卡片";
      $("knowledgeTotalStat").textContent = cards.length;
      $("knowledgeSourceStat").textContent = knowledgeState.track === "writing" ? "Writing PPT" : "Theme + Case PPT";
      $("knowledgePdfActions").innerHTML = renderKnowledgePdfActions();
      $("knowledgeList").innerHTML = cards.length ? cards.map(renderKnowledgeCard).join("") : `<div class="panel muted">当前单元暂无知识卡片</div>`;
    }

    function knowledgePdfNotes() {
      const unitNumber = knowledgeState.unit.replace("Unit", "");
      if (knowledgeState.track === "writing") {
        return NOTE_PDFS.filter(note => note.group === "Writing" && note.title.includes(`Unit ${unitNumber}`));
      }
      return NOTE_PDFS.filter(note =>
        (note.group === "Theme Reading" || note.group === "Case Study")
        && note.title.includes(`Unit ${unitNumber}`)
      );
    }

    function renderKnowledgePdfActions() {
      const notes = knowledgePdfNotes();
      if (!notes.length) return `<span class="muted">暂无 PDF</span>`;
      return notes.map(note => `
        <a class="pdf-action" href="${escapeHtml(note.file)}" target="_blank" rel="noopener">
          ${escapeHtml(note.group === "Theme Reading" ? "Theme" : (note.group === "Case Study" ? "Case" : "Writing"))}
        </a>
      `).join("");
    }

    function renderKnowledgeCard(card) {
      const points = card.points.map(point => `<li>${escapeHtml(point)}</li>`).join("");
      const terms = card.terms.map(term => `<span class="keyword">${escapeHtml(term)}</span>`).join("");
      return `
        <article class="knowledge-card">
          <div class="knowledge-card-head">
            <div>
              <div class="label">${escapeHtml(card.source)} · ${escapeHtml(card.slides)}</div>
              <h3>${escapeHtml(card.title)}</h3>
            </div>
            <span class="knowledge-unit">${escapeHtml(card.unit)}</span>
          </div>
          <p>${escapeHtml(card.summary)}</p>
          <ul>${points}</ul>
          <div class="keywords">${terms}</div>
        </article>
      `;
    }

    function caseBodyForCloze(item) {
      let text = item.text || "";
      if (item.title && text.startsWith(item.title)) {
        text = text.slice(item.title.length).trim();
      }
      return text
        .replace(/\s*Unit\s+\d+[^.]*\d+\s*$/g, "")
        .replace(/\s*医学英语基础教程 English for Medical Students and Doctors \d+\s*/g, " ")
        .replace(/\s*Figure \d\.[\s\S]*?(?=The postoperative period|$)/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function shuffleArray(values) {
      const copy = [...values];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function pickClozeCandidates(item) {
      const body = caseBodyForCloze(item);
      const termCandidates = item.blankCandidates
        .map(candidate => ({ ...candidate, span: resolveClozeSpan(body, candidate) }))
        .filter(candidate => candidate.span)
        .sort((a, b) => a.span.start - b.span.start);
      const languageCandidates = clozeLanguageCandidates(item);
      const termCount = Math.min(9, termCandidates.length);
      const languageCount = Math.min(7, languageCandidates.length);
      const picked = [
        ...shuffleArray(termCandidates).slice(0, termCount),
        ...shuffleArray(languageCandidates).slice(0, languageCount)
      ];
      const pool = [...termCandidates, ...languageCandidates].filter(candidate => !picked.includes(candidate));
      const targetCount = CLOZE_BLANKS_PER_ATTEMPT + 8;
      while (picked.length < targetCount && pool.length) {
        picked.push(pool.shift());
      }
      return shuffleArray(picked).slice(0, targetCount);
    }

    function clozeLanguageCandidates(item) {
      const body = caseBodyForCloze(item);
      const patterns = [
        { anchor: "comes to the clinic with", answer: "with", type: "preposition", meaning: "come with 固定搭配", distractors: ["for", "to", "at"] },
        { anchor: "has a history of", answer: "of", type: "preposition", meaning: "history of 固定搭配", distractors: ["for", "with", "in"] },
        { anchor: "positive for", answer: "for", type: "preposition", meaning: "positive for 固定搭配", distractors: ["of", "with", "to"] },
        { anchor: "started on IV antibiotics", answer: "on", type: "preposition", meaning: "start on medication", distractors: ["in", "with", "at"] },
        { anchor: "in anticipation of discharge", answer: "in", type: "preposition", meaning: "in anticipation of 固定搭配", distractors: ["on", "at", "for"] },
        { anchor: "diagnosed with", answer: "with", type: "preposition", meaning: "be diagnosed with", distractors: ["as", "by", "for"] },
        { anchor: "transferred to", answer: "to", type: "preposition", meaning: "be transferred to", distractors: ["for", "with", "from"] },
        { anchor: "placed in a supine position", answer: "in", type: "preposition", meaning: "placed in a position", distractors: ["on", "at", "by"] },
        { anchor: "given into the aortic root", answer: "into", type: "preposition", meaning: "given into", distractors: ["onto", "from", "with"] },
        { anchor: "counteract the heparin", answer: "counteract", type: "verb", meaning: "抵消/中和", distractors: ["confirm", "conduct", "contract"] },
        { anchor: "sustained a ruptured liver", answer: "sustained", type: "verb", meaning: "遭受损伤", distractors: ["maintained", "contained", "obtained"] },
        { anchor: "decreased to", answer: "to", type: "preposition", meaning: "decrease to 降至", distractors: ["by", "from", "with"] },
        { anchor: "mixed with an anticoagulant", answer: "with", type: "preposition", meaning: "mixed with", distractors: ["by", "to", "from"] },
        { anchor: "transfused back to her", answer: "to", type: "preposition", meaning: "transfuse back to", distractors: ["for", "with", "on"] },
        { anchor: "admitted because of", answer: "because of", type: "linking phrase", meaning: "因为", distractors: ["instead of", "according to", "prior to"] },
        { anchor: "suspected as", answer: "as", type: "preposition", meaning: "be suspected as", distractors: ["for", "with", "to"] },
        { anchor: "associated with", answer: "with", type: "preposition", meaning: "associated with", distractors: ["to", "from", "by"] },
        { anchor: "revealed abnormal", answer: "revealed", type: "verb", meaning: "显示/揭示", distractors: ["relieved", "received", "removed"] },
        { anchor: "admitted to the inpatient unit", answer: "to", type: "preposition", meaning: "be admitted to", distractors: ["for", "with", "by"] },
        { anchor: "unresponsive to analgesics", answer: "to", type: "preposition", meaning: "unresponsive to", distractors: ["for", "with", "from"] },
        { anchor: "confirmed by a renal ultrasound", answer: "by", type: "preposition", meaning: "confirmed by", distractors: ["with", "for", "to"] },
        { anchor: "transferred to surgery", answer: "to", type: "preposition", meaning: "be transferred to", distractors: ["for", "from", "with"] },
        { anchor: "removed from the renal pelvis", answer: "from", type: "preposition", meaning: "removed from", distractors: ["to", "with", "by"] },
        { anchor: "admitted in our department due to", answer: "due to", type: "linking phrase", meaning: "由于", distractors: ["as to", "next to", "up to"] },
        { anchor: "within normal limits", answer: "within", type: "preposition", meaning: "within normal limits", distractors: ["without", "between", "under"] },
        { anchor: "basis for the diagnosis", answer: "for", type: "preposition", meaning: "basis for", distractors: ["of", "with", "to"] },
        { anchor: "significant for a giant", answer: "for", type: "preposition", meaning: "significant for", distractors: ["to", "with", "by"] }
      ];
      return patterns
        .filter(pattern => body.toLowerCase().includes(pattern.anchor.toLowerCase()))
        .map(pattern => ({
          ...pattern,
          index: body.toLowerCase().indexOf(pattern.anchor.toLowerCase()),
          options: shuffleArray([pattern.answer, ...pattern.distractors])
        }));
    }

    function clozeOptionPool(item, correctAnswer) {
      const local = item.blankCandidates.map(candidate => candidate.answer);
      const all = CLOZE_CASES.flatMap(caseItem => caseItem.blankCandidates.map(candidate => candidate.answer));
      const pool = [...new Set([...local, ...all])].filter(answer => answer !== correctAnswer);
      return shuffleArray(pool).slice(0, 3);
    }

    function clozeOptionsForCandidate(item, candidate) {
      if (candidate.options) return candidate.options;
      const preferred = Array.isArray(candidate.distractors) ? candidate.distractors : [];
      const fillers = clozeOptionPool(item, candidate.answer);
      const distractors = [...new Set([...preferred, ...fillers])]
        .filter(option => option && option !== candidate.answer)
        .slice(0, 3);
      return shuffleArray([candidate.answer, ...distractors]);
    }

    function isClozeWordChar(char) {
      return /[A-Za-z0-9]/.test(char || "");
    }

    function findSafePhrase(text, phrase, from = 0) {
      const lowerText = text.toLowerCase();
      const lowerPhrase = String(phrase || "").toLowerCase();
      if (!lowerPhrase) return -1;
      let index = lowerText.indexOf(lowerPhrase, from);
      while (index >= 0) {
        const before = text[index - 1] || "";
        const after = text[index + phrase.length] || "";
        if (!isClozeWordChar(before) && !isClozeWordChar(after)) return index;
        index = lowerText.indexOf(lowerPhrase, index + 1);
      }
      return -1;
    }

    function resolveClozeSpan(body, candidate) {
      const target = candidate.target || candidate.answer;
      if (!target) return null;
      if (candidate.anchor) {
        const anchorStart = body.toLowerCase().indexOf(candidate.anchor.toLowerCase());
        if (anchorStart < 0) return null;
        const anchorText = body.slice(anchorStart, anchorStart + candidate.anchor.length);
        const targetOffset = anchorText.toLowerCase().indexOf(String(target).toLowerCase());
        if (targetOffset < 0) return null;
        const start = anchorStart + targetOffset;
        return { start, end: start + String(target).length };
      }
      const start = findSafePhrase(body, candidate.answer);
      if (start < 0) return null;
      return { start, end: start + String(candidate.answer).length };
    }

    function spansOverlap(a, b) {
      return a.start < b.end && b.start < a.end;
    }

    function sentenceBoundsForSpan(body, span) {
      const before = body.slice(0, span.start);
      const sentenceStart = Math.max(before.lastIndexOf("."), before.lastIndexOf("?"), before.lastIndexOf("!")) + 1;
      const after = body.slice(span.end);
      const endOffsets = [after.indexOf("."), after.indexOf("?"), after.indexOf("!")]
        .filter(index => index >= 0);
      const sentenceEnd = endOffsets.length ? span.end + Math.min(...endOffsets) + 1 : body.length;
      const raw = body.slice(sentenceStart, sentenceEnd);
      const leading = raw.match(/^\s*/)?.[0].length || 0;
      const trailing = raw.match(/\s*$/)?.[0].length || 0;
      return {
        start: sentenceStart + leading,
        end: sentenceEnd - trailing,
        text: raw.trim()
      };
    }

    function buildCloze(item) {
      const body = caseBodyForCloze(item);
      const candidates = pickClozeCandidates(item);
      const blanks = [];
      candidates
        .map(candidate => ({ ...candidate, span: candidate.span || resolveClozeSpan(body, candidate) }))
        .filter(candidate => candidate.span)
        .sort((a, b) => a.span.start - b.span.start)
        .forEach(candidate => {
          if (blanks.length >= CLOZE_BLANKS_PER_ATTEMPT) return;
          if (blanks.some(blank => spansOverlap(blank.span, candidate.span))) return;
          blanks.push(candidate);
        });
      const numberedBlanks = blanks.map((candidate, index) => {
        const options = clozeOptionsForCandidate(item, candidate);
        return {
          ...candidate,
          number: index + 1,
          options,
          question: clozeQuestionText(body, candidate)
        };
      });
      const blankedPassage = renderBlankedClozePassage(body, numberedBlanks);
      clozeState = {
        caseItem: item,
        blanks: numberedBlanks,
        submitted: false,
        showOriginal: false,
        answers: {},
        original: body,
        blankedPassage
      };
    }

    function renderBlankedClozePassage(body, blanks) {
      const replacements = blanks
        .filter(blank => blank.span)
        .sort((a, b) => a.span.start - b.span.start);
      let cursor = 0;
      const parts = [];
      replacements.forEach(blank => {
        const { start, end } = blank.span;
        if (start < cursor) return;
        parts.push(escapeHtml(body.slice(cursor, start)));
        parts.push(`<span class="cloze-text-blank">${blank.number}</span>`);
        cursor = end;
      });
      parts.push(escapeHtml(body.slice(cursor)));
      return parts.join("");
    }

    function clozeQuestionText(body, candidate) {
      const span = candidate.span || resolveClozeSpan(body, candidate);
      if (!span) return "";
      const sentence = sentenceBoundsForSpan(body, span);
      const relativeStart = span.start - sentence.start;
      const relativeEnd = span.end - sentence.start;
      return `${sentence.text.slice(0, relativeStart).trimStart()}_____${sentence.text.slice(relativeEnd).trimEnd()}`.trim();
    }

    function escapeRegExp(value) {
      return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function startCloze(caseId) {
      const item = CLOZE_CASES.find(caseItem => caseItem.caseId === caseId) || CLOZE_CASES[0];
      if (!item) return;
      buildCloze(item);
      showScreen("clozeScreen");
      renderCloze();
    }

    function newCloze() {
      const item = clozeState.caseItem || CLOZE_CASES[Math.floor(Math.random() * CLOZE_CASES.length)];
      if (!item) return;
      buildCloze(item);
      renderCloze();
    }

    function renderCloze() {
      const item = clozeState.caseItem;
      if (!item) return;
      $("clozeScope").textContent = `${item.unit} / Case Cloze`;
      $("clozeTitle").textContent = `${item.caseId} ${item.title}`;
      $("clozeBlankStat").textContent = clozeState.blanks.length;
      $("clozeScoreStat").textContent = clozeState.submitted ? clozeScoreText() : "-";
      $("clozeSourceStat").textContent = `题库 ${item.blankCandidates.length}`;
      $("clozeFeedback").textContent = clozeState.submitted ? "已提交，可在下方核对答案。" : "上方文章已挖空，题目在文章下方单独作答。";
      $("clozeFeedback").className = `feedback ${clozeState.submitted ? "good" : ""}`;
      $("submitClozeBtn").disabled = clozeState.submitted || !clozeState.blanks.length;
      $("showClozeOriginalBtn").textContent = clozeState.showOriginal ? "隐藏原文" : "显示原文";
      $("clozePassage").innerHTML = clozeState.showOriginal
        ? `<div class="cloze-original">${escapeHtml(clozeState.original)}</div>`
        : `<div class="cloze-original">${clozeState.blankedPassage}</div>`;
      $("clozeQuestionList").innerHTML = renderClozeQuestions();
      $("clozeReviewPanel").hidden = !clozeState.submitted;
      $("clozeReviewList").innerHTML = clozeState.submitted ? renderClozeReview() : "";
    }

    function renderClozeQuestions() {
      return clozeState.blanks.map(blank => {
        const selected = clozeState.answers?.[blank.number] || "";
        const ok = clozeState.submitted && selected === blank.answer;
        const bad = clozeState.submitted && selected !== blank.answer;
        const options = blank.options.map((option, index) => {
          const id = `cloze-${blank.number}-${index}`;
          return `
            <label class="cloze-option">
              <input id="${id}" type="radio" name="cloze-${blank.number}" value="${escapeHtml(option)}" ${selected === option ? "checked" : ""} ${clozeState.submitted ? "disabled" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>
          `;
        }).join("");
        const answer = clozeState.submitted ? `<div class="cloze-answer ${ok ? "good" : "bad"}">${ok ? "正确" : `答案：${escapeHtml(blank.answer)}`}</div>` : "";
        return `
          <div class="cloze-question ${ok ? "correct" : ""} ${bad ? "wrong" : ""}">
            <div class="cloze-question-title">${blank.number}. ${escapeHtml(blank.question)}</div>
            <div class="cloze-options">${options}</div>
            ${answer}
          </div>
        `;
      }).join("");
    }

    function clozeScore() {
      let correct = 0;
      clozeState.blanks.forEach(blank => {
        const selected = clozeState.answers?.[blank.number] || "";
        if (selected === blank.answer) correct += 1;
      });
      return correct;
    }

    function clozeScoreText() {
      return `${clozeScore()} / ${clozeState.blanks.length}`;
    }

    function submitCloze() {
      if (!clozeState.caseItem || clozeState.submitted) return;
      const answers = {};
      clozeState.blanks.forEach(blank => {
        const input = document.querySelector(`input[name="cloze-${blank.number}"]:checked`);
        answers[blank.number] = input?.value || "";
      });
      clozeState.answers = answers;
      clozeState.submitted = true;
      renderCloze();
    }

    function renderClozeReview() {
      return clozeState.blanks.map(blank => {
        const selected = clozeState.answers?.[blank.number] || "";
        const ok = selected === blank.answer;
        const meaning = blank.meaning ? ` · ${escapeHtml(blank.meaning)}` : "";
        return `<div class="list-item ${ok ? "cloze-review-good" : "cloze-review-bad"}"><strong>${blank.number}. ${escapeHtml(blank.answer)}</strong><span>${escapeHtml(blank.type || "term")}${meaning}</span>${selected && !ok ? `<span class="muted">你的选择：${escapeHtml(selected)}</span>` : ""}</div>`;
      }).join("");
    }

    const CLOZE_EXTERNAL_DISTRACTORS = {
      medical_term: [
        "myocardial infarction", "pneumonia", "hypertension", "arrhythmia", "thrombus",
        "pulmonary embolism", "cardiac tamponade", "septic shock", "renal failure",
        "hypoglycemia", "atrial fibrillation", "pleural effusion", "pulmonary edema",
        "deep vein thrombosis", "acute pancreatitis", "hyperthyroidism", "anemia",
        "cellulitis", "meningitis", "osteoporosis"
      ],
      collocation: [
        "be associated with", "be admitted for", "be treated with", "be complicated by",
        "be diagnosed with", "be referred for", "be discharged on", "be evaluated for",
        "be negative for", "be resistant to", "be consistent with", "be responsive to",
        "in preparation for", "in response to", "as a result of", "on examination"
      ],
      preposition: [
        "in", "on", "at", "for", "with", "of", "to", "from", "by", "through", "within", "into"
      ],
      verb_phrase: [
        "presented", "complained of", "developed", "received", "underwent",
        "demonstrated", "confirmed", "required", "resolved", "returned",
        "continued", "improved", "recovered", "revealed", "indicated"
      ],
      logic_word: [
        "however", "therefore", "although", "while", "thus", "because of",
        "as a result", "whereas", "after", "before"
      ]
    };

    const CLOZE_LANGUAGE_PATTERNS = [
      { anchor: "comes to the clinic with", answer: "with", type: "preposition", phrase: "comes to the clinic with", explanation: "Fixed pattern: come to the clinic with symptoms." },
      { anchor: "presented with complaints of", answer: "presented with", type: "collocation", phrase: "presented with complaints of", explanation: "presented with introduces the chief complaint." },
      { anchor: "There was no history of", answer: "no history of", target: "no history of", type: "collocation", phrase: "There was no history of", explanation: "no history of rules out prior illness or exposure." },
      { anchor: "has a history of", answer: "history of", target: "history of", type: "collocation", phrase: "has a history of", explanation: "Use history of for past medical problems." },
      { anchor: "history of", answer: "of", type: "preposition", phrase: "history of", explanation: "history of is the standard medical collocation." },
      { anchor: "born at term", answer: "at term", type: "prepositional_phrase", phrase: "born at term", explanation: "at term describes normal gestational timing." },
      { anchor: "Physical examination revealed", answer: "revealed", type: "verb_phrase", phrase: "Physical examination revealed", explanation: "revealed introduces examination findings." },
      { anchor: "Transthoracic echocardiography revealed", answer: "revealed", type: "verb_phrase", phrase: "echocardiography revealed", explanation: "revealed reports a test finding." },
      { anchor: "However", answer: "However", type: "logic_word", phrase: "However", explanation: "However marks contrast with the previous finding." },
      { anchor: "appropriate for his age", answer: "appropriate for", type: "collocation", phrase: "appropriate for his age", explanation: "appropriate for means suitable for a reference group." },
      { anchor: "in good health", answer: "in good health", type: "prepositional_phrase", phrase: "in good health", explanation: "in good health describes health status." },
      { anchor: "did not have", answer: "did not have", type: "verb_phrase", phrase: "did not have any problems", explanation: "did not have negates the finding in the history." },
      { anchor: "in lying position", answer: "in lying position", type: "prepositional_phrase", phrase: "in lying position", explanation: "in lying position describes how blood pressure was measured." },
      { anchor: "difficult to recognize", answer: "difficult to recognize", type: "collocation", phrase: "difficult to recognize", explanation: "The phrase describes diagnostic difficulty." },
      { anchor: "sent to the hospital for", answer: "sent to", target: "sent to", type: "verb_phrase", phrase: "sent to the hospital for", explanation: "sent to shows referral or transfer." },
      { anchor: "positive for", answer: "positive for", target: "positive for", type: "collocation", phrase: "positive for Staphylococcus aureus", explanation: "positive for reports a positive test result." },
      { anchor: "is started on", answer: "started on", target: "started on", type: "collocation", phrase: "is started on IV antibiotics", explanation: "started on is used for beginning treatment." },
      { anchor: "at this time", answer: "at this time", type: "prepositional_phrase", phrase: "at this time", explanation: "at this time means currently in the case course." },
      { anchor: "in the hospital setting", answer: "in the hospital setting", type: "prepositional_phrase", phrase: "in the hospital setting", explanation: "The phrase gives the treatment setting." },
      { anchor: "in anticipation of", answer: "in anticipation of", type: "collocation", phrase: "in anticipation of discharge", explanation: "in anticipation of means before an expected event." },
      { anchor: "diagnosed with", answer: "diagnosed with", type: "collocation", phrase: "diagnosed with", explanation: "Use diagnosed with before a disease." },
      { anchor: "transferred to", answer: "transferred to", type: "verb_phrase", phrase: "transferred to", explanation: "transferred to gives the destination." },
      { anchor: "placed in a supine position", answer: "placed in", target: "placed in", type: "collocation", phrase: "placed in a supine position", explanation: "placed in is used for patient positioning." },
      { anchor: "given general endotracheal anesthesia", answer: "given", type: "verb_phrase", phrase: "given general endotracheal anesthesia", explanation: "given introduces anesthesia or medicine." },
      { anchor: "entered longitudinally through", answer: "through", type: "preposition", phrase: "entered longitudinally through", explanation: "through gives the surgical route." },
      { anchor: "was established", answer: "established", type: "verb_phrase", phrase: "circulation was established", explanation: "established means set up or started." },
      { anchor: "given into the aortic root", answer: "into", type: "preposition", phrase: "given into the aortic root", explanation: "into marks movement into a structure." },
      { anchor: "for myocardial protection", answer: "for", type: "preposition", phrase: "for myocardial protection", explanation: "for introduces purpose." },
      { anchor: "proved to be competent", answer: "proved to be", type: "collocation", phrase: "proved to be competent", explanation: "proved to be reports the valve test result." },
      { anchor: "removed from the heart", answer: "removed from", type: "verb_phrase", phrase: "removed from the heart", explanation: "removed from shows source or origin." },
      { anchor: "resumed with", answer: "with", type: "preposition", phrase: "resumed with normal sinus rhythm", explanation: "with introduces the resulting rhythm." },
      { anchor: "counteract the heparin", answer: "counteract", type: "verb_phrase", phrase: "counteract the heparin", explanation: "counteract means neutralize the drug effect." },
      { anchor: "recovered from", answer: "recovered from", type: "verb_phrase", phrase: "recovered from her surgery", explanation: "recovered from is used after illness or surgery." },
      { anchor: "sustained a ruptured liver", answer: "sustained", type: "verb_phrase", phrase: "sustained a ruptured liver", explanation: "sustained means suffered an injury." },
      { anchor: "needed to stop", answer: "needed to", type: "collocation", phrase: "needed to stop", explanation: "needed to expresses clinical necessity." },
      { anchor: "decreased to", answer: "decreased to", type: "verb_phrase", phrase: "decreased to", explanation: "decreased to gives the final value." },
      { anchor: "mixed with an anticoagulant", answer: "mixed with", type: "collocation", phrase: "mixed with an anticoagulant", explanation: "mixed with describes combination with another substance." },
      { anchor: "transfused back to", answer: "transfused back to", type: "verb_phrase", phrase: "transfused back to her", explanation: "transfused back to gives the recipient." },
      { anchor: "admitted because of", answer: "because of", type: "logic_word", phrase: "admitted because of", explanation: "because of introduces a reason." },
      { anchor: "suspected as", answer: "suspected as", type: "collocation", phrase: "suspected as", explanation: "suspected as introduces the possible diagnosis." },
      { anchor: "associated with", answer: "associated with", type: "collocation", phrase: "associated with", explanation: "associated with links a condition and a finding." },
      { anchor: "admitted to the inpatient unit", answer: "admitted to", type: "collocation", phrase: "admitted to the inpatient unit", explanation: "admitted to gives the destination of admission." },
      { anchor: "unresponsive to analgesics", answer: "unresponsive to", type: "collocation", phrase: "unresponsive to analgesics", explanation: "unresponsive to means not improved by treatment." },
      { anchor: "confirmed by a renal ultrasound", answer: "confirmed by", type: "collocation", phrase: "confirmed by a renal ultrasound", explanation: "confirmed by gives the confirming test." },
      { anchor: "transferred to surgery", answer: "transferred to", type: "verb_phrase", phrase: "transferred to surgery", explanation: "transferred to gives the next clinical step." },
      { anchor: "admitted in our department due to", answer: "due to", type: "logic_word", phrase: "admitted due to", explanation: "due to introduces a reason." },
      { anchor: "diagnosed with Cushing", answer: "diagnosed with", type: "collocation", phrase: "diagnosed with Cushing's syndrome", explanation: "diagnosed with introduces the final diagnosis." },
      { anchor: "due to a right adrenal adenoma", answer: "due to", type: "logic_word", phrase: "due to a right adrenal adenoma", explanation: "due to introduces the cause." },
      { anchor: "After thorough investigation", answer: "After", type: "logic_word", phrase: "After thorough investigation", explanation: "After marks the sequence before treatment." },
      { anchor: "control of hypertension", answer: "control of", type: "collocation", phrase: "control of hypertension", explanation: "control of describes managing a condition." },
      { anchor: "was performed", answer: "performed", type: "verb_phrase", phrase: "adrenalectomy was performed", explanation: "performed reports the operation." },
      { anchor: "had good clinical recovery", answer: "clinical recovery", type: "collocation", phrase: "good clinical recovery", explanation: "clinical recovery describes improvement after treatment." },
      { anchor: "along with", answer: "along with", type: "collocation", phrase: "along with incidents of", explanation: "along with adds another symptom or finding." },
      { anchor: "for the past", answer: "for the past", type: "prepositional_phrase", phrase: "for the past 8 months", explanation: "for the past gives a duration." },
      { anchor: "within normal limits", answer: "within normal limits", type: "collocation", phrase: "within normal limits", explanation: "within normal limits means in the reference range." },
      { anchor: "setting the basis for", answer: "basis for", target: "basis for", type: "collocation", phrase: "basis for the diagnosis", explanation: "basis for introduces diagnostic support." },
      { anchor: "revealed a normal sized", answer: "revealed", type: "verb_phrase", phrase: "ultrasound scan revealed", explanation: "revealed reports an imaging result." },
      { anchor: "located on", answer: "located on", type: "collocation", phrase: "located on the left lower side", explanation: "located on gives anatomical position." },
      { anchor: "signifying a possible", answer: "signifying", type: "verb_phrase", phrase: "signifying a possible adenoma", explanation: "signifying means indicating." },
      { anchor: "taken to the operating room", answer: "taken to", type: "verb_phrase", phrase: "taken to the operating room", explanation: "taken to gives the destination." },
      { anchor: "performed by", answer: "performed by", type: "collocation", phrase: "performed by a surgeon", explanation: "performed by identifies the operator." },
      { anchor: "attached on", answer: "attached on", type: "collocation", phrase: "attached on the posterior side", explanation: "attached on gives the attachment site." },
      { anchor: "sent for pathologic examination", answer: "sent for", type: "collocation", phrase: "sent for pathologic examination", explanation: "sent for gives the requested test." },
      { anchor: "returned within normal limits", answer: "returned within", type: "verb_phrase", phrase: "returned within normal limits", explanation: "returned within describes normalization." },
      { anchor: "discharged on the next day", answer: "discharged", type: "verb_phrase", phrase: "discharged on the next day", explanation: "discharged marks leaving the hospital." },
      { anchor: "reported no further symptoms", answer: "reported", type: "verb_phrase", phrase: "reported no further symptoms", explanation: "reported introduces follow-up symptoms." }
    ];

    function normalizeClozeAnswer(value) {
      return String(value || "")
        .toLowerCase()
        .replace(/[’‘`]/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    }

    function clozeType(candidate) {
      const raw = String(candidate.type || "").toLowerCase();
      if (raw.includes("preposition")) return raw.includes("phrase") ? "prepositional_phrase" : "preposition";
      if (raw.includes("collocation")) return "collocation";
      if (raw.includes("verb")) return "verb_phrase";
      if (raw.includes("logic") || raw.includes("linking")) return "logic_word";
      return "medical_term";
    }

    function clozeDistractorType(type) {
      return type === "prepositional_phrase" ? "preposition" : type;
    }

    function countWordsBefore(body, index) {
      const before = body.slice(0, Math.max(0, index));
      const matches = before.match(/[A-Za-z]+(?:[-'][A-Za-z]+)?|\d+(?:\.\d+)?/g);
      return matches ? matches.length : 0;
    }

    function clozeCandidatePoolForCase(item) {
      const body = caseBodyForCloze(item);
      const baseCandidates = (item.blankCandidates || []).map((candidate, index) => ({
        ...candidate,
        id: candidate.id || `term-${index + 1}`,
        type: clozeType(candidate),
        phrase: candidate.phrase || candidate.answer,
        explanation: candidate.explanation || candidate.reason || candidate.meaning || "Core term from the case passage."
      }));
      const languageCandidates = clozeLanguageCandidates(item);
      const resolved = [...baseCandidates, ...languageCandidates]
        .map(candidate => {
          const span = candidate.span || resolveClozeSpan(body, candidate);
          if (!span) return null;
          return {
            ...candidate,
            span,
            type: clozeType(candidate),
            wordIndex: candidate.wordIndex ?? countWordsBefore(body, span.start)
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.span.start - b.span.start);

      const seen = new Set();
      const unique = resolved.filter(candidate => {
        const key = `${normalizeClozeAnswer(candidate.answer)}|${candidate.span.start}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return limitClozeCandidatePool(unique, body);
    }

    function limitClozeCandidatePool(candidates, body) {
      const maxPoolSize = 30;
      if (candidates.length <= maxPoolSize) return candidates;
      const selected = [];
      const segments = Array.from({ length: 10 }, (_, index) => {
        const start = Math.floor((body.length * index) / 10);
        const end = Math.floor((body.length * (index + 1)) / 10);
        return { start, end };
      });

      segments.forEach(segment => {
        const local = candidates
          .filter(candidate => candidate.span.start >= segment.start && candidate.span.start < segment.end)
          .filter(candidate => !selected.includes(candidate))
          .sort((a, b) => typeNeedScore(b, selected) - typeNeedScore(a, selected));
        local.slice(0, 3).forEach(candidate => {
          if (selected.length < maxPoolSize) selected.push(candidate);
        });
      });

      candidates.forEach(candidate => {
        if (selected.length < maxPoolSize && !selected.includes(candidate)) selected.push(candidate);
      });

      return selected.sort((a, b) => a.span.start - b.span.start);
    }

    function clozeLanguageCandidates(item) {
      const body = caseBodyForCloze(item);
      const lowerBody = body.toLowerCase();
      return CLOZE_LANGUAGE_PATTERNS
        .filter(pattern => lowerBody.includes(pattern.anchor.toLowerCase()))
        .map((pattern, index) => ({
          ...pattern,
          id: `language-${index + 1}-${normalizeClozeAnswer(pattern.answer).replace(/[^a-z0-9]+/g, "-")}`,
          type: pattern.type,
          meaning: pattern.meaning || pattern.explanation,
          explanation: pattern.explanation,
          phrase: pattern.phrase || pattern.anchor
        }));
    }

    function candidateFitsSelection(candidate, selected, options = {}) {
      if (selected.some(blank => spansOverlap(blank.span, candidate.span))) return false;
      if (selected.some(blank => normalizeClozeAnswer(blank.answer) === normalizeClozeAnswer(candidate.answer))) return false;
      const minGap = options.minGap ?? 8;
      if (minGap && selected.some(blank => Math.abs(blank.wordIndex - candidate.wordIndex) < minGap)) return false;
      const type = clozeType(candidate);
      const typeCounts = selected.reduce((counts, blank) => {
        const blankType = clozeType(blank);
        counts[blankType] = (counts[blankType] || 0) + 1;
        return counts;
      }, {});
      if (!options.relaxedTypes) {
        if ((type === "preposition" || type === "prepositional_phrase") && (typeCounts.preposition || 0) + (typeCounts.prepositional_phrase || 0) >= 2) return false;
        if (type === "logic_word" && (typeCounts.logic_word || 0) >= 1) return false;
      }
      return true;
    }

    function typeNeedScore(candidate, selected) {
      const desired = {
        medical_term: 4,
        collocation: 3,
        verb_phrase: 2,
        preposition: 1,
        prepositional_phrase: 1,
        logic_word: 1
      };
      const type = clozeType(candidate);
      const current = selected.filter(blank => clozeType(blank) === type).length;
      return Math.max(0, (desired[type] || 1) - current);
    }

    function chooseBestClozeCandidate(candidates, selected) {
      const shuffled = shuffleArray(candidates);
      return shuffled
        .map(candidate => ({
          candidate,
          score: typeNeedScore(candidate, selected) * 10 + Math.random()
        }))
        .sort((a, b) => b.score - a.score)[0]?.candidate || null;
    }

    function pickClozeCandidates(item) {
      const body = caseBodyForCloze(item);
      const pool = clozeCandidatePoolForCase(item);
      const selected = [];
      const segments = Array.from({ length: CLOZE_BLANKS_PER_ATTEMPT }, (_, index) => {
        const start = Math.floor((body.length * index) / CLOZE_BLANKS_PER_ATTEMPT);
        const end = Math.floor((body.length * (index + 1)) / CLOZE_BLANKS_PER_ATTEMPT);
        return { start, end };
      });

      segments.forEach(segment => {
        if (selected.length >= CLOZE_BLANKS_PER_ATTEMPT) return;
        const local = pool.filter(candidate =>
          candidate.span.start >= segment.start &&
          candidate.span.start < segment.end &&
          candidateFitsSelection(candidate, selected)
        );
        const choice = chooseBestClozeCandidate(local, selected);
        if (choice) selected.push(choice);
      });

      const fillFromPool = (options = {}) => {
        while (selected.length < CLOZE_BLANKS_PER_ATTEMPT) {
          const remaining = pool.filter(candidate =>
            !selected.includes(candidate) &&
            candidateFitsSelection(candidate, selected, options)
          );
          const choice = chooseBestClozeCandidate(remaining, selected);
          if (!choice) break;
          selected.push(choice);
        }
      };

      fillFromPool();
      fillFromPool({ minGap: 4 });
      fillFromPool({ minGap: 0, relaxedTypes: true });

      return selected
        .slice(0, CLOZE_BLANKS_PER_ATTEMPT)
        .sort((a, b) => a.span.start - b.span.start);
    }

    function passageContainsAnswer(body, answer) {
      const type = normalizeClozeAnswer(answer);
      if (!type) return false;
      return normalizeClozeAnswer(body).includes(type);
    }

    function pickClozeDistractors(item, blanks) {
      const body = caseBodyForCloze(item);
      const correct = new Set(blanks.map(blank => normalizeClozeAnswer(blank.answer)));
      const selected = [];
      const typeQueue = blanks.map(blank => clozeDistractorType(clozeType(blank)));
      const fallbackTypes = ["medical_term", "collocation", "verb_phrase", "preposition", "logic_word"];

      function takeFromType(type) {
        const pool = CLOZE_EXTERNAL_DISTRACTORS[type] || [];
        const found = shuffleArray(pool).find(option => {
          const normalized = normalizeClozeAnswer(option);
          if (!normalized || correct.has(normalized)) return false;
          if (selected.some(existing => normalizeClozeAnswer(existing) === normalized)) return false;
          if (type !== "preposition" && passageContainsAnswer(body, option)) return false;
          return true;
        });
        if (found) selected.push(found);
      }

      while (selected.length < CLOZE_DISTRACTOR_COUNT && typeQueue.length) {
        takeFromType(typeQueue.shift());
      }
      while (selected.length < CLOZE_DISTRACTOR_COUNT) {
        const before = selected.length;
        fallbackTypes.forEach(type => {
          if (selected.length < CLOZE_DISTRACTOR_COUNT) takeFromType(type);
        });
        if (selected.length === before) break;
      }
      return selected.slice(0, CLOZE_DISTRACTOR_COUNT);
    }

    function buildClozeWordBank(item, blanks) {
      const correctOptions = blanks.map(blank => ({ text: blank.answer, correct: true }));
      const distractors = pickClozeDistractors(item, blanks).map(text => ({ text, correct: false }));
      return shuffleArray([...correctOptions, ...distractors])
        .slice(0, CLOZE_WORD_BANK_SIZE)
        .map((option, index) => ({
          ...option,
          label: CLOZE_WORD_BANK_LABELS[index],
          normalized: normalizeClozeAnswer(option.text)
        }));
    }

    function wordBankOptionForAnswer(answer) {
      return clozeState.wordBank.find(option => option.normalized === normalizeClozeAnswer(answer));
    }

    function buildCloze(item) {
      const body = caseBodyForCloze(item);
      const candidatePool = clozeCandidatePoolForCase(item);
      const numberedBlanks = pickClozeCandidates(item).map((candidate, index) => ({
        ...candidate,
        number: index + 1,
        question: clozeQuestionText(body, candidate)
      }));
      const wordBank = buildClozeWordBank(item, numberedBlanks);
      const blankedPassage = renderBlankedClozePassage(body, numberedBlanks);
      clozeState = {
        caseItem: item,
        blanks: numberedBlanks,
        wordBank,
        candidatePool,
        submitted: false,
        showOriginal: false,
        answers: {},
        original: body,
        blankedPassage
      };
    }

    function renderClozeWordBank() {
      return `
        <section class="cloze-word-bank" aria-label="Word Bank">
          <div class="cloze-word-bank-title">Word Bank</div>
          <div class="cloze-word-bank-grid">
            ${clozeState.wordBank.map(option => `
              <div class="cloze-word-bank-item">
                <span class="cloze-word-bank-label">${option.label}</span>
                <span>${escapeHtml(option.text)}</span>
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }

    function renderCloze() {
      const item = clozeState.caseItem;
      if (!item) return;
      $("clozeScope").textContent = `${item.unit} / Case Cloze`;
      $("clozeTitle").textContent = `${item.caseId} ${item.title}`;
      $("clozeBlankStat").textContent = clozeState.blanks.length;
      $("clozeScoreStat").textContent = clozeState.submitted ? clozeScoreText() : "-";
      $("clozeSourceStat").textContent = `Pool ${clozeState.candidatePool.length} / Bank ${clozeState.wordBank.length}`;
      $("clozeFeedback").textContent = clozeState.submitted ? "Submitted. Check the review below." : "Choose answers from the shared Word Bank.";
      $("clozeFeedback").className = `feedback ${clozeState.submitted ? "good" : ""}`;
      $("submitClozeBtn").disabled = clozeState.submitted || !clozeState.blanks.length;
      $("showClozeOriginalBtn").textContent = clozeState.showOriginal ? "Hide Original" : "Show Original";
      $("clozePassage").innerHTML = clozeState.showOriginal
        ? `<div class="cloze-original">${escapeHtml(clozeState.original)}</div>`
        : `<div class="cloze-original">${clozeState.blankedPassage}</div>`;
      $("clozeQuestionList").innerHTML = `${renderClozeWordBank()}${renderClozeQuestions()}`;
      bindClozeAnswerSelects();
      $("clozeReviewPanel").hidden = !clozeState.submitted;
      $("clozeReviewList").innerHTML = clozeState.submitted ? renderClozeReview() : "";
    }

    function renderClozeQuestions() {
      return `
        <section class="cloze-answer-sheet" aria-label="Answer Sheet">
          ${clozeState.blanks.map(blank => {
            const selectedLabel = clozeState.answers?.[blank.number] || "";
            const correctOption = wordBankOptionForAnswer(blank.answer);
            const ok = clozeState.submitted && selectedLabel === correctOption?.label;
            const bad = clozeState.submitted && selectedLabel !== correctOption?.label;
            return `
              <label class="cloze-answer-row ${ok ? "correct" : ""} ${bad ? "wrong" : ""}" for="cloze-select-${blank.number}">
                <span class="cloze-answer-number">${blank.number}</span>
                <select id="cloze-select-${blank.number}" class="cloze-bank-select" data-cloze-select="${blank.number}">
                  <option value="">Choose...</option>
                  ${clozeState.wordBank.map(option => `
                    <option value="${option.label}" ${selectedLabel === option.label ? "selected" : ""}>${option.label}. ${escapeHtml(option.text)}</option>
                  `).join("")}
                </select>
                ${clozeState.submitted ? `<span class="cloze-answer-mark">${ok ? "Correct" : "Review"}</span>` : ""}
              </label>
            `;
          }).join("")}
        </section>
      `;
    }

    function bindClozeAnswerSelects() {
      document.querySelectorAll("[data-cloze-select]").forEach(select => {
        const rememberInteraction = () => {
          lastClozeInteraction = {
            activeId: select.id,
            scrollY: window.scrollY
          };
        };
        select.addEventListener("pointerdown", rememberInteraction);
        select.addEventListener("touchstart", rememberInteraction, { passive: true });
        select.addEventListener("focus", rememberInteraction);
        select.addEventListener("change", event => {
          rememberInteraction();
          const number = event.currentTarget.dataset.clozeSelect;
          clozeState.answers[number] = event.currentTarget.value;
        });
      });
    }

    function clozeScore() {
      return clozeState.blanks.reduce((correct, blank) => {
        const selectedLabel = clozeState.answers?.[blank.number] || "";
        const correctOption = wordBankOptionForAnswer(blank.answer);
        return correct + (selectedLabel && selectedLabel === correctOption?.label ? 1 : 0);
      }, 0);
    }

    function clozeScoreText() {
      return `${clozeScore()} / ${clozeState.blanks.length}`;
    }

    function submitCloze(event) {
      event?.preventDefault?.();
      if (!clozeState.caseItem || clozeState.submitted) return;
      const activeId = document.activeElement?.id || lastClozeInteraction.activeId || "";
      const scrollY = activeId && activeId === lastClozeInteraction.activeId
        ? lastClozeInteraction.scrollY
        : window.scrollY;
      document.querySelectorAll("[data-cloze-select]").forEach(select => {
        clozeState.answers[select.dataset.clozeSelect] = select.value;
      });
      clozeState.submitted = true;
      renderCloze();
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: "auto" });
        if (activeId) document.getElementById(activeId)?.focus?.({ preventScroll: true });
      });
    }

    function renderClozeReview() {
      return clozeState.blanks.map(blank => {
        const selectedLabel = clozeState.answers?.[blank.number] || "";
        const selectedOption = clozeState.wordBank.find(option => option.label === selectedLabel);
        const correctOption = wordBankOptionForAnswer(blank.answer);
        const ok = selectedLabel === correctOption?.label;
        const phrase = blank.phrase || blank.question || blank.answer;
        const explanation = blank.explanation || blank.meaning || "Review the phrase in the original case context.";
        return `
          <div class="list-item ${ok ? "cloze-review-good" : "cloze-review-bad"}">
            <strong>${blank.number}. ${ok ? "Correct" : "Incorrect"}</strong>
            <span>Correct answer: ${correctOption?.label || "-"} . ${escapeHtml(blank.answer)}</span>
            <span>Your answer: ${selectedOption ? `${selectedOption.label}. ${escapeHtml(selectedOption.text)}` : "Not answered"}</span>
            <span>Phrase: ${escapeHtml(phrase)}</span>
            <span class="muted">Explanation: ${escapeHtml(explanation)}</span>
          </div>
        `;
      }).join("");
    }

    $("homeBtn").addEventListener("click", () => showScreen("homeScreen"));
    $("supportToggleBtn").addEventListener("click", () => {
      const panel = $("supportPanel");
      const shouldShow = panel.hidden;
      panel.hidden = !shouldShow;
      $("supportToggleBtn").setAttribute("aria-expanded", String(shouldShow));
    });
    $("stopSpeechBtn").addEventListener("click", stopSpeaking);
    $("backToUnits").addEventListener("click", () => showScreen("homeScreen"));
    $("backFromKnowledgeBtn").addEventListener("click", () => showScreen("homeScreen"));
    $("mainBtn").addEventListener("click", mainAction);
    $("nextBtn").addEventListener("click", () => {
      if (isWritingMode(state.mode) && !state.submitted) {
        submitAnswer();
        return;
      }
      nextItem();
    });
    $("prevBtn").addEventListener("click", prevItem);
    $("shuffleBtn").addEventListener("click", shufflePool);
    $("caseMainBtn").addEventListener("click", caseMainAction);
    $("caseNextBtn").addEventListener("click", nextCase);
    $("casePrevBtn").addEventListener("click", prevCase);
    $("themeTranslationMainBtn").addEventListener("click", themeTranslationMainAction);
    $("themeTranslationNextBtn").addEventListener("click", nextThemeTranslation);
    $("themeTranslationPrevBtn").addEventListener("click", prevThemeTranslation);
    $("newClozeBtn").addEventListener("click", newCloze);
    ["pointerdown", "mousedown", "touchstart"].forEach(eventName => {
      $("submitClozeBtn").addEventListener(eventName, event => {
        if (event.cancelable) event.preventDefault();
      }, { passive: false });
    });
    $("submitClozeBtn").addEventListener("click", submitCloze);
    $("showClozeOriginalBtn").addEventListener("click", () => {
      if (!clozeState.caseItem) return;
      clozeState.showOriginal = !clozeState.showOriginal;
      renderCloze();
    });
    $("caseHintBtn").addEventListener("click", () => {
      caseState.showHints = !caseState.showHints;
      renderCasePractice();
    });
    document.addEventListener("click", event => {
      const button = event.target.closest("[data-speech-action]");
      if (!button) return;
      const action = button.dataset.speechAction;
      if (action === "word") {
        const item = currentItem();
        if (item) speakWord(item.term);
      } else if (action === "wordSlow") {
        const item = currentItem();
        if (item) speakWordSlow(item.term);
      } else if (action === "example") {
        const item = currentItem();
        const example = exampleText(item);
        if (example) speakSentence(example);
      } else if (action === "caseSentence") {
        const item = currentCase();
        if (item) speakSentence(item.english);
      } else if (action === "caseSentenceSlow") {
        const item = currentCase();
        if (item) speakText(item.english, { lang: "en-US", rate: 0.62, pitch: 1 });
      } else if (action === "themeTranslationSentence") {
        const item = currentThemeTranslation();
        if (item) speakSentence(item.english);
      } else if (action === "themeTranslationSentenceSlow") {
        const item = currentThemeTranslation();
        if (item) speakText(item.english, { lang: "en-US", rate: 0.62, pitch: 1 });
      }
    });
    $("caseGoodBtn").addEventListener("click", () => {
      const item = currentCase();
      if (item) recordCase(item, "good");
      nextCase();
    });
    $("caseWeakBtn").addEventListener("click", () => {
      const item = currentCase();
      if (item) recordCase(item, "unsure");
      nextCase();
    });
    $("themeTranslationGoodBtn").addEventListener("click", () => {
      const item = currentThemeTranslation();
      if (item) recordThemeTranslation(item, "good");
      nextThemeTranslation();
    });
    $("themeTranslationWeakBtn").addEventListener("click", () => {
      const item = currentThemeTranslation();
      if (item) recordThemeTranslation(item, "unsure");
      nextThemeTranslation();
    });
    $("masterBtn").addEventListener("click", () => {
      const item = currentItem();
      if (item) {
        setMastered(item, true);
        setWrong(item, false);
      }
      state.submitted = false;
      state.lastInput = "";
      renderPractice();
    });
    document.querySelectorAll("[data-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.mode = btn.dataset.mode;
        state.index = 0;
        state.revealed = false;
        state.submitted = false;
        state.lastInput = "";
        renderPractice();
      });
    });
    document.querySelectorAll("[data-case-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        caseState.mode = btn.dataset.caseMode;
        caseState.index = 0;
        caseState.submitted = false;
        caseState.lastInput = "";
        caseState.showHints = false;
        renderCasePractice();
      });
    });
    document.querySelectorAll("[data-theme-translation-mode]").forEach(btn => {
      btn.addEventListener("click", () => {
        themeTranslationState.mode = btn.dataset.themeTranslationMode;
        themeTranslationState.index = 0;
        themeTranslationState.submitted = false;
        themeTranslationState.lastInput = "";
        themeTranslationState.showHints = false;
        renderThemeTranslationPractice();
      });
    });
    $("clearMistakes").addEventListener("click", () => {
      scopedItems().forEach(item => setWrong(item, false));
      renderPractice();
    });
    $("resetCurrentVocabBtn").addEventListener("click", () => {
      if (!confirm(`确定清空 ${state.unit} 的单词进度？`)) return;
      STUDY_VOCAB.filter(item => item.unit === state.unit).forEach(item => {
        delete progress[keyOf(item)];
      });
      saveProgress();
      state.index = 0;
      state.submitted = false;
      state.lastInput = "";
      renderPractice();
    });
    $("clearCaseMistakes").addEventListener("click", () => {
      scopedCases().forEach(item => setCaseWrong(item, false));
      renderCasePractice();
    });
    $("themeTranslationClearMistakes").addEventListener("click", () => {
      scopedThemeTranslations().forEach(item => setThemeTranslationWrong(item, false));
      renderThemeTranslationPractice();
    });
    $("resetCurrentCaseBtn").addEventListener("click", () => {
      if (!confirm(`确定清空 ${caseState.unit} 的病例翻译进度？`)) return;
      CASES.filter(item => item.unit === caseState.unit).forEach(item => {
        delete caseProgress[caseKeyOf(item)];
      });
      saveCaseProgress();
      caseState.index = 0;
      caseState.submitted = false;
      caseState.lastInput = "";
      caseState.showHints = false;
      renderCasePractice();
    });
    $("themeTranslationResetBtn").addEventListener("click", () => {
      if (!confirm(`确定清空 ${themeTranslationState.unit} 的 Theme Reading 翻译进度？`)) return;
      THEME_READING_TRANSLATIONS.filter(item => item.unit === themeTranslationState.unit).forEach(item => {
        delete themeTranslationProgress[themeTranslationKeyOf(item)];
      });
      saveThemeTranslationProgress();
      themeTranslationState.mode = "practice";
      themeTranslationState.index = 0;
      themeTranslationState.submitted = false;
      themeTranslationState.lastInput = "";
      themeTranslationState.showHints = false;
      renderThemeTranslationPractice();
    });
    $("resetBtn").addEventListener("click", () => {
      if (confirm("确定清空全部学习进度？")) {
        progress = {};
        caseProgress = {};
        themeTranslationProgress = {};
        saveProgress();
        saveCaseProgress();
        saveThemeTranslationProgress();
        if (document.getElementById("practiceScreen").classList.contains("active")) renderPractice();
        if (document.getElementById("casePracticeScreen").classList.contains("active")) renderCasePractice();
        if (document.getElementById("themeTranslationScreen").classList.contains("active")) renderThemeTranslationPractice();
      }
    });
    $("exportBtn").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify({ vocabulary: progress, cases: caseProgress, themeReadingTranslations: themeTranslationProgress }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "english-study-progress.json";
      a.click();
      URL.revokeObjectURL(url);
    });
    document.addEventListener("keydown", event => {
      if (event.key !== "Enter") return;
      if (event.isComposing) return;
      const active = document.activeElement;
      if (active && active.id === "answerInput") return;
      event.preventDefault();
      handleEnter();
    });

    renderHome();
  
