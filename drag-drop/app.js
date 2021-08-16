// Selectors
const items = document.querySelectorAll('.item');

[...items].forEach((item) => {
  // polyfill required for safari
  item.addEventListener('pointerdown', (event) => {
    item.style.left = `${item.getBoundingClientRect().left}px`;
    item.style.top = `${item.getBoundingClientRect().top}px`;

    const clone = item.cloneNode();
    clone.classList.add('clone');

    item.classList.add('dragging');
    item.before(clone);

    document.body.append(item);

    const up = (event) => {
      clone.after(item);
      clone.remove();
      item.style.left = '';
      item.style.top = '';
      item.classList.remove('dragging');

      item.removeEventListener('pointerup', up);
      item.removeEventListener('pointermove', move);
      item.style.pointerEvents = '';

      item.releasePointerCapture(event.pointerId);
    };

    const move = (event) => {
      // doesn't work on IE
      item.style.left = `${parseFloat(item.style.left) + event.movementX}px`;
      item.style.top = `${parseFloat(item.style.top) + event.movementY}px`;

      const hitTest = document.elementFromPoint(
        parseFloat(item.style.left),
        parseFloat(item.style.top)
      );

      const dropzone = hitTest.closest('[data-dropzone]');
      if (!dropzone) {
        return;
      }

      if (clone.closest('[data-dropzone]') !== dropzone) {
        dropzone.append(clone);
        return;
      }

      const dropzoneChildren = [...dropzone.children];
      const cloneIndex = dropzoneChildren.findIndex((c) => c === clone);

      dropzoneChildren.forEach((child, index) => {
        if (hitTest === clone) {
          return;
        }

        if (hitTest === child) {
          if (cloneIndex < index) {
            child.after(clone);
            return;
          } else {
            child.before(clone);
          }
        }
      });
    };

    item.setPointerCapture(event.pointerId);
    item.addEventListener('pointerup', up);
    item.addEventListener('pointermove', move);
  });
});
