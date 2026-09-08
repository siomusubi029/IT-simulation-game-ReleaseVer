// ===== 描画統合・イベントリスナー登録・初期化 =====
function renderAll() {
  // ゲーム画面が表示されている場合のみ部屋と設備を描画
  if (els.gameScreen && !els.gameScreen.classList.contains('hidden')) {
    renderFloorLabel();
    renderRooms();
    renderEquipment();
  }
  renderStats();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeElements();
  state.equipmentStatus = Object.fromEntries(getActiveEquipment().map((item) => [item.id, "normal"]));
  
  checkOrientation();
  handleResize();
  window.addEventListener("resize", () => {
    checkOrientation();
    handleResize();
  });
  window.addEventListener("orientationchange", () => {
    checkOrientation();
    handleResize();
  });

  els.startButton.addEventListener("click", restartFromGame);
  els.homeButton.addEventListener("click", returnToHome);
  els.homeStartButton.addEventListener("click", enterGameScreen);
  els.overlayStartButton.addEventListener("click", beginBusiness);
  els.restartButton.addEventListener("click", restartGame);
  els.viewLogButton.addEventListener("click", showLogModal);
  els.resumeContinueButton.addEventListener("click", continueFromHome);
  els.resumeRestartButton.addEventListener("click", restartFromHome);
  els.modalClose.addEventListener("click", () => {
    if (!els.modalClose.disabled) hideModal();
  });
  els.logModalClose.addEventListener("click", hideLogModal);
  els.incidentListToggle.addEventListener("click", toggleIncidentSidebar);
  els.incidentSidebarClose.addEventListener("click", toggleIncidentSidebar);
  els.modeFilter.addEventListener("change", () => {
    updateEquipmentFilterOptions();
    renderIncidentList();
  });
  els.equipmentFilter.addEventListener("change", renderIncidentList);
  
  // Toggle event log panel on mobile
  if (els.eventLogPanel) {
    els.eventLogPanel.addEventListener("click", (e) => {
      if (window.innerWidth <= 768 && e.target === els.eventLogPanel) {
        els.eventLogPanel.classList.toggle("collapsed");
      }
    });
  }
  
  // Mobile difficulty selection
  if (els.mobileDifficultyButtons) {
    els.mobileDifficultyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.difficulty = button.dataset.difficulty;
        state.cachedEquipment = null;
        state.equipmentStatus = Object.fromEntries(getActiveEquipment().map((item) => [item.id, "normal"]));
        syncDifficultyButtons();
        els.mobileDifficultyButtons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }
  
  if (els.mobileStartGame) {
    els.mobileStartGame.addEventListener("click", () => {
      if (els.mobileDifficultySelection) {
        els.mobileDifficultySelection.classList.add("hidden");
      }
      enterGameScreen();
    });
  }

  // --- Popover for difficulty descriptions (hover + click) ---
  const popover = document.getElementById("difficulty-popover");
  const popoverContent = popover && popover.querySelector(".popover-content");

  const difficultyDescriptions = {
    normal: "ノーマル（中小企業）：6設備で、基本的な社内ITトラブルに対応します。",
    hard: "ハード（中堅企業）：9設備に増え、管理・バックアップ・リモート接続も含めて対応します。",
    veryhard: "ベリーハード（大企業）：12設備すべてが対象になり、迅速な判断が求められます。"
  };

  let popoverSticky = false;

  function showPopoverFor(button, viaClick = false) {
    if (!popover || !button) return;
    const diff = button.dataset.difficulty || "normal";
    popoverContent.textContent = difficultyDescriptions[diff] || "";
    popover.classList.remove("hidden");
    popover.classList.add("visible");
    popover.setAttribute("aria-hidden", "false");
    const rect = button.getBoundingClientRect();
    const place = window.innerHeight - rect.bottom > 140 ? "bottom" : "top";
    popover.setAttribute("data-placement", place);
    const left = Math.min(Math.max(popover.offsetWidth / 2 + 8, rect.left + rect.width / 2), window.innerWidth - popover.offsetWidth / 2 - 8);
    const top = place === "bottom" ? rect.bottom + 10 : rect.top - popover.offsetHeight - 10;
    popover.style.left = `${left + window.scrollX}px`;
    popover.style.top = `${top + window.scrollY}px`;
    popoverSticky = viaClick;
  }

  function hidePopover() {
    if (!popover) return;
    popover.classList.remove("visible");
    popover.classList.add("hidden");
    popover.setAttribute("aria-hidden", "true");
    popoverSticky = false;
  }

  els.difficultyButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => showPopoverFor(button, false));
    button.addEventListener("mouseleave", () => {
      if (popoverSticky) return;
      hidePopover();
    });
    button.addEventListener("click", () => {
      if (state.started && !state.ended) return;
      state.difficulty = button.dataset.difficulty;
      state.cachedEquipment = null;
      state.equipmentStatus = Object.fromEntries(getActiveEquipment().map((item) => [item.id, "normal"]));
      syncDifficultyButtons();
      state.nextIncidentIn = getDifficulty().firstIncident;
      renderAll();
      updateHomeEquipmentCount();
      
      setTimeout(() => {
        if (popoverSticky && popover && popover.classList.contains("visible")) {
          hidePopover();
        } else {
          showPopoverFor(button, true);
        }
      }, 0);
    });
  });

  els.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (state.started && !state.ended) return;
      state.gameMode = button.dataset.mode;
      state.cachedEquipment = null; // キャッシュをクリアして設備を再計算
      state.equipmentStatus = Object.fromEntries(getActiveEquipment().map((item) => [item.id, "normal"]));
      syncModeButtons();
      renderAll();
      updateEquipmentFilterOptions();
      
      // モバイルの場合は難易度選択を表示
      if (window.innerWidth <= 768) {
        showDifficultySelection();
      }
    });
  });

  document.addEventListener("click", (ev) => {
    if (!popoverSticky || !popover) return;
    if (popover.contains(ev.target)) return;
    if ([...els.difficultyButtons].some((b) => b.contains(ev.target))) return;
    hidePopover();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.modal.classList.contains("hidden") && !els.modalClose.disabled) {
      hideModal();
    }
  });

  syncDifficultyButtons();
  syncModeButtons();
  showHomeScreen();
  renderAll();
});

function setDifficultyButtonsDisabled(disabled) {
  els.difficultyButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function setModeButtonsDisabled(disabled) {
  els.modeButtons.forEach((button) => {
    button.disabled = disabled;
    if (disabled) {
      button.style.opacity = "0.5";
      button.style.cursor = "not-allowed";
    } else {
      button.style.opacity = "1";
      button.style.cursor = "pointer";
    }
  });
}

function syncDifficultyButtons() {
  els.difficultyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.difficulty === state.difficulty);
  });
}

function syncModeButtons() {
  els.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.gameMode);
  });
}
