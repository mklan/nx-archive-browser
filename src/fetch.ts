type Stats = {
  progress: number;
  receivedLength: number;
  contentLength: number;
  speed: number;
};

type FetchOptions = {
  onProgress: (stats: Stats) => void;
  onDownloadStart: () => void;
};

export async function fetchProgress(
  url: string,
  { onProgress, onDownloadStart }: FetchOptions
) {
  // Step 1: start the fetch and obtain a reader
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.status.toString());
  }

  const reader = response.body!.getReader();

  // Step 2: get total length
  const contentLength = +response.headers.get("Content-Length")!;

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment

  let last = { time: 0, value: 0 };
  let counter = 0;
  let speed = 0;

  const stream = new ReadableStream({
    start(controller) {
      onDownloadStart();
      return pump();
      function pump(): Promise<
        ReadableStreamReadResult<Uint8Array> | undefined
      > {
        return reader.read().then(({ done, value }) => {
          // When no more data needs to be consumed, close the stream
          if (done) {
            controller.close();
            return;
          }
          // Enqueue the next data chunk into our target stream
          controller.enqueue(value);

          receivedLength += value.length;

          const progress = receivedLength / (contentLength / 100) / 100;

          const current = { time: Date.now(), value: receivedLength };

          if (counter % 50 === 0) {
            if (last.time) {
              const time = current.time - last.time;
              const val = current.value - last.value;

              speed = byteToMB(val / (time / 1000));
            }

            last = { ...current };
          }

          onProgress({
            progress: isFinite(progress) ? progress : 0,
            receivedLength,
            contentLength,
            speed,
          });

          counter += 1;
          return pump();
        });
      }
    },
  });

  return new Response(stream);
}

function byteToMB(value: number) {
  return value / 1024 / 1024;
}
