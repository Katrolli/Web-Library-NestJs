import { unlink } from 'fs/promises';
import { join } from 'path';

export async function deleteImage(imageName: string) {
  const imagePath = join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'books',
    'images',
    imageName,
  );
  try {
    await unlink(imagePath);
  } catch (err) {
    console.error(`Error deleting ${imageName}: ${err}`);
  }
}
