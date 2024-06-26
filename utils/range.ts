
type Span = [number, number];

interface Bounds {
  min: number;
  max: number;
}

function findBestFitSpan(proposedSpan: Span, bounds: Bounds, validSizes: number[]): Span {
  let [start, end] = proposedSpan;

  const proposedSize = end - start;
  
  const { bestSize } = validSizes.reduce(
    (accum, size) => {
      const distance = Math.abs(proposedSize - size);
      if (distance < accum.distance) {
        accum.distance = distance;
        accum.bestSize = size;
      }
      return accum;
    },
    { distance: Infinity, bestSize: proposedSize }
  );

  if (bestSize === proposedSize) {
    return [start, end];
  }

  return resizeSpan(proposedSpan, bounds, bestSize);
}

function resizeSpan(currentSpan: Span, bounds: Bounds, newSize: number): Span {
  const [start] = currentSpan;

  let origin = Math.max(bounds.min, start);

  if (origin + newSize > bounds.max) {
    origin -= (origin + newSize) - bounds.max;
  }

  return [origin, origin + newSize];
}

export { findBestFitSpan, resizeSpan };
