function shouldLoadMore(list, max) {
  return list.length < max;
}

function findEmpty(list, startPageIndex, limit) {
  let emptyElemIndex = -1;
  const nextPageIndex = startPageIndex + limit;
  const max = Math.min(nextPageIndex, list.length);
  let i = startPageIndex;
  for (; i < max; i++) {
    if (list[i] === null) {
      emptyElemIndex = i;
      break;
    }
  }
  if (i === list.length) {
    emptyElemIndex = list.length;
  }
  if(nextPageIndex === -1) {
    return {
      start: emptyElemIndex,
      limit: 0
    };
  }
  return {
    start: emptyElemIndex,
    limit: nextPageIndex - emptyElemIndex
  };
}

export async function load(
  input,
  paging,
  loader = (list, max, start, limit) => {},
  outputbuilderFn = (resultList, max) => {},
  reload = false
) {
  const { pageSize, page } = paging;
  const { total, list } = input;

  const startPageIndex = pageSize * Math.max(0, page - 1);

  let limit = pageSize;
  let start = startPageIndex;

  let resultList = [...list];
  let loadMore = false;
  let max = total;

  if (startPageIndex < list.length) {
    let startLoadingIndex = startPageIndex;
    if (!reload) {
      const point = findEmpty(list, startPageIndex, limit);
      startLoadingIndex = point.start;
      limit = point.limit;
    }

    if (startLoadingIndex >= 0) {
      start = startLoadingIndex;
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
