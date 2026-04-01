"use client";

import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./windows-portfolio.module.css";

type WindowId = "about" | "skills" | "projects" | "contact";
type DesktopIconId = WindowId | "linkedin" | "github";
type DesktopIconPosition = {
  x: number;
  y: number;
};

type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type WindowState = {
  visible: boolean;
  minimized: boolean;
  maximized: boolean;
  rect: WindowRect;
  previousRect?: WindowRect;
  zIndex: number;
};

type DialogState = {
  title: string;
  message: string;
  tone: "info" | "warning";
};

type Project = {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  accent: string;
};

type SkillItem = {
  name: string;
  icon: string;
  note?: string;
};

type SkillCategory = {
  group: string;
  summary: string;
  items: SkillItem[];
};

const TASKBAR_HEIGHT = 38;
const WINDOW_MARGIN = 8;
const MIN_WINDOW_WIDTH = 280;
const MIN_WINDOW_HEIGHT = 280;
const DESKTOP_ICON_WIDTH = 92;
const DESKTOP_ICON_HEIGHT = 96;
const DESKTOP_ICON_MARGIN = 16;
const DESKTOP_ICON_GRID_WIDTH = 112;
const DESKTOP_ICON_GRID_HEIGHT = 112;
const trayIcons = [
  {
    src: "/icons/tray-green-shield.png",
    alt: "Security",
  },
  {
    src: "/icons/tray-internet.png",
    alt: "Network",
  },
  {
    src: "/icons/tray-sound.png",
    alt: "Sound",
  },
  {
    src: "/icons/tray-removable-device.png",
    alt: "Removable Device",
  },
] as const;
const quickLaunchItems = [
  {
    src: "/icons/quick-ie.png",
    alt: "Internet Explorer",
    target: "about",
  },
  {
    src: "/icons/quick-programs.png",
    alt: "Programs",
    target: "skills",
  },
  {
    src: "/icons/quick-media-player.png",
    alt: "Media Player",
    target: "projects",
  },
  {
    src: "/icons/quick-outlook.png",
    alt: "Outlook Express",
    target: "contact",
  },
] as const satisfies ReadonlyArray<{
  src: string;
  alt: string;
  target: WindowId;
}>;
const socialLinks = [
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/dimas-pratama-5177a6270",
    label: "My LinkedIn",
    icon: "/icons/social-linkedin.png",
  },
  {
    id: "github",
    href: "https://github.com/Dimasnotfound",
    label: "My GitHub",
    icon: "/icons/social-github.png",
  },
] as const;

const windowIds: WindowId[] = ["about", "skills", "projects", "contact"];
const desktopIconIds: DesktopIconId[] = [
  "about",
  "skills",
  "projects",
  "contact",
  "linkedin",
  "github",
];
const initialDesktopIconPositions: Record<DesktopIconId, DesktopIconPosition> = {
  about: { x: 16, y: 16 },
  skills: { x: 16, y: 128 },
  projects: { x: 16, y: 240 },
  contact: { x: 16, y: 352 },
  linkedin: { x: 128, y: 16 },
  github: { x: 128, y: 128 },
};

const windowLabels: Record<
  WindowId,
  {
    title: string;
    taskLabel: string;
    address: string;
    iconColor: string;
  }
> = {
  about: {
    title: "About Me - Dimas Juli Pratama",
    taskLabel: "About Me",
    address: "C:\\Portfolio\\About\\Dimas Juli Pratama\\",
    iconColor: "#5ab6ff",
  },
  skills: {
    title: "My Skills - Dimas Juli Pratama",
    taskLabel: "Skills",
    address: "C:\\Portfolio\\Skills\\Dimas Juli Pratama\\",
    iconColor: "#ffbf47",
  },
  projects: {
    title: "Projects - Alex Reza",
    taskLabel: "Projects",
    address: "C:\\Portfolio\\Projects\\",
    iconColor: "#55d29c",
  },
  contact: {
    title: "Contact - Alex Reza",
    taskLabel: "Contact",
    address: "C:\\Portfolio\\Contact\\",
    iconColor: "#ff7c66",
  },
};

const initialWindows: Record<WindowId, WindowState> = {
  about: {
    visible: true,
    minimized: false,
    maximized: false,
    rect: { x: 492, y: 74, width: 1240, height: 575 },
    zIndex: 20,
  },
  skills: {
    visible: false,
    minimized: false,
    maximized: false,
    rect: { x: 176, y: 96, width: 840, height: 560 },
    zIndex: 16,
  },
  projects: {
    visible: false,
    minimized: false,
    maximized: false,
    rect: { x: 228, y: 112, width: 600, height: 470 },
    zIndex: 14,
  },
  contact: {
    visible: false,
    minimized: false,
    maximized: false,
    rect: { x: 294, y: 138, width: 460, height: 430 },
    zIndex: 12,
  },
};

const skills: SkillCategory[] = [
  {
    group: "Languages",
    summary:
      "Bahasa utama yang saya pakai untuk fullstack web, automasi backend, dan pengembangan aplikasi mobile.",
    items: [
      { name: "JavaScript", icon: "/icons/skills/javascript.svg", note: "Web logic" },
      { name: "TypeScript", icon: "/icons/skills/typescript.svg", note: "Typed apps" },
      { name: "PHP", icon: "/icons/skills/php.svg", note: "Laravel stack" },
      { name: "Python", icon: "/icons/skills/python.svg", note: "AI & scripting" },
      { name: "Dart", icon: "/icons/skills/dart.svg", note: "Flutter apps" },
      { name: "Golang", icon: "/icons/skills/go.svg", note: "Services & APIs" },
    ],
  },
  {
    group: "Frontend",
    summary:
      "Stack antarmuka yang saya gunakan untuk membangun web app responsif, dashboard, dan mobile interface.",
    items: [
      { name: "React", icon: "/icons/skills/react.svg", note: "SPA & dashboards" },
      { name: "Next.js", icon: "/icons/skills/nextjs.svg", note: "SSR / App Router" },
      { name: "Flutter", icon: "/icons/skills/flutter.svg", note: "Cross-platform" },
      { name: "Tailwind CSS", icon: "/icons/skills/tailwindcss.svg", note: "Utility styling" },
      { name: "Bootstrap", icon: "/icons/skills/bootstrap.svg", note: "Rapid UI" },
    ],
  },
  {
    group: "Backend",
    summary:
      "Berpengalaman membangun REST API, service layer, integrasi sistem, dan pola MVC untuk kebutuhan production.",
    items: [
      { name: "Laravel", icon: "/icons/skills/laravel.svg", note: "REST API & MVC" },
      { name: "Flask", icon: "/icons/skills/flask.svg", note: "Python services" },
      { name: "Golang API", icon: "/icons/skills/go.svg", note: "High-performance backend" },
    ],
  },
  {
    group: "Database",
    summary:
      "Terbiasa memakai database relasional maupun document store untuk aplikasi transactional dan data-driven.",
    items: [
      { name: "MySQL", icon: "/icons/skills/mysql.svg", note: "Transactional data" },
      { name: "PostgreSQL", icon: "/icons/skills/postgresql.svg", note: "Relational SQL" },
      { name: "MongoDB", icon: "/icons/skills/mongodb.svg", note: "Document store" },
      { name: "Firebase", icon: "/icons/skills/firebase.svg", note: "Realtime & auth" },
    ],
  },
  {
    group: "Tools",
    summary:
      "Tooling harian yang saya gunakan untuk version control, containerization, desain, database management, dan mobile development.",
    items: [
      { name: "Git", icon: "/icons/skills/git.svg", note: "Version control" },
      { name: "Docker", icon: "/icons/skills/docker.svg", note: "Containers" },
      { name: "Figma", icon: "/icons/skills/figma.svg", note: "UI prototyping" },
      { name: "DBeaver", icon: "/icons/skills/dbeaver.svg", note: "Database client" },
      { name: "VS Code", icon: "/icons/skills/vscode.svg", note: "Editor" },
      { name: "Android Studio", icon: "/icons/skills/androidstudio.svg", note: "Mobile tooling" },
    ],
  },
];

const projects: Project[] = [
  {
    title: "StoreFront",
    subtitle: "E-Commerce Platform",
    description:
      "Platform e-commerce full-stack dengan checkout real-time, integrasi payment gateway, dan dashboard admin yang fokus ke performa.",
    tech: ["Next.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    accent: "#3c8ef0",
  },
  {
    title: "TaskFlow",
    subtitle: "Project Management App",
    description:
      "Aplikasi manajemen proyek dengan board kolaboratif, update progres langsung, dan workflow tim yang sederhana.",
    tech: ["React", "Node.js", "Socket.io", "MongoDB"],
    accent: "#ff9a3c",
  },
  {
    title: "FitTrack",
    subtitle: "Mobile Health App",
    description:
      "Aplikasi mobile untuk memantau aktivitas, tidur, dan kalori dengan notifikasi harian dan grafik progres personal.",
    tech: ["React Native", "Firebase", "Expo"],
    accent: "#4ac78a",
  },
  {
    title: "OpenAPI Kit",
    subtitle: "REST API Starter",
    description:
      "Starter kit REST API dengan autentikasi JWT, rate limiting, dokumentasi Swagger, dan test coverage tinggi.",
    tech: ["Node.js", "Express", "Jest", "Docker"],
    accent: "#a76cf5",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const sameRect = (a: WindowRect, b: WindowRect) =>
  a.x === b.x &&
  a.y === b.y &&
  a.width === b.width &&
  a.height === b.height;

const formatClock = (date: Date) => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return {
    time: `${hours}:${minutes} ${meridiem}`,
  };
};

function WindowsPortfolio() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const zCounterRef = useRef(30);
  const dragRef = useRef<{
    id: WindowId;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const resizeRef = useRef<{
    id: WindowId;
    startX: number;
    startY: number;
    startRect: WindowRect;
  } | null>(null);
  const iconDragRef = useRef<{
    id: DesktopIconId;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    moved: boolean;
  } | null>(null);
  const suppressIconClickRef = useRef<DesktopIconId | null>(null);

  const [windows, setWindows] =
    useState<Record<WindowId, WindowState>>(initialWindows);
  const [iconPositions, setIconPositions] =
    useState<Record<DesktopIconId, DesktopIconPosition>>(initialDesktopIconPositions);
  const [selectedIcon, setSelectedIcon] = useState<DesktopIconId>("about");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const [contactForm, setContactForm] = useState({
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

  const fitRect = (rect: WindowRect, bounds: { width: number; height: number }) => {
    const width = Math.min(
      rect.width,
      Math.max(MIN_WINDOW_WIDTH, bounds.width - WINDOW_MARGIN * 2),
    );
    const height = Math.min(
      rect.height,
      Math.max(MIN_WINDOW_HEIGHT, bounds.height - WINDOW_MARGIN * 2),
    );
    const maxX = Math.max(WINDOW_MARGIN, bounds.width - width - WINDOW_MARGIN);
    const maxY = Math.max(WINDOW_MARGIN, bounds.height - height - WINDOW_MARGIN);

    return {
      x: clamp(rect.x, WINDOW_MARGIN, maxX),
      y: clamp(rect.y, WINDOW_MARGIN, maxY),
      width,
      height,
    };
  };

  const fitIconPosition = (
    position: DesktopIconPosition,
    bounds: { width: number; height: number },
    size = { width: DESKTOP_ICON_WIDTH, height: DESKTOP_ICON_HEIGHT },
  ) => ({
    x: clamp(
      position.x,
      DESKTOP_ICON_MARGIN,
      Math.max(
        DESKTOP_ICON_MARGIN,
        bounds.width - size.width - DESKTOP_ICON_MARGIN,
      ),
    ),
    y: clamp(
      position.y,
      DESKTOP_ICON_MARGIN,
      Math.max(
        DESKTOP_ICON_MARGIN,
        bounds.height - size.height - DESKTOP_ICON_MARGIN,
      ),
    ),
  });

  const getIconGridLimits = (
    bounds: { width: number; height: number },
    size = { width: DESKTOP_ICON_WIDTH, height: DESKTOP_ICON_HEIGHT },
  ) => ({
    columns: Math.max(
      1,
      Math.floor(
        Math.max(0, bounds.width - size.width - DESKTOP_ICON_MARGIN * 2) /
          DESKTOP_ICON_GRID_WIDTH,
      ) + 1,
    ),
    rows: Math.max(
      1,
      Math.floor(
        Math.max(0, bounds.height - size.height - DESKTOP_ICON_MARGIN * 2) /
          DESKTOP_ICON_GRID_HEIGHT,
      ) + 1,
    ),
  });

  const getGridCellKey = (column: number, row: number) => `${column}:${row}`;

  const getIconGridCell = (
    position: DesktopIconPosition,
    bounds: { width: number; height: number },
    size = { width: DESKTOP_ICON_WIDTH, height: DESKTOP_ICON_HEIGHT },
  ) => {
    const limits = getIconGridLimits(bounds, size);

    return {
      column: clamp(
        Math.round((position.x - DESKTOP_ICON_MARGIN) / DESKTOP_ICON_GRID_WIDTH),
        0,
        limits.columns - 1,
      ),
      row: clamp(
        Math.round((position.y - DESKTOP_ICON_MARGIN) / DESKTOP_ICON_GRID_HEIGHT),
        0,
        limits.rows - 1,
      ),
    };
  };

  const getIconGridPosition = (column: number, row: number): DesktopIconPosition => ({
    x: DESKTOP_ICON_MARGIN + column * DESKTOP_ICON_GRID_WIDTH,
    y: DESKTOP_ICON_MARGIN + row * DESKTOP_ICON_GRID_HEIGHT,
  });

  const resolveSnappedIconPosition = (
    id: DesktopIconId,
    desiredPosition: DesktopIconPosition,
    positions: Record<DesktopIconId, DesktopIconPosition>,
    bounds: { width: number; height: number },
    size = { width: DESKTOP_ICON_WIDTH, height: DESKTOP_ICON_HEIGHT },
  ) => {
    const limits = getIconGridLimits(bounds, size);
    const targetCell = getIconGridCell(desiredPosition, bounds, size);
    const occupiedCells = new Set<string>();

    for (const otherId of desktopIconIds) {
      if (otherId === id) {
        continue;
      }

      const otherPosition = positions[otherId];

      if (!otherPosition) {
        continue;
      }

      const otherCell = getIconGridCell(otherPosition, bounds, size);
      occupiedCells.add(getGridCellKey(otherCell.column, otherCell.row));
    }

    let bestCell = targetCell;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let row = 0; row < limits.rows; row += 1) {
      for (let column = 0; column < limits.columns; column += 1) {
        const cellKey = getGridCellKey(column, row);

        if (occupiedCells.has(cellKey)) {
          continue;
        }

        const distance =
          Math.abs(column - targetCell.column) + Math.abs(row - targetCell.row);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestCell = { column, row };
        }
      }
    }

    return getIconGridPosition(bestCell.column, bestCell.row);
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
          const nextWidth = clamp(
            resizeState.startRect.width + (event.clientX - resizeState.startX),
            minWidth,
            availableWidth,
          );
          const nextHeight = clamp(
            resizeState.startRect.height + (event.clientY - resizeState.startY),
            minHeight,
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
        const nextX = clamp(
          event.clientX - dragState.offsetX,
          WINDOW_MARGIN,
          Math.max(WINDOW_MARGIN, bounds.width - currentWindow.rect.width - WINDOW_MARGIN),
        );
        const nextY = clamp(
          event.clientY - dragState.offsetY,
          WINDOW_MARGIN,
          Math.max(WINDOW_MARGIN, bounds.height - currentWindow.rect.height - WINDOW_MARGIN),
        );
        const nextRect = {
          ...currentWindow.rect,
          x: nextX,
          y: nextY,
        };

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
        "Pesan berhasil disimpan di UI demo ini. Alex bisa menindaklanjuti dari kontak yang Anda tinggalkan.",
      tone: "info",
    });
    setContactForm({
      name: "",
      email: "",
      message: "",
    });
  };

  const desktopIcons = [
    {
      id: "about" as const,
      label: "About Me",
      type: "profile" as const,
    },
    {
      id: "skills" as const,
      label: "My Skills",
      type: "folder" as const,
    },
    {
      id: "projects" as const,
      label: "Projects",
      type: "folder" as const,
    },
    {
      id: "contact" as const,
      label: "Contact",
      type: "mail" as const,
    },
    ...socialLinks.map((link) => ({
      id: link.id,
      label: link.label,
      type: "social" as const,
      href: link.href,
      icon: link.icon,
    })),
  ];

  return (
    <main className={styles.desktop} ref={desktopRef}>
      <div className={styles.wallpaper} />
      <div className={styles.desktopGlow} />

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
            onMouseDown={(event) => startDesktopIconDrag(event, icon.id)}
            onClick={() => {
              if (suppressIconClickRef.current === icon.id) {
                suppressIconClickRef.current = null;
                return;
              }

              setSelectedIcon(icon.id);
            }}
            onDoubleClick={() => {
              if (icon.type === "social") {
                openExternalLink(icon.href);
                return;
              }

              openWindow(icon.id);
            }}
          >
            {icon.type === "profile" ? (
              <span className={styles.avatarIcon} aria-hidden="true" />
            ) : null}
            {icon.type === "folder" ? <span className={styles.folderIcon} /> : null}
            {icon.type === "mail" ? <span className={styles.mailIcon} aria-hidden="true" /> : null}
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

            {id === "about" ? (
              <div className={`${styles.windowBody} ${styles.aboutLayout}`}>
                <aside className={styles.sidebar}>
                  <div className={styles.sidebarSection}>Details</div>
                  <button
                    type="button"
                    className={styles.sidebarLink}
                    onClick={() => openWindow("skills")}
                  >
                    My Skills
                  </button>
                  <button
                    type="button"
                    className={styles.sidebarLink}
                    onClick={() => openWindow("projects")}
                  >
                    Projects
                  </button>
                  <button
                    type="button"
                    className={styles.sidebarLink}
                    onClick={() => openWindow("contact")}
                  >
                    Contact
                  </button>
                </aside>

                <div className={styles.contentPane}>
                  <h2 className={styles.sectionTitle}>Tentang Saya</h2>

                  <div className={styles.aboutHeader}>
                    <div className={styles.profileBadge}>
                      <img
                        src="/profile-dimas.jpg"
                        alt="Foto Dimas Juli Pratama"
                        className={styles.profileBadgeImage}
                        draggable="false"
                      />
                    </div>
                    <div className={styles.aboutCopy}>
                      <h3>Dimas Juli Pratama</h3>
                      <p>
                        Mahasiswa Informatika semester 8 di Universitas Jember
                        dengan IPK 3.87/4.00, berfokus pada fullstack
                        development dan sistem berbasis AI.
                      </p>
                      <p>
                        Saya memiliki pengalaman lebih dari dua tahun
                        mengerjakan proyek freelance dan profesional, membangun
                        aplikasi web maupun mobile end-to-end dengan perhatian
                        pada backend architecture, API integration, performance,
                        usability, dan maintainability.
                      </p>
                    </div>
                  </div>

                  <div className={styles.dataTable}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataKey}>Nama</span>
                      <span>Dimas Juli Pratama</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataKey}>Lokasi</span>
                      <span>Banyuwangi, Jawa Timur</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataKey}>Pendidikan</span>
                      <span>S1 Informatika, Universitas Jember</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataKey}>IPK</span>
                      <span className={styles.statusText}>3.87 / 4.00</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataKey}>Fokus</span>
                      <span>Fullstack Development & AI Systems</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataKey}>Email</span>
                      <span>dp4369344@gmail.com</span>
                    </div>
                  </div>

                  <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                      <strong>2+</strong>
                      <span>Tahun Pengalaman</span>
                    </div>
                    <div className={styles.statBox}>
                      <strong>8th</strong>
                      <span>Semester Saat Ini</span>
                    </div>
                    <div className={styles.statBox}>
                      <strong>2026</strong>
                      <span>Expected Graduation</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {id === "skills" ? (
              <div className={styles.windowBody}>
                <h2 className={styles.sectionTitle}>My Skills</h2>

                <div className={styles.skillsCatalog}>
                  {skills.map((group) => (
                    <section key={group.group} className={styles.skillCategoryCard}>
                      <div className={styles.skillCategoryHeader}>
                        <div>
                          <h3>{group.group}</h3>
                          <p>{group.summary}</p>
                        </div>
                        <span className={styles.skillCategoryMeta}>
                          {group.items.length} items
                        </span>
                      </div>

                      <div className={styles.skillTileGrid}>
                        {group.items.map((item) => (
                          <article key={item.name} className={styles.skillTile}>
                            <div className={styles.skillTileIconBox}>
                              <img
                                src={item.icon}
                                alt=""
                                className={styles.skillTileIcon}
                                draggable="false"
                              />
                            </div>
                            <div className={styles.skillTileText}>
                              <strong>{item.name}</strong>
                              {item.note ? <span>{item.note}</span> : null}
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : null}

            {id === "projects" ? (
              <div className={styles.windowBody}>
                <h2 className={styles.sectionTitle}>Proyek Pilihan</h2>

                <div className={styles.projectGrid}>
                  {projects.map((project) => (
                    <button
                      key={project.title}
                      type="button"
                      className={styles.projectCard}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className={styles.projectCardTitle}>
                        <span
                          className={styles.projectCardBadge}
                          style={{ background: `linear-gradient(135deg, ${project.accent}, #123155)` }}
                        />
                        <span>{project.title}</span>
                      </div>
                      <p className={styles.projectSubtitle}>{project.subtitle}</p>
                      <p>{project.description}</p>
                      <div className={styles.projectTags}>
                        {project.tech.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                <p className={styles.helperNote}>
                  Klik proyek untuk melihat detail stack dan konteks penggunaan.
                </p>
              </div>
            ) : null}

            {id === "contact" ? (
              <div className={styles.windowBody}>
                <h2 className={styles.sectionTitle}>Hubungi Saya</h2>
                <p className={styles.contactLead}>
                  Punya proyek baru, butuh partner build MVP, atau ingin audit
                  front-end yang sudah ada?
                </p>

                <div className={styles.formRow}>
                  <label htmlFor="contact-name">Nama</label>
                  <input
                    id="contact-name"
                    value={contactForm.name}
                    onChange={(event) =>
                      setContactForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Nama Anda"
                  />
                </div>

                <div className={styles.formRow}>
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(event) =>
                      setContactForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="email@anda.com"
                  />
                </div>

                <div className={styles.formRow}>
                  <label htmlFor="contact-message">Pesan</label>
                  <textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(event) =>
                      setContactForm((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Ketik pesan Anda di sini..."
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={`${styles.xpButton} ${styles.primaryButton}`}
                    onClick={handleContactSubmit}
                  >
                    Kirim Pesan
                  </button>
                  <button
                    type="button"
                    className={styles.xpButton}
                    onClick={() =>
                      setContactForm({
                        name: "",
                        email: "",
                        message: "",
                      })
                    }
                  >
                    Bersihkan
                  </button>
                </div>

                <div className={styles.contactMeta}>
                  <p>
                    <strong>Email:</strong> alex@email.com
                  </p>
                  <p>
                    <strong>GitHub:</strong> github.com/alexreza
                  </p>
                  <p>
                    <strong>LinkedIn:</strong> linkedin.com/in/alexreza
                  </p>
                </div>
              </div>
            ) : null}

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

      {selectedProject ? (
        <div className={styles.messageBox} style={{ zIndex: 3000 }}>
          <div className={styles.messageTitlebar}>
            <span>{selectedProject.title} - Project Detail</span>
            <button
              type="button"
              className={`${styles.windowButton} ${styles.closeButton}`}
              onClick={() => setSelectedProject(null)}
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
                onClick={() => setSelectedProject(null)}
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
              onClick={() => setDialog(null)}
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
                onClick={() => setDialog(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {startMenuOpen ? (
        <div className={styles.startMenu} ref={startMenuRef}>
          <div className={styles.startMenuHeader}>
            <strong>Alex Reza</strong>
            <span>Windows XP Portfolio</span>
          </div>
          <button
            type="button"
            className={styles.startMenuItem}
            onClick={() => openWindow("about")}
          >
            About Me
          </button>
          <button
            type="button"
            className={styles.startMenuItem}
            onClick={() => openWindow("skills")}
          >
            Skills
          </button>
          <button
            type="button"
            className={styles.startMenuItem}
            onClick={() => openWindow("projects")}
          >
            Projects
          </button>
          <button
            type="button"
            className={styles.startMenuItem}
            onClick={() => openWindow("contact")}
          >
            Contact
          </button>
        </div>
      ) : null}

      <footer className={styles.taskbar}>
        <button
          ref={startButtonRef}
          type="button"
          className={styles.startButton}
          onClick={() => setStartMenuOpen((current) => !current)}
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
          <div className={styles.clock}>
            {clock.time}
          </div>
        </div>
      </footer>
    </main>
  );
}

export default WindowsPortfolio;
