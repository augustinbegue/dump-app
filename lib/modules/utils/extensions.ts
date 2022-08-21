export function getImageUrlExtension(url: string) {
	return url.split('.')[5].split('?')[0];
}
