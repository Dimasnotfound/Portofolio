import {
  DESKTOP_ICON_GRID_HEIGHT,
  DESKTOP_ICON_GRID_WIDTH,
  DESKTOP_ICON_HEIGHT,
  DESKTOP_ICON_MARGIN,
  DESKTOP_ICON_WIDTH,
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
  WINDOW_MARGIN,
} from "./constants";
import type {
  Bounds,
  DesktopIconId,
  DesktopIconPosition,
  WindowRect,
} from "./types";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const sameRect = (a: WindowRect, b: WindowRect) =>
  a.x === b.x &&
  a.y === b.y &&
  a.width === b.width &&
  a.height === b.height;

export const formatClock = (date: Date) => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return {
    time: `${hours}:${minutes} ${meridiem}`,
  };
};

export const fitRect = (rect: WindowRect, bounds: Bounds): WindowRect => {
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

export const fitIconPosition = (
  position: DesktopIconPosition,
  bounds: Bounds,
  size = { width: DESKTOP_ICON_WIDTH, height: DESKTOP_ICON_HEIGHT },
): DesktopIconPosition => ({
  x: clamp(
    position.x,
    DESKTOP_ICON_MARGIN,
    Math.max(DESKTOP_ICON_MARGIN, bounds.width - size.width - DESKTOP_ICON_MARGIN),
  ),
  y: clamp(
    position.y,
    DESKTOP_ICON_MARGIN,
    Math.max(DESKTOP_ICON_MARGIN, bounds.height - size.height - DESKTOP_ICON_MARGIN),
  ),
});

const getIconGridLimits = (
  bounds: Bounds,
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
  bounds: Bounds,
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

export const resolveSnappedIconPosition = (
  id: DesktopIconId,
  desiredPosition: DesktopIconPosition,
  positions: Record<DesktopIconId, DesktopIconPosition>,
  bounds: Bounds,
  iconIds: readonly DesktopIconId[],
  size = { width: DESKTOP_ICON_WIDTH, height: DESKTOP_ICON_HEIGHT },
): DesktopIconPosition => {
  const limits = getIconGridLimits(bounds, size);
  const targetCell = getIconGridCell(desiredPosition, bounds, size);
  const occupiedCells = new Set<string>();

  for (const otherId of iconIds) {
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
