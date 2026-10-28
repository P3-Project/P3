import { useEffect, useRef, useState } from "react";

// Works out how many columns and rows a grid needs so `count` tiles FILL the available space.
//
// Example on an iPad (about 1180 × 760 px free):
//   5 tables  -> 3 columns × 2 rows  (big tiles)
//   10 tables -> 5 columns × 2 rows
//   20 tables -> 5 columns × 4 rows  (smaller, but still filling the screen)
//
// It tries every column count and keeps the one where the tiles come out biggest
// (biggest = the shorter side of a tile is as long as possible, so tiles stay roughly square).
export function useFitGrid(count: number, gap: number) {
  // The grid element we measure. Attach it with  ref={ref}
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // ResizeObserver calls us whenever the element changes size
  // (window resized, iPad rotated, ...). We just store the new size.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect(); // stop watching when the component unmounts
  }, []);

  let best = { cols: 1, rows: Math.max(count, 1), tile: 0 };
  for (let cols = 1; cols <= Math.max(count, 1); cols++) {
    const rows = Math.ceil(count / cols);
    const tileWidth = (size.width - gap * (cols - 1)) / cols;
    const tileHeight = (size.height - gap * (rows - 1)) / rows;
    const tile = Math.min(tileWidth, tileHeight); // the shorter side decides how "big" a tile feels
    if (tile > best.tile) best = { cols, rows, tile };
  }

  return { ref, cols: best.cols, rows: best.rows };
}
