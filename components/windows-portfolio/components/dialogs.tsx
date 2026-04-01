import styles from "../windows-portfolio.module.css";
import type { DialogState, Project } from "../lib/types";

type DialogsProps = {
  dialog: DialogState | null;
  onCloseDialog: () => void;
  onCloseProject: () => void;
  selectedProject: Project | null;
};

export function Dialogs({
  dialog,
  onCloseDialog,
  onCloseProject,
  selectedProject,
}: DialogsProps) {
  return (
    <>
      {selectedProject ? (
        <div className={styles.messageBox} style={{ zIndex: 3000 }}>
          <div className={styles.messageTitlebar}>
            <span>{selectedProject.title} - Project Detail</span>
            <button
              type="button"
              className={`${styles.windowButton} ${styles.closeButton}`}
              onClick={onCloseProject}
            >
              X
            </button>
          </div>
          <div className={styles.messageBody}>
            <div className={styles.messageIcon}>PRJ</div>
            <p>{selectedProject.description}</p>
            <div className={styles.projectTags}>
              {selectedProject.tech.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.messageActions}>
              <button
                type="button"
                className={`${styles.xpButton} ${styles.primaryButton}`}
                onClick={onCloseProject}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {dialog ? (
        <div className={styles.messageBox} style={{ top: "36%", zIndex: 3100 }}>
          <div className={styles.messageTitlebar}>
            <span>{dialog.title}</span>
            <button
              type="button"
              className={`${styles.windowButton} ${styles.closeButton}`}
              onClick={onCloseDialog}
            >
              X
            </button>
          </div>
          <div className={styles.messageBody}>
            <div
              className={`${styles.messageIcon} ${
                dialog.tone === "warning" ? styles.warningIcon : styles.infoIcon
              }`}
            >
              {dialog.tone === "warning" ? "!" : "OK"}
            </div>
            <p>{dialog.message}</p>
            <div className={styles.messageActions}>
              <button
                type="button"
                className={`${styles.xpButton} ${styles.primaryButton}`}
                onClick={onCloseDialog}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
