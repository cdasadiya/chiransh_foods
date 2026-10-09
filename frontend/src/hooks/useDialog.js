import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Move focus into a dialog, trap Tab, close on Escape, and lock background scroll. */
export default function useDialog(open, onClose) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const root = ref.current;
    if (!root) return undefined;
    const previous = document.activeElement;
    const nodes = () => (root ? [...root.querySelectorAll(FOCUSABLE)] : []);
    const first = nodes()[0];
    first?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !root) return;
      const list = nodes();
      if (!list.length) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault();
        lastEl.focus();
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    };

    const inerted = [];
    const hideOutside = (node) => {
      if (node === root) return;
      if (node.contains(root)) {
        [...node.children].forEach(hideOutside);
        return;
      }
      if (node.nodeType === 1 && !node.hasAttribute("inert")) {
        node.setAttribute("inert", "");
        inerted.push(node);
      }
    };
    [...document.body.children].forEach(hideOutside);

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      inerted.forEach((node) => node.removeAttribute("inert"));
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  return ref;
}
