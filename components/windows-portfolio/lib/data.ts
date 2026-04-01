import type {
  DesktopIconId,
  DesktopIconItem,
  DesktopIconPosition,
  Project,
  QuickLaunchItem,
  SkillCategory,
  SocialLink,
  TrayIcon,
  WindowId,
  WindowMeta,
  WindowState,
} from "./types";

export const trayIcons: readonly TrayIcon[] = [
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
];

export const quickLaunchItems: readonly QuickLaunchItem[] = [
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
];

export const socialLinks: readonly SocialLink[] = [
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
];

export const windowIds: readonly WindowId[] = [
  "about",
  "skills",
  "projects",
  "contact",
  "doom",
];

export const desktopIconIds: readonly DesktopIconId[] = [
  "about",
  "skills",
  "projects",
  "contact",
  "doom",
  "linkedin",
  "github",
];

export const desktopIcons: readonly DesktopIconItem[] = [
  {
    id: "about",
    label: "About Me",
    type: "profile",
  },
  {
    id: "skills",
    label: "My Skills",
    type: "folder",
  },
  {
    id: "projects",
    label: "Projects",
    type: "folder",
  },
  {
    id: "contact",
    label: "Contact",
    type: "mail",
  },
  {
    id: "doom",
    label: "DOOM",
    type: "doom",
  },
  ...socialLinks.map((link) => ({
    id: link.id,
    label: link.label,
    type: "social" as const,
    href: link.href,
    icon: link.icon,
  })),
];

export const startMenuItems: readonly WindowId[] = [
  "about",
  "skills",
  "projects",
  "contact",
  "doom",
];

export const initialDesktopIconPositions: Record<DesktopIconId, DesktopIconPosition> = {
  about: { x: 16, y: 16 },
  skills: { x: 16, y: 128 },
  projects: { x: 16, y: 240 },
  contact: { x: 16, y: 352 },
  doom: { x: 128, y: 16 },
  linkedin: { x: 128, y: 128 },
  github: { x: 128, y: 240 },
};

export const windowLabels: Record<WindowId, WindowMeta> = {
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
    title: "Projects - Dimas Juli Pratama",
    taskLabel: "Projects",
    address: "C:\\Portfolio\\Projects\\Dimas Juli Pratama\\",
    iconColor: "#55d29c",
  },
  contact: {
    title: "Contact - Dimas Juli Pratama",
    taskLabel: "Contact",
    address: "C:\\Portfolio\\Contact\\Dimas Juli Pratama\\",
    iconColor: "#ff7c66",
  },
  doom: {
    title: "DOOM",
    taskLabel: "DOOM",
    address: "C:\\Games\\DOOM\\doom.exe",
    iconColor: "#d66a2d",
  },
};

export const initialWindows: Record<WindowId, WindowState> = {
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
  doom: {
    visible: false,
    minimized: false,
    maximized: false,
    rect: { x: 246, y: 86, width: 980, height: 620 },
    zIndex: 10,
  },
};

export const skills: SkillCategory[] = [
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

export const projects: Project[] = [
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
