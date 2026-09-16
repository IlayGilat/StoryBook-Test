/** Refresh-rate assumptions used for dropped-frame estimates. */
export const TARGET_REFRESH_RATE_HZ = 60;
export const TARGET_FRAME_MS = 1000 / TARGET_REFRESH_RATE_HZ;
export const DROPPED_FRAME_THRESHOLD_MS = TARGET_FRAME_MS * 1.5;
export const LONG_TASK_THRESHOLD_MS = 50;
