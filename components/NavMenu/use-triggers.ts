
type Register = (trigger: HTMLElement) => void;
type Unregister = (trigger: HTMLElement) => void;

type ContentTransition =
  "content-slide-right" |
  "content-slide-left" |
  "content-slide-down";

function useTriggers() {
  const triggers = ref<HTMLElement[]>([]);

  const menuNames = ref<string[]>([]);
  const activeMenu = ref<string>();

  const contentTransition = ref<ContentTransition>("content-slide-down");

  watch(activeMenu, (current, previous)  => {
    const idxCurrent = menuNames.value.indexOf(current ?? "");
    const idxPrevious = menuNames.value.indexOf(previous ?? "");
    if (
      idxPrevious < 0 ||
      (idxPrevious > -1 && idxCurrent < 0)
    ) {
      contentTransition.value = "content-slide-down";
    } else if (idxCurrent > idxPrevious) {
      contentTransition.value = "content-slide-left";
    } else {
      contentTransition.value = "content-slide-right";
    }
  });

  function onMouseenter(ev: MouseEvent) {
    const data = (ev.target as HTMLElement).dataset;
    activeMenu.value = data.menuName ?? "";
  }

  function onFocus(ev: FocusEvent) {
    const data = (ev.target as HTMLElement).dataset;
    activeMenu.value = data.menuName ?? "";
  }

  function registerTrigger(trigger: HTMLElement) {
    const menuName = trigger.dataset.menuName;

    if (!menuNames.value.includes(menuName ?? "")) {
      menuNames.value.push(menuName ?? "");
      triggers.value.push(trigger);
    }

    trigger.addEventListener("focus", onFocus);
    trigger.addEventListener("mouseenter", onMouseenter);
  }
  
  function unregisterTrigger(trigger: HTMLElement) {
    menuNames.value = menuNames.value.filter(
      (menuName) => menuName !== trigger.dataset.menuName
    );

    triggers.value = triggers.value.filter(
      (_trigger) => _trigger.dataset.menuName !== trigger.dataset.menuName
    );

    trigger.removeEventListener("focus", onFocus);
    trigger.removeEventListener("mouseenter", onMouseenter);
  }

  function setFocus() {
    const trigger = triggers.value.find(
      (trigger) => trigger.dataset.menuName === activeMenu.value
    );

    if (trigger) {
      return trigger.focus();
    }

    triggers.value[0].focus();
  }

  provide("registerTrigger", registerTrigger);
  provide("unregisterTrigger", unregisterTrigger);
  provide("activeMenu", activeMenu);

  return { activeMenu, contentTransition, setFocus };
}

export { useTriggers };
export type { Register, Unregister };
