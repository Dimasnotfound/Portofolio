"use client";

import styles from "./windows-portfolio.module.css";
import { DesktopIcons } from "./components/desktop-icons";
import { Dialogs } from "./components/dialogs";
import { StartMenu } from "./components/start-menu";
import { Taskbar } from "./components/taskbar";
import { WindowContent } from "./components/window-content";
import { usePortfolioDesktop } from "./hooks/use-portfolio-desktop";
import { windowIds, windowLabels } from "./lib/data";

export default function WindowsPortfolio() {
  const {
    activeWindowId,
    bringToFront,
    clock,
    closeWindow,
    contactForm,
    desktopRef,
    dialog,
    handleContactSubmit,
    handleDesktopIconClick,
    handleDesktopIconDoubleClick,
    iconPositions,
    minimizeWindow,
    openWindow,
    resetContactForm,
    selectedIcon,
    selectedProject,
    setContactForm,
    setDialog,
    setSelectedProject,
    setStartMenuOpen,
    startButtonRef,
    startDesktopIconDrag,
    startDragging,
    startMenuOpen,
    startMenuRef,
    startResizing,
    taskbarWindows,
    toggleMaximize,
    toggleTaskWindow,
    windows,
  } = usePortfolioDesktop();

  return (
    <main className={styles.desktop} ref={desktopRef}>
      <div className={styles.wallpaper} />
      <div className={styles.desktopGlow} />

      <DesktopIcons
        iconPositions={iconPositions}
        selectedIcon={selectedIcon}
        onStartDrag={startDesktopIconDrag}
        onClick={handleDesktopIconClick}
        onDoubleClick={handleDesktopIconDoubleClick}
      />

      {windowIds.map((id) => {
        const currentWindow = windows[id];

        if (!currentWindow.visible || currentWindow.minimized) {
          return null;
        }

        const meta = windowLabels[id];
        const isActive = activeWindowId === id;

        return (
          <section
            key={id}
            className={`${styles.window} ${isActive ? "" : styles.windowInactive}`}
            style={{
              left: `${currentWindow.rect.x}px`,
              top: `${currentWindow.rect.y}px`,
              width: `${currentWindow.rect.width}px`,
              height: `${currentWindow.rect.height}px`,
              zIndex: currentWindow.zIndex,
            }}
            onMouseDown={() => bringToFront(id)}
          >
            <div
              className={styles.titlebar}
              onMouseDown={(event) => startDragging(event, id)}
              onDoubleClick={() => toggleMaximize(id)}
            >
              <span
                className={styles.titlebarIcon}
                style={{ background: `linear-gradient(135deg, ${meta.iconColor}, #04508f)` }}
              />
              <span className={styles.titlebarTitle}>{meta.title}</span>
              <div className={styles.windowControls}>
                <button
                  type="button"
                  className={`${styles.windowButton} ${styles.minimizeButton}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    minimizeWindow(id);
                  }}
                >
                  _
                </button>
                <button
                  type="button"
                  className={styles.windowButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleMaximize(id);
                  }}
                >
                  []
                </button>
                <button
                  type="button"
                  className={`${styles.windowButton} ${styles.closeButton}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    closeWindow(id);
                  }}
                >
                  X
                </button>
              </div>
            </div>

            <div className={styles.menubar}>
              <span>File</span>
              <span>View</span>
              <span>Help</span>
            </div>

            <div className={styles.addressBar}>
              <span className={styles.addressLabel}>Address</span>
              <input className={styles.addressInput} readOnly value={meta.address} />
            </div>

            <WindowContent
              id={id}
              contactForm={contactForm}
              onOpenWindow={openWindow}
              onResetContactForm={resetContactForm}
              onSelectProject={setSelectedProject}
              onSubmitContact={handleContactSubmit}
              setContactForm={setContactForm}
            />

            {!currentWindow.maximized ? (
              <button
                type="button"
                className={styles.resizeHandle}
                aria-label={`Resize ${windowLabels[id].taskLabel}`}
                title="Resize"
                onMouseDown={(event) => startResizing(event, id)}
              />
            ) : null}
          </section>
        );
      })}

      <Dialogs
        selectedProject={selectedProject}
        onCloseProject={() => setSelectedProject(null)}
        dialog={dialog}
        onCloseDialog={() => setDialog(null)}
      />

      <StartMenu
        startMenuOpen={startMenuOpen}
        startMenuRef={startMenuRef}
        openWindow={openWindow}
      />

      <Taskbar
        activeWindowId={activeWindowId}
        clockTime={clock.time}
        openWindow={openWindow}
        onToggleStartMenu={() => setStartMenuOpen((current) => !current)}
        startButtonRef={startButtonRef}
        taskbarWindows={taskbarWindows}
        toggleTaskWindow={toggleTaskWindow}
        windows={windows}
      />
    </main>
  );
}
