import type { RefObject } from "react";

import styles from "../windows-portfolio.module.css";
import { startMenuItems, windowLabels } from "../lib/data";
import type { WindowId } from "../lib/types";

type StartMenuProps = {
  openWindow: (id: WindowId) => void;
  startMenuRef: RefObject<HTMLDivElement | null>;
  startMenuOpen: boolean;
};

export function StartMenu({ openWindow, startMenuRef, startMenuOpen }: StartMenuProps) {
  if (!startMenuOpen) {
    return null;
  }

  return (
    <div className={styles.startMenu} ref={startMenuRef}>
      <div className={styles.startMenuHeader}>
        <strong>Dimas Juli Pratama</strong>
        <span>Windows XP Portfolio</span>
      </div>
      {startMenuItems.map((id) => (
        <button
          key={id}
          type="button"
          className={styles.startMenuItem}
          onClick={() => openWindow(id)}
        >
          {windowLabels[id].taskLabel}
        </button>
      ))}
    </div>
  );
}
