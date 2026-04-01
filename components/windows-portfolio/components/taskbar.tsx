import type { RefObject } from "react";

import styles from "../windows-portfolio.module.css";
import { quickLaunchItems, trayIcons, windowLabels } from "../lib/data";
import type { WindowId, WindowState } from "../lib/types";

type TaskbarProps = {
  activeWindowId?: WindowId;
  clockTime: string;
  openWindow: (id: WindowId) => void;
  onToggleStartMenu: () => void;
  startButtonRef: RefObject<HTMLButtonElement | null>;
  taskbarWindows: readonly WindowId[];
  toggleTaskWindow: (id: WindowId) => void;
  windows: Record<WindowId, WindowState>;
};

export function Taskbar({
  activeWindowId,
  clockTime,
  openWindow,
  onToggleStartMenu,
  startButtonRef,
  taskbarWindows,
  toggleTaskWindow,
  windows,
}: TaskbarProps) {
  return (
    <footer className={styles.taskbar}>
      <button
        ref={startButtonRef}
        type="button"
        className={styles.startButton}
        onClick={onToggleStartMenu}
      >
        <span className={styles.startLogo} aria-hidden="true" />
        Start
      </button>

      <div className={styles.quickLaunch} aria-label="Quick Launch">
        <span className={styles.quickLaunchGrip} aria-hidden="true" />
        {quickLaunchItems.map((item) => (
          <button
            key={item.alt}
            type="button"
            className={styles.quickLaunchButton}
            aria-label={item.alt}
            title={item.alt}
            onClick={() => openWindow(item.target)}
          >
            <img
              src={item.src}
              alt=""
              className={styles.quickLaunchIcon}
              draggable="false"
            />
          </button>
        ))}
        <span className={styles.quickLaunchDivider} aria-hidden="true" />
      </div>

      <div className={styles.taskbarButtons}>
        {taskbarWindows.map((id) => (
          <button
            key={id}
            type="button"
            className={`${styles.taskButton} ${
              activeWindowId === id && !windows[id].minimized ? styles.taskButtonActive : ""
            }`}
            onClick={() => toggleTaskWindow(id)}
          >
            <span
              className={styles.taskButtonDot}
              style={{ backgroundColor: windowLabels[id].iconColor }}
            />
            {windowLabels[id].taskLabel}
          </button>
        ))}
      </div>

      <div className={styles.systemTray}>
        <div className={styles.trayIcons}>
          {trayIcons.map((icon) => (
            <img
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              className={styles.trayIcon}
              draggable="false"
            />
          ))}
        </div>
        <div className={styles.clock}>{clockTime}</div>
      </div>
    </footer>
  );
}
