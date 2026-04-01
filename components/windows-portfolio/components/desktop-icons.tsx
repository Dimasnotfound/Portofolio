import type { MouseEvent as ReactMouseEvent } from "react";

import styles from "../windows-portfolio.module.css";
import { desktopIcons } from "../lib/data";
import type {
  DesktopIconId,
  DesktopIconItem,
  DesktopIconPosition,
} from "../lib/types";

type DesktopIconsProps = {
  iconPositions: Record<DesktopIconId, DesktopIconPosition>;
  selectedIcon: DesktopIconId;
  onStartDrag: (event: ReactMouseEvent<HTMLButtonElement>, id: DesktopIconId) => void;
  onClick: (icon: DesktopIconItem) => void;
  onDoubleClick: (icon: DesktopIconItem) => void;
};

export function DesktopIcons({
  iconPositions,
  selectedIcon,
  onStartDrag,
  onClick,
  onDoubleClick,
}: DesktopIconsProps) {
  return (
    <div className={styles.iconRail}>
      {desktopIcons.map((icon) => (
        <button
          key={icon.id}
          type="button"
          className={`${styles.desktopIcon} ${
            selectedIcon === icon.id ? styles.desktopIconActive : ""
          }`}
          style={{
            left: `${iconPositions[icon.id].x}px`,
            top: `${iconPositions[icon.id].y}px`,
          }}
          onMouseDown={(event) => onStartDrag(event, icon.id)}
          onClick={() => onClick(icon)}
          onDoubleClick={() => onDoubleClick(icon)}
        >
          {icon.type === "profile" ? (
            <span className={styles.avatarIcon} aria-hidden="true" />
          ) : null}
          {icon.type === "folder" ? <span className={styles.folderIcon} /> : null}
          {icon.type === "certificate" ? (
            <span className={styles.certificateIcon} aria-hidden="true" />
          ) : null}
          {icon.type === "mail" ? (
            <span className={styles.mailIcon} aria-hidden="true" />
          ) : null}
          {icon.type === "social" ? (
            <img
              src={icon.icon}
              alt=""
              className={styles.socialDesktopIcon}
              draggable="false"
            />
          ) : null}
          <span className={styles.desktopIconLabel}>{icon.label}</span>
        </button>
      ))}
    </div>
  );
}
