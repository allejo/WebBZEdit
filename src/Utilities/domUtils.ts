export function isInputInFocus(): boolean {
  const nodeName = document.activeElement?.nodeName.toLowerCase();

  if (!nodeName) {
    return false;
  }

  return ['input', 'textarea', 'select'].includes(nodeName);
}

export function isMenuInFocus(): boolean {
  const activeElement = document.activeElement;

  if (!activeElement) {
    return false;
  }

  const isButton = activeElement.nodeName.toLowerCase() === 'button';
  const isMenuItem = activeElement.getAttribute('role') === 'menuitem';

  return isButton && isMenuItem;
}
