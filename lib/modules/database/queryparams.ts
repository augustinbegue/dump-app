export function getQueryParams(url: URL) {
    const cursor = url.searchParams.get("cursor") ?? undefined;
    const skip = !cursor ? parseInt(url.searchParams.get("skip") ?? '0') ?? undefined : undefined;

    return {
        take: parseInt(url.searchParams.get("take") ?? '10'),
        cursor,
        skip,
    }
}