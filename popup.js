document.getElementById('addButton').addEventListener('click', async () => {
  const itemId = document.getElementById('itemId').value;
  if (!itemId) return;

  // Get item details from Roblox API
  const itemData = await fetch(`https://economy.roblox.com/v2/assets/${itemId}/details`)
    .then(res => res.json());
  
  if (itemData.errors) {
    alert('Invalid item ID or not a limited item!');
    return;
  }

  // Save button to storage
  const buttons = await chrome.storage.sync.get('buttons') || {};
  buttons[itemId] = itemData;
  await chrome.storage.sync.set({ buttons });

  // Update UI
  updateButtonList();
});

async function updateButtonList() {
  const { buttons = {} } = await chrome.storage.sync.get('buttons');
  const container = document.getElementById('savedButtons');
  container.innerHTML = '';

  Object.entries(buttons).forEach(([id, data]) => {
    const btn = document.createElement('button');
    btn.textContent = data.Name;
    btn.onclick = () => chrome.tabs.query({active: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "createButton", itemId: id});
    });
    container.appendChild(btn);
  });
}

// Initialize
updateButtonList();