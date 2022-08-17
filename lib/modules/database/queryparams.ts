export function getQueryParams(url: URL) {
    let cursor = url.searchParams.get("cursor") ?? undefined;
    let skip = !cursor ? parseInt(url.searchParams.get("skip") ?? '0') ?? undefined : undefined;

    return {
        take: parseInt(url.searchParams.get("take") ?? '10'),
        cursor,
        skip,
    }
}