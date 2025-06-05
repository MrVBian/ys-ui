import request from "./request";

function readEntriesPromise(
  dirReader: FileSystemDirectoryReader,
): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    dirReader.readEntries((entries) => {
      resolve(entries);
    }, reject);
  });
}

export async function uploadTestcases(
  url: string,
  items: DataTransferItemList,
  batchSize: number = 3,
  limit: number = 0,
) {
  const results: string[] = [];
  const tasks: Promise<string>[] = [];
  const stopCondition = () =>
    limit > 0 && results.length + tasks.length >= limit;
  const uploadBatch = async () => {
    if (tasks.length >= batchSize) {
      results.push(...(await Promise.all(tasks)));
      tasks.length = 0;
    }
  };
  for (let i = 0; i < items.length; i++) {
    const item = items[i].webkitGetAsEntry();
    if (!item) continue;
    if (item.isFile) {
      if (/\.(in|out|ans)$/.test(item.name)) {
        await uploadBatch();
        const data = new FormData();
        data.append("file", items[i].getAsFile()!);
        data.append("type", "testcase");
        tasks.push(request.upload<string>(url, data));
      }
    } else if (item.isDirectory) {
      const dirReader = (item as FileSystemDirectoryEntry).createReader();
      const entries = await readEntriesPromise(dirReader);
      for (let j = 0; j < entries.length; j++) {
        if (entries[j].isFile) {
          if (/\.(in|out|ans)$/.test(entries[j].name)) {
            await uploadBatch();
            const data = new FormData();
            data.append(
              "file",
              await new Promise<File>((resolve) => {
                (entries[j] as FileSystemFileEntry).file(resolve);
              }),
            );
            data.append("type", "testcase");
            tasks.push(request.upload<string>(url, data));
          }
          if (stopCondition()) {
            break;
          }
        }
      }
    }
    if (stopCondition()) {
      break;
    }
  }
  if (tasks.length > 0) {
    results.push(...(await Promise.all(tasks)));
  }
  return results;
}
