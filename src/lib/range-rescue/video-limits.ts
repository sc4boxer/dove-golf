export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;
export const MAX_VIDEO_SECONDS = 10;

export function isValidVideoDuration(duration: number) {
  return Number.isFinite(duration) && duration > 0 && duration <= MAX_VIDEO_SECONDS;
}
