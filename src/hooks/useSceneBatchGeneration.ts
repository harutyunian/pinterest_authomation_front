import { useCallback, useRef, useState } from 'react';
import {
  downloadSceneBatchResult,
  getSceneBatchStatus,
  startSceneBatch,
} from '@/api/videoGeneration';
import type {
  SceneBatchJobStatus,
  StartSceneBatchPayload,
} from '@/types/videoGeneration';
import {
  SCENE_BATCH_GENERATION_TIMEOUT_MS,
  SCENE_BATCH_POLL_INTERVAL_MS,
} from '@/types/videoGeneration';
import {
  clearActiveSceneJob,
  persistActiveSceneJob,
} from '@/utils/videoGeneratorStorage';

export type SceneBatchHookStatus =
  | 'idle'
  | 'generating'
  | 'processing'
  | 'completed'
  | 'partial'
  | 'failed';

function mapJobStatusToHookStatus(
  status: SceneBatchJobStatus,
): SceneBatchHookStatus {
  switch (status) {
    case 'processing':
      return 'processing';
    case 'completed':
      return 'completed';
    case 'partial':
      return 'partial';
    case 'failed':
      return 'failed';
    default:
      return 'generating';
  }
}

function isTerminalStatus(status: SceneBatchHookStatus): boolean {
  return (
    status === 'completed' ||
    status === 'partial' ||
    status === 'failed'
  );
}

export function useSceneBatchGeneration() {
  const pollTimeoutRef = useRef<number | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const [status, setStatus] = useState<SceneBatchHookStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completedSceneIndices, setCompletedSceneIndices] = useState<number[]>(
    [],
  );
  const [failedSceneIndex, setFailedSceneIndex] = useState<number | undefined>();
  const [partialRecoveryMessage, setPartialRecoveryMessage] = useState('');
  const [storedVideoId, setStoredVideoId] = useState<string | null>(null);
  const [continuityMode, setContinuityMode] = useState(false);

  const clearPolling = useCallback(() => {
    if (pollIntervalRef.current != null) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current != null) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const applyStatusResponse = useCallback(
    (response: Awaited<ReturnType<typeof getSceneBatchStatus>>) => {
      const mappedStatus = mapJobStatusToHookStatus(response.status);
      setStatus(mappedStatus);
      setProgress(response.progress);
      setProgressMessage(
        response.message ?? 'Generating scenes with Google Veo…',
      );
      setSessionId(response.sessionId);
      setCompletedSceneIndices(response.completedSceneIndices);
      setFailedSceneIndex(response.failedSceneIndex);
      setContinuityMode(response.continuityMode);
      setStoredVideoId(response.storedVideoId ?? null);

      if (response.status === 'partial') {
        setPartialRecoveryMessage(response.message ?? '');
        setError(response.error ?? response.message ?? 'Scene generation failed.');
      } else if (response.status === 'failed') {
        setError(response.error ?? response.message ?? 'Scene generation failed.');
        setPartialRecoveryMessage('');
      } else if (response.status === 'completed') {
        setError(null);
        setPartialRecoveryMessage('');
      }
    },
    [],
  );

  const pollJobStatus = useCallback(
    (activeJobId: string) => {
      clearPolling();
      startedAtRef.current = Date.now();

      pollTimeoutRef.current = window.setTimeout(() => {
        clearPolling();
        setStatus('failed');
        setError('Generation timed out. Please try again with fewer scenes.');
        clearActiveSceneJob();
      }, SCENE_BATCH_GENERATION_TIMEOUT_MS);

      const poll = async () => {
        if (
          startedAtRef.current != null &&
          Date.now() - startedAtRef.current > SCENE_BATCH_GENERATION_TIMEOUT_MS
        ) {
          clearPolling();
          setStatus('failed');
          setError('Generation timed out. Please try again with fewer scenes.');
          clearActiveSceneJob();
          return;
        }

        try {
          const response = await getSceneBatchStatus(activeJobId);
          applyStatusResponse(response);

          if (isTerminalStatus(mapJobStatusToHookStatus(response.status))) {
            clearPolling();
            if (response.status === 'completed') {
              clearActiveSceneJob();
            }
          }
        } catch (pollError) {
          clearPolling();
          setStatus('failed');
          setError(
            pollError instanceof Error
              ? pollError.message
              : 'Failed to poll scene batch status.',
          );
        }
      };

      void poll();
      pollIntervalRef.current = window.setInterval(() => {
        void poll();
      }, SCENE_BATCH_POLL_INTERVAL_MS);
    },
    [applyStatusResponse, clearPolling],
  );

  const resumePolling = useCallback(
    (activeJobId: string, activeSessionId: string) => {
      setJobId(activeJobId);
      setSessionId(activeSessionId);
      setStatus('generating');
      setError(null);
      setPartialRecoveryMessage('');
      pollJobStatus(activeJobId);
    },
    [pollJobStatus],
  );

  const startBatch = useCallback(
    async (payload: StartSceneBatchPayload) => {
      clearPolling();
      setStatus('generating');
      setProgress(0);
      setProgressMessage('Submitting scene batch…');
      setError(null);
      setPartialRecoveryMessage('');
      setCompletedSceneIndices([]);
      setFailedSceneIndex(undefined);
      setStoredVideoId(null);

      try {
        const response = await startSceneBatch(payload);
        setJobId(response.jobId);
        setSessionId(response.sessionId);
        persistActiveSceneJob(response.jobId, response.sessionId);
        setProgress(5);
        setProgressMessage('Queued for scene generation…');
        pollJobStatus(response.jobId);
        return response;
      } catch (startError) {
        setStatus('failed');
        setError(
          startError instanceof Error
            ? startError.message
            : 'Failed to start scene batch.',
        );
        throw startError;
      }
    },
    [clearPolling, pollJobStatus],
  );

  const acknowledgeTerminalJob = useCallback(() => {
    if (status === 'partial' || status === 'failed') {
      clearActiveSceneJob();
    }
  }, [status]);

  const cancelPolling = useCallback(() => {
    clearPolling();
  }, [clearPolling]);

  const isBusy =
    status === 'generating' || status === 'processing';

  return {
    status,
    progress,
    progressMessage,
    error,
    jobId,
    sessionId,
    completedSceneIndices,
    failedSceneIndex,
    partialRecoveryMessage,
    storedVideoId,
    continuityMode,
    isBusy,
    startBatch,
    resumePolling,
    cancelPolling,
    acknowledgeTerminalJob,
    downloadSceneBatchResult,
  };
}
