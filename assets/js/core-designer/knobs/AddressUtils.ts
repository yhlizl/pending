const getFormattedHex = (number: number): string => {
  const groupSize = 4;
  const hexString = number.toString(16).toUpperCase();
  const padding = Math.ceil(hexString.length / groupSize) * groupSize;
  const padded = hexString.padStart(padding, "0");
  const groups = padding / groupSize;
  const substrIndexes = new Array(groups).fill(undefined).map((_, i) => i * 4);
  const hexGroups = substrIndexes.map((idx) => padded.substr(idx, groupSize));
  const formatted = `0x${hexGroups.join("_")}`;
  // Remove front two padded zeros from 64-bit address
  if (formatted.length === 16 && formatted[2] === "0" && formatted[3] === "0") {
    return `0x${formatted.substr(4)}`;
  }
  return formatted;
};

const getHumanReadableSize = (sizeInKiB: number): string => {
  if (sizeInKiB < 2 ** 10) {
    return `${sizeInKiB} KiB`;
  }
  if (sizeInKiB < 2 ** 20) {
    return `${sizeInKiB / 2 ** 10} MiB`;
  }
  if (sizeInKiB < 2 ** 30) {
    return `${sizeInKiB / 2 ** 20} GiB`;
  }
  return `${sizeInKiB / 2 ** 30} TiB`;
};

const getTopAddress = (baseAddress: number, size: number): number =>
  baseAddress + size * 1024 - 1;

/** The number of bits used to represent the alignment of addresses.
 *
 * To simplify the application, we assume that alignment must be a power of two,
 * and therefore the alignment can be uniquely represented by the number of bits
 * required to represent the alignment. This is equivalent to taking the base-2
 * logarithm of a size.
 *
 * There is special handling for non-power-of-two inputs, where we round up to
 * the nearest power of 2.
 */
const getAlignmentBitsFromSize = (n: number) => Math.ceil(Math.log2(n));

export {
  getFormattedHex,
  getHumanReadableSize,
  getTopAddress,
  getAlignmentBitsFromSize,
};
