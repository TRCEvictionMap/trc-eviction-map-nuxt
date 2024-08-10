

function focusableElements(container: HTMLElement) {
  const all: NodeListOf<HTMLElement> = container.querySelectorAll(
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
  );

  return {
    all,
    first: all[0],
    last: all[all.length - 1],
  };
}

function useTrapFocus(container: HTMLElement) {
  const focusable = focusableElements(container);

  function handleKeydown(ev: KeyboardEvent) {
    const isTab = ev.key === "Tab";

    if (!isTab) {
      return;
    }

    if (ev.shiftKey) {
      if (document.activeElement === focusable.first) {
        focusable.last.focus();
        ev.preventDefault();
      }
    } else if (document.activeElement === focusable.last) {
      focusable.first.focus();
      ev.preventDefault();
    }
  }

  function trap() {
    container.addEventListener("keydown", handleKeydown);
  }

  function release() {
    container.removeEventListener("keydown", handleKeydown);
  }

  return { trap, release };
}

export { useTrapFocus };
