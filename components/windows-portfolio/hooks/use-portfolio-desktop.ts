import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  TASKBAR_HEIGHT,
  WINDOW_MARGIN,
} from "../lib/constants";
import {
  desktopIconIds,
  initialDesktopIconPositions,
  initialWindows,
  windowIds,
} from "../lib/data";
import type {
  ContactForm,
  DesktopIconId,
  DesktopIconItem,
  DesktopIconPosition,
  DialogState,
  IconDragState,
  Project,
  WindowDragState,
  WindowId,
  WindowResizeState,
  WindowState,
} from "../lib/types";
import {
  fitIconPosition,
  fitRect,
  formatClock,
  resolveSnappedIconPosition,
  sameRect,
} from "../lib/utils";

export function usePortfolioDesktop() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const zCounterRef = useRef(30);
  const dragRef = useRef<WindowDragState | null>(null);
  const resizeRef = useRef<WindowResizeState | null>(null);
  const iconDragRef = useRef<IconDragState | null>(null);
  const suppressIconClickRef = useRef<DesktopIconId | null>(null);

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);
  const [iconPositions, setIconPositions] =
    useState<Record<DesktopIconId, DesktopIconPosition>>(initialDesktopIconPositions);
  const [selectedIcon, setSelectedIcon] = useState<DesktopIconId>("about");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const getDesktopBounds = () => {
    const width = desktopRef.current?.clientWidth ?? window.innerWidth;
    const height = desktopRef.current?.clientHeight ?? window.innerHeight;

    return {
      width,
      height: Math.max(260, height - TASKBAR_HEIGHT),
    };
  };

  const bringToFront = (id: WindowId) => {
    setWindows((current) => {
      const nextZ = zCounterRef.current + 1;
      zCounterRef.current = nextZ;

      return {
        ...current,
        [id]: {
          ...current[id],
          zIndex: nextZ,
        },
      };
    });
  };

  const openWindow = (id: WindowId) => {
    setSelectedIcon(id);
    setStartMenuOpen(false);
    setWindows((current) => {
      const nextZ = zCounterRef.current + 1;
      zCounterRef.current = nextZ;

      return {
        ...current,
        [id]: {
          ...current[id],
          visible: true,
          minimized: false,
          zIndex: nextZ,
        },
      };
    });
  };

  const closeWindow = (id: WindowId) => {
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        visible: false,
        minimized: false,
      },
    }));
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((current) => ({
      ...current,
      [id]: {
        ...current[id],
        minimized: true,
      },
    }));
  };

  const toggleMaximize = (id: WindowId) => {
    const bounds = getDesktopBounds();

    setWindows((current) => {
      const target = current[id];
      const nextZ = zCounterRef.current + 1;
      zCounterRef.current = nextZ;

      if (target.maximized) {
        return {
          ...current,
          [id]: {
            ...target,
            maximized: false,
            rect: target.previousRect ?? target.rect,
            previousRect: undefined,
            zIndex: nextZ,
          },
        };
      }

      return {
        ...current,
        [id]: {
          ...target,
          maximized: true,
          previousRect: target.rect,
          rect: {
            x: 0,
            y: 0,
            width: bounds.width,
            height: bounds.height,
          },
          zIndex: nextZ,
        },
      };
    });
  };

  useEffect(() => {
    const updateClock = () => setClock(formatClock(new Date()));
    updateClock();

    const intervalId = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const syncWindowsToViewport = () => {
      const bounds = getDesktopBounds();

      setWindows((current) => {
        let changed = false;
        const nextState = { ...current };

        for (const id of windowIds) {
          const currentWindow = current[id];

          if (currentWindow.maximized) {
            const nextRect = {
              x: 0,
              y: 0,
              width: bounds.width,
              height: bounds.height,
            };

            if (!sameRect(currentWindow.rect, nextRect)) {
              changed = true;
              nextState[id] = {
                ...currentWindow,
                rect: nextRect,
              };
            }

            continue;
          }

          const fittedRect = fitRect(currentWindow.rect, bounds);

          if (!sameRect(currentWindow.rect, fittedRect)) {
            changed = true;
            nextState[id] = {
              ...currentWindow,
              rect: fittedRect,
            };
          }
        }

        return changed ? nextState : current;
      });
    };

    syncWindowsToViewport();
    window.addEventListener("resize", syncWindowsToViewport);

    return () => window.removeEventListener("resize", syncWindowsToViewport);
  }, []);

  useEffect(() => {
    const syncDesktopIconsToViewport = () => {
      const bounds = getDesktopBounds();

      setIconPositions((current) => {
        let changed = false;
        const nextState = {} as Record<DesktopIconId, DesktopIconPosition>;

        for (const id of desktopIconIds) {
          const fittedPosition = fitIconPosition(current[id], bounds);
          const nextPosition = resolveSnappedIconPosition(
            id,
            fittedPosition,
            { ...current, ...nextState },
            bounds,
            desktopIconIds,
          );

          nextState[id] = nextPosition;

          if (nextPosition.x !== current[id].x || nextPosition.y !== current[id].y) {
            changed = true;
          }
        }

        return changed ? nextState : current;
      });
    };

    syncDesktopIconsToViewport();
    window.addEventListener("resize", syncDesktopIconsToViewport);

    return () => window.removeEventListener("resize", syncDesktopIconsToViewport);
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const dragState = dragRef.current;
      const resizeState = resizeRef.current;
      const iconDragState = iconDragRef.current;

      if (resizeState) {
        setWindows((current) => {
          const currentWindow = current[resizeState.id];

          if (currentWindow.maximized) {
            return current;
          }

          const bounds = getDesktopBounds();
          const availableWidth = Math.max(
            180,
            bounds.width - currentWindow.rect.x - WINDOW_MARGIN,
          );
          const availableHeight = Math.max(
            180,
            bounds.height - currentWindow.rect.y - WINDOW_MARGIN,
          );
          const minWidth = Math.min(MIN_WINDOW_WIDTH, availableWidth);
          const minHeight = Math.min(MIN_WINDOW_HEIGHT, availableHeight);
          const nextWidth = Math.min(
            Math.max(
              resizeState.startRect.width + (event.clientX - resizeState.startX),
              minWidth,
            ),
            availableWidth,
          );
          const nextHeight = Math.min(
            Math.max(
              resizeState.startRect.height + (event.clientY - resizeState.startY),
              minHeight,
            ),
            availableHeight,
          );
          const nextRect = {
            ...currentWindow.rect,
            width: nextWidth,
            height: nextHeight,
          };

          if (sameRect(currentWindow.rect, nextRect)) {
            return current;
          }

          return {
            ...current,
            [resizeState.id]: {
              ...currentWindow,
              rect: nextRect,
            },
          };
        });

        return;
      }

      if (iconDragState) {
        const deltaX = event.clientX - iconDragState.startX;
        const deltaY = event.clientY - iconDragState.startY;

        if (!iconDragState.moved && Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) {
          return;
        }

        iconDragState.moved = true;

        setIconPositions((current) => {
          const bounds = getDesktopBounds();
          const nextPosition = fitIconPosition(
            {
              x: event.clientX - iconDragState.offsetX,
              y: event.clientY - iconDragState.offsetY,
            },
            bounds,
            {
              width: iconDragState.width,
              height: iconDragState.height,
            },
          );
          const currentPosition = current[iconDragState.id];

          if (
            nextPosition.x === currentPosition.x &&
            nextPosition.y === currentPosition.y
          ) {
            return current;
          }

          return {
            ...current,
            [iconDragState.id]: nextPosition,
          };
        });

        return;
      }

      if (!dragState) {
        return;
      }

      setWindows((current) => {
        const currentWindow = current[dragState.id];

        if (currentWindow.maximized) {
          return current;
        }

        const bounds = getDesktopBounds();
        const nextRect = fitRect(
          {
            ...currentWindow.rect,
            x: event.clientX - dragState.offsetX,
            y: event.clientY - dragState.offsetY,
          },
          bounds,
        );

        if (sameRect(currentWindow.rect, nextRect)) {
          return current;
        }

        return {
          ...current,
          [dragState.id]: {
            ...currentWindow,
            rect: nextRect,
          },
        };
      });
    };

    const stopDragging = () => {
      const iconDragState = iconDragRef.current;

      if (iconDragState?.moved) {
        suppressIconClickRef.current = iconDragState.id;
        setIconPositions((current) => {
          const bounds = getDesktopBounds();
          const nextPosition = resolveSnappedIconPosition(
            iconDragState.id,
            current[iconDragState.id],
            current,
            bounds,
            desktopIconIds,
            {
              width: iconDragState.width,
              height: iconDragState.height,
            },
          );
          const currentPosition = current[iconDragState.id];

          if (
            nextPosition.x === currentPosition.x &&
            nextPosition.y === currentPosition.y
          ) {
            return current;
          }

          return {
            ...current,
            [iconDragState.id]: nextPosition,
          };
        });
      }

      dragRef.current = null;
      resizeRef.current = null;
      iconDragRef.current = null;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, []);

  useEffect(() => {
    const closeStartMenuOnOutsideClick = (event: MouseEvent) => {
      if (!startMenuOpen) {
        return;
      }

      const target = event.target as Node;

      if (
        startMenuRef.current?.contains(target) ||
        startButtonRef.current?.contains(target)
      ) {
        return;
      }

      setStartMenuOpen(false);
    };

    document.addEventListener("mousedown", closeStartMenuOnOutsideClick);

    return () =>
      document.removeEventListener("mousedown", closeStartMenuOnOutsideClick);
  }, [startMenuOpen]);

  const activeWindowId = useMemo(() => {
    const openedWindows = windowIds.filter(
      (id) => windows[id].visible && !windows[id].minimized,
    );

    if (!openedWindows.length) {
      return undefined;
    }

    return openedWindows.reduce((topmostId, currentId) =>
      windows[currentId].zIndex > windows[topmostId].zIndex ? currentId : topmostId,
    );
  }, [windows]);

  const taskbarWindows = useMemo(
    () => windowIds.filter((id) => windows[id].visible),
    [windows],
  );

  const startDragging = (
    event: ReactMouseEvent<HTMLDivElement>,
    id: WindowId,
  ) => {
    if (event.button !== 0) {
      return;
    }

    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    const target = windows[id];

    if (target.maximized) {
      return;
    }

    bringToFront(id);
    iconDragRef.current = null;
    resizeRef.current = null;
    dragRef.current = {
      id,
      offsetX: event.clientX - target.rect.x,
      offsetY: event.clientY - target.rect.y,
    };
  };

  const startResizing = (
    event: ReactMouseEvent<HTMLButtonElement>,
    id: WindowId,
  ) => {
    if (event.button !== 0) {
      return;
    }

    const target = windows[id];

    if (target.maximized) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    bringToFront(id);
    dragRef.current = null;
    iconDragRef.current = null;
    resizeRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      startRect: target.rect,
    };
  };

  const toggleTaskWindow = (id: WindowId) => {
    const target = windows[id];

    if (target.minimized) {
      openWindow(id);
      return;
    }

    if (activeWindowId === id) {
      minimizeWindow(id);
      return;
    }

    bringToFront(id);
  };

  const openExternalLink = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const startDesktopIconDrag = (
    event: ReactMouseEvent<HTMLButtonElement>,
    id: DesktopIconId,
  ) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedIcon(id);
    dragRef.current = null;
    resizeRef.current = null;
    iconDragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
    };
  };

  const handleDesktopIconClick = (icon: DesktopIconItem) => {
    if (suppressIconClickRef.current === icon.id) {
      suppressIconClickRef.current = null;
      return;
    }

    setSelectedIcon(icon.id);
  };

  const handleDesktopIconDoubleClick = (icon: DesktopIconItem) => {
    if (icon.type === "social" && icon.href) {
      openExternalLink(icon.href);
      return;
    }

    openWindow(icon.id as WindowId);
  };

  const resetContactForm = () => {
    setContactForm({
      name: "",
      email: "",
      message: "",
    });
  };

  const handleContactSubmit = () => {
    const { name, email, message } = contactForm;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setDialog({
        title: "Perlu Data Lengkap",
        message: "Isi nama, email, dan pesan sebelum mengirim formulir.",
        tone: "warning",
      });
      return;
    }

    setDialog({
      title: "Pesan Terkirim",
      message:
        "Pesan berhasil disimpan di UI demo ini. Dimas bisa menindaklanjuti melalui email atau kontak yang Anda tinggalkan.",
      tone: "info",
    });
    resetContactForm();
  };

  return {
    desktopRef,
    startButtonRef,
    startMenuRef,
    windows,
    iconPositions,
    selectedIcon,
    startMenuOpen,
    selectedProject,
    dialog,
    clock,
    contactForm,
    activeWindowId,
    taskbarWindows,
    setSelectedProject,
    setDialog,
    setContactForm,
    setStartMenuOpen,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    toggleTaskWindow,
    bringToFront,
    startDragging,
    startResizing,
    startDesktopIconDrag,
    handleDesktopIconClick,
    handleDesktopIconDoubleClick,
    handleContactSubmit,
    resetContactForm,
  };
}
