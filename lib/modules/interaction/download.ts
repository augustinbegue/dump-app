import { getBlob, ref } from 'firebase/storage';
import { Post } from '@prisma/client';
import { storage } from '../firebase/client';
import { getImageUrlExtension } from '../utils/extensions';

export async function downloadPostImage(post: Post) {
	const blob = await getBlob(
		ref(storage, `${post.authorUid}/${post.pid}.${getImageUrlExtension(post.imageUrl)}`)
	);

	const urlCreator = window.URL || window.webkitURL;
	const imageUrl = urlCreator.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = imageUrl;
	a.download = '';
	a.click();
}
