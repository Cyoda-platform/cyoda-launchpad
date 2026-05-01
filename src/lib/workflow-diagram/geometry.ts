import type { Box, EdgePort, Point } from './types';

export const getCenter = (box: Box): Point => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});

export const getPort = (box: Box, port: EdgePort = 'center'): Point => {
  if (port === 'top') return { x: box.x + box.width / 2, y: box.y };
  if (port === 'right') return { x: box.x + box.width, y: box.y + box.height / 2 };
  if (port === 'bottom') return { x: box.x + box.width / 2, y: box.y + box.height };
  if (port === 'left') return { x: box.x, y: box.y + box.height / 2 };
  return getCenter(box);
};

export const wrapText = (text: string, maxChars: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = next;
  });

  if (line) lines.push(line);
  return lines;
};

export const estimateTextWidth = (text: string, factor: number) => text.length * factor;

export const boxRight = (box: Box) => box.x + box.width;

export const boxBottom = (box: Box) => box.y + box.height;
