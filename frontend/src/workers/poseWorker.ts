// poseWorker.ts
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

let detector: poseDetection.PoseDetector | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === 'init') {
    try {
      await tf.ready();
      await tf.setBackend('webgl');
      const model = poseDetection.SupportedModels.MoveNet;
      const config = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      };
      detector = await poseDetection.createDetector(model, config);
      self.postMessage({ type: 'initComplete' });
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
  } else if (type === 'processFrame' && detector) {
    const bitmap = data as ImageBitmap;
    try {
      const poses = await detector.estimatePoses(bitmap, {
        maxPoses: 1,
        flipHorizontal: false,
      });
      
      // Critical: close the ImageBitmap to prevent memory leaks
      bitmap.close();
      
      if (poses.length > 0) {
        const pose = poses[0];
        const keypoints = pose.keypoints.reduce((acc, kp) => {
          if (kp.name) {
             acc[kp.name] = { x: kp.x, y: kp.y, score: kp.score };
          }
          return acc;
        }, {} as Record<string, { x: number; y: number; score?: number }>);

        // Calculate angles for squat
        const leftHip = keypoints.left_hip;
        const leftKnee = keypoints.left_knee;
        const leftAnkle = keypoints.left_ankle;
        let kneeAngle = 180;
        if (leftHip && leftKnee && leftAnkle) {
          kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        }

        const formWarning = kneeAngle < 90; // Example threshold

        self.postMessage({
          type: 'poseData',
          data: {
            keypoints,
            jointAngles: { knee: kneeAngle },
            formWarning,
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        self.postMessage({ type: 'error', error: error.message });
      }
    }
  }
};

function calculateAngle(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }): number {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  const cos = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return (Math.acos(cos) * 180) / Math.PI;
}