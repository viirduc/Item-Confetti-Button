// Listen for new button creation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createButton") {
    addItemButton(request.itemId);
  }
});

// Add button to trade interface
function addItemButton(itemId) {
  const buttonContainer = document.querySelector('.trade-buttons');
  if (!buttonContainer) return;

  const existingBtn = document.querySelector(`.item-btn-${itemId}`);
  if (existingBtn) return;

  const newBtn = document.createElement('button');
  newBtn.className = `item-btn-${itemId} item-confetti-btn`;
  newBtn.textContent = `Item ${itemId}`;
  
  newBtn.addEventListener('click', () => {
    applyItemEffect(itemId);
  });

  buttonContainer.appendChild(newBtn);
}

// Apply the item effect
async function applyItemEffect(itemId) {
  const itemData = await fetchItemData(itemId);
  if (!itemData) return;

  // Replace all trade items
  const tradeItems = document.querySelectorAll('.trade-item');
  const originals = [];
  
  tradeItems.forEach(item => {
    const nameEl = item.querySelector('.item-name');
    const imgEl = item.querySelector('.item-thumbnail');
    
    if (nameEl && imgEl) {
      originals.push({
        nameEl,
        originalName: nameEl.textContent,
        imgEl,
        originalSrc: imgEl.src
      });
      
      nameEl.textContent = itemData.Name;
      imgEl.src = `https://www.roblox.com/asset-thumbnail/image?assetId=${itemId}&width=150&height=150`;
    }
  });

  // Show confetti
  showConfetti(itemId);

  // Revert after 3 seconds
  setTimeout(() => {
    originals.forEach(({nameEl, originalName, imgEl, originalSrc}) => {
      nameEl.textContent = originalName;
      imgEl.src = originalSrc;
    });
  }, 3000);
}

// Helper functions
async function fetchItemData(itemId) {
  return fetch(`https://economy.roblox.com/v2/assets/${itemId}/details`)
    .then(res => res.json());
}

function showConfetti(itemId) {
  // Implement confetti using canvas-confetti
  // Can customize with item image if desired
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}