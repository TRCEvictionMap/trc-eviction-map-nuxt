
type Register = (trigger: HTMLElement) => void;
type Unregister = (trigger: HTMLElement) => void;

type ContentTransition =
  "content-slide-right" |
  "content-slide-left" |
  "content-slide-down";

function useTriggers() {
  const menus = ref<string[]>([]);

  const activeMenu = ref<string>();
  const contentTransition = ref<ContentTransition>("content-slide-down");

  watch(activeMenu, (current, previous)  => {
    const idxCurrent = menus.value.indexOf(current ?? "");
    const idxPrevious = menus.value.indexOf(previous ?? "");
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

  function onTouchstart(ev: TouchEvent) {
    const data = (ev.target as HTMLElement).dataset;

  }

  function registerTrigger(trigger: HTMLElement) {
    const menuName = trigger.dataset.menuName;

    if (!menus.value.includes(menuName ?? "")) {
      menus.value.push(menuName ?? "");
    }

    trigger.addEventListener("mouseenter", onMouseenter);
    trigger.addEventListener("touchstart", onTouchstart)
  }
  
  function unregisterTrigger(trigger: HTMLElement) {
    menus.value = menus.value.filter(
      (menuName) => menuName !== trigger.dataset.menuName
    );

    trigger.removeEventListener("mouseenter", onMouseenter);
    trigger.removeEventListener("touchstart", onTouchstart);
  }

  provide("registerTrigger", registerTrigger);
  provide("unregisterTrigger", unregisterTrigger);

  return { activeMenu, contentTransition };
}

export { useTriggers };
export type { Register, Unregister };
