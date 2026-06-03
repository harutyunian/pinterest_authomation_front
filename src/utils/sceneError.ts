import axios from 'axios';
import type { SceneGenerationErrorBody } from '../types/videoGeneration';

export function isSceneGenerationErrorBody(
  value: unknown,
): value is SceneGenerationErrorBody {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.message === 'string' &&
    typeof body.failedSceneIndex === 'number' &&
    typeof body.sessionId === 'string'
  );
}

export function parseSceneError(
  error: unknown,
  fallback: string,
): {
  message: string;
  failedSceneIndex?: number;
  sessionId?: string;
  completedSceneIndices?: number[];
} {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (isSceneGenerationErrorBody(data)) {
      return {
        message: data.message,
        failedSceneIndex: data.failedSceneIndex,
        sessionId: data.sessionId,
        completedSceneIndices: data.completedSceneIndices,
      };
    }
    const message = (data as { message?: string | string[] })?.message;
    if (typeof message === 'string') {
      return { message };
    }
    if (Array.isArray(message)) {
      return { message: message.join(', ') };
    }
  }
  if (error instanceof Error && error.message) {
    return { message: error.message };
  }
  return { message: fallback };
}

export function formatPartialFailureMessage(
  parsed: ReturnType<typeof parseSceneError>,
  recoveredCompletedCount: number,
): string {
  const failedNum =
    parsed.failedSceneIndex !== undefined
      ? parsed.failedSceneIndex + 1
      : undefined;
  const base = parsed.message;
  if (recoveredCompletedCount > 0 && failedNum !== undefined && failedNum > 1) {
    return `${base} Scenes 1–${failedNum - 1} are available below.`;
  }
  if (recoveredCompletedCount > 0) {
    return `${base} Completed scenes are available below.`;
  }
  return base;
}

export function formatCompletedSceneRange(indices: number[]): string {
  if (indices.length === 0) {
    return '';
  }
  const oneBased = [...indices].sort((a, b) => a - b).map((i) => i + 1);
  if (oneBased.length === 1) {
    return String(oneBased[0]);
  }
  const isContiguous =
    oneBased[oneBased.length - 1]! - oneBased[0]! + 1 === oneBased.length;
  if (isContiguous) {
    return `${oneBased[0]}–${oneBased[oneBased.length - 1]}`;
  }
  return oneBased.join(', ');
}
