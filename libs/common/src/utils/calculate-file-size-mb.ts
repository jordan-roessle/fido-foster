export const calculateFileSizeMb = (file: File) => {
  return file.size / (1024 * 1024);
}