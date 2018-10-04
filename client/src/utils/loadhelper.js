function shouldLoadMore(list, max) {
  return list.length < max;
}

export async function load(
  input,
  paging,
  loader = (list, max, start, limit) => {},
  outputbuilderFn = (resultList, max) => {}
) {
  const { pageSize, page } = paging;
  const { total, list } = input;

  const startPageIndex = pageSize * Math.max(0, page - 1);

  let limit = 2 * pageSize;
  let start = startPageIndex;

  let resultList = [...list];
  let loadMore = false;
  let max = total;

  if (startPageIndex < list.length) {
    let emptyElemIndex = -1;
    for (let i = startPageIndex; i < list.length; i++) {
      if (list[i] === null) {
        emptyElemIndex = i;
        break;
      }
    }
    if (emptyElemIndex > 0) {
      start = emptyElemIndex;
      const response = await loader(list, max, start, limit);

      resultList = list.slice(0, start);
      resultList.push(...response.list);
      const lastLoaded = start + response.list.length;
      const offset = list.length - lastLoaded;
      if (offset > 0) {
        resultList.push(...list.slice(lastLoaded));
      }

      // set max for update later
      max = response.total > total ? response.total : total;
    } else {
      start = list.length;
      limit -= list.length - startPageIndex - 1;
      loadMore = shouldLoadMore(list, total);
    }
  } else {
    loadMore = shouldLoadMore(list, total);
  }
  if (loadMore) {
    const response = await loader(list, max, startPageIndex, limit);

    resultList = list.slice(0);
    const offset = startPageIndex - list.length;
    if (offset > 0) {
      resultList.push(...Array(offset).fill(null));
    }
    resultList.push(...response.list);

    // set max for update later
    max = response.total > total ? response.total : total;
  }

  const result = outputbuilderFn(resultList, max);

  return result;
}
