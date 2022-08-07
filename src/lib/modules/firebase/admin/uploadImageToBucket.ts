import { storage } from ".";

export async function uploadImageToBucket(dataUrl: string, location: string, fileName: string) {
    const contentType = dataUrl.split(';')[0].split(':')[1];
    const buffer = Buffer.from(dataUrl.split(',')[1], 'base64')

    const storedFile = storage.bucket().file(`${location}/${fileName}`);
    await storedFile.save(buffer, { contentType });

    return (await storedFile.getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
    }))[0];
}