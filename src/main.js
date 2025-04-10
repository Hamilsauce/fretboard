const canvasEl = document.querySelector('#canvas');



canvasEl.addEventListener('click', (e) => {
  // if (isMoving) return;
  console.log('Click!')
  const tile = e.target.closest('.tile');
  if (!tile) return;
  
  const isActive = tile.dataset.active === 'true' ? true : false;
  tile.dataset.active = !isActive;
});