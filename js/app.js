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
      submitted: false,
      showOriginal: false
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
        const coreCount = item.blankCandidates.length;
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
      const breakdown = state.mode === "review" && item.category === "Medical terminology" ? renderBreakdown(item) : "";
      const speech = renderWordSpeechControls(item, state.mode === "review" ? "review" : "correct");
      $("answerArea").innerHTML = `${speech}<div class="meaning">${escapeHtml(item.meaning)}</div>${item.note ? `<div class="note">${escapeHtml(item.note)}</div>` : ""}${breakdown}`;
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

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || ('ontouchstart' in window && window.innerWidth <= 768);

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

    function themeTranslationHints(item) {
      const terms = [];
      const sourceText = `${item.heading || ""} ${item.english || ""}`;
      const candidates = sourceText.match(/\b[A-Z][A-Za-z-]{4,}\b|\b[a-z][A-Za-z-]{7,}\b/g) || [];
      candidates.forEach(term => {
        const clean = term.replace(/[.,;:()]/g, "");
        if (!terms.includes(clean) && !["However", "Therefore", "Although", "Because"].includes(clean)) terms.push(clean);
      });
      return terms.slice(0, 8);
    }

    function renderThemeTranslationHints(item) {
      if (!themeTranslationState.submitted && themeTranslationState.mode !== "compare") return "";
      const terms = themeTranslationHints(item);
      const termHtml = terms.length ? terms.map(term => `<span class="keyword">${escapeHtml(term)}</span>`).join("") : `<span class="muted">暂无自动提取要点</span>`;
      return `<div class="keyword-panel"><div class="keyword-title">翻译要点</div><div class="keywords">${termHtml}</div></div>`;
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
      const lowerBody = body.toLowerCase();
      const termCandidates = item.blankCandidates
        .map(candidate => ({ ...candidate, index: lowerBody.indexOf(candidate.answer.toLowerCase()) }))
        .filter(candidate => candidate.index >= 0)
        .sort((a, b) => a.index - b.index);
      const languageCandidates = clozeLanguageCandidates(item);
      const termCount = Math.min(6, termCandidates.length);
      const languageCount = Math.min(4, languageCandidates.length);
      const picked = [
        ...shuffleArray(termCandidates).slice(0, termCount),
        ...shuffleArray(languageCandidates).slice(0, languageCount)
      ];
      const pool = [...termCandidates, ...languageCandidates].filter(candidate => !picked.includes(candidate));
      while (picked.length < CLOZE_BLANKS_PER_ATTEMPT && pool.length) {
        picked.push(pool.shift());
      }
      return shuffleArray(picked).slice(0, CLOZE_BLANKS_PER_ATTEMPT);
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

    function buildCloze(item) {
      const body = caseBodyForCloze(item);
      const candidates = pickClozeCandidates(item);
      const blanks = candidates.map((candidate, index) => {
        const number = index + 1;
        const options = candidate.options || shuffleArray([candidate.answer, ...clozeOptionPool(item, candidate.answer)]);
        return {
          ...candidate,
          number: index + 1,
          options,
          question: clozeQuestionText(body, candidate)
        };
      });
      const blankedPassage = renderBlankedClozePassage(body, blanks);
      clozeState = {
        caseItem: item,
        blanks,
        submitted: false,
        showOriginal: false,
        answers: {},
        original: body,
        blankedPassage
      };
    }

    function renderBlankedClozePassage(body, blanks) {
      const replacements = blanks
        .map(blank => ({ ...blank, index: body.toLowerCase().indexOf(blank.answer.toLowerCase()) }))
        .filter(blank => blank.index >= 0)
        .sort((a, b) => a.index - b.index);
      let cursor = 0;
      const parts = [];
      replacements.forEach(blank => {
        const start = body.toLowerCase().indexOf(blank.answer.toLowerCase(), cursor);
        if (start < cursor) return;
        const end = start + blank.answer.length;
        parts.push(escapeHtml(body.slice(cursor, start)));
        parts.push(`<span class="cloze-text-blank">${blank.number}</span>`);
        cursor = end;
      });
      parts.push(escapeHtml(body.slice(cursor)));
      return parts.join("");
    }

    function clozeQuestionText(body, candidate) {
      const sentences = body.match(/[^.!?]+[.!?]/g) || [body];
      const target = candidate.anchor || candidate.answer;
      const sentence = sentences.find(part => part.toLowerCase().includes(target.toLowerCase())) || body;
      const escaped = escapeRegExp(candidate.answer);
      return sentence.replace(new RegExp(escaped, "i"), "_____").trim();
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
  
