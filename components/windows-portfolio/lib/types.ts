export type WindowId =
  | "about"
  | "skills"
  | "projects"
  | "certifications"
  | "contact"
  | "doom";
export type DesktopIconId = WindowId | "linkedin" | "github";
export type DesktopIconType =
  | "profile"
  | "folder"
  | "mail"
  | "doom"
  | "social"
  | "certificate";

export type DesktopIconPosition = {
  x: number;
  y: number;
};

export type Bounds = {
  width: number;
  height: number;
};

export type WindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type WindowState = {
  visible: boolean;
  minimized: boolean;
  maximized: boolean;
  rect: WindowRect;
  previousRect?: WindowRect;
  zIndex: number;
};

export type DialogState = {
  title: string;
  message: string;
  tone: "info" | "warning";
};

export type Project = {
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  accent: string;
};

export type Certification = {
  title: string;
  issuer: string;
  issuedAt: string;
  description: string;
  preview: string;
  file: string;
  accent: string;
};

export type SkillItem = {
  name: string;
  icon: string;
  note?: string;
};

export type SkillCategory = {
  group: string;
  summary: string;
  items: SkillItem[];
};

export type TrayIcon = {
  src: string;
  alt: string;
};

export type QuickLaunchItem = {
  src: string;
  alt: string;
  target: WindowId;
};

export type SocialLink = {
  id: Extract<DesktopIconId, "linkedin" | "github">;
  href: string;
  label: string;
  icon: string;
};

export type WindowMeta = {
  title: string;
  taskLabel: string;
  address: string;
  iconColor: string;
};

export type DesktopIconItem = {
  id: DesktopIconId;
  label: string;
  type: DesktopIconType;
  href?: string;
  icon?: string;
};

export type ContactForm = {
  name: string;
  email: string;
  message: string;
};

export type WindowDragState = {
  id: WindowId;
  offsetX: number;
  offsetY: number;
};

export type WindowResizeState = {
  id: WindowId;
  startX: number;
  startY: number;
  startRect: WindowRect;
};

export type IconDragState = {
  id: DesktopIconId;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  moved: boolean;
};
