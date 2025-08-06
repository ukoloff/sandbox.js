//
// Cast Hash to UUID
//
// https://stackoverflow.com/a/44080430/6127481
//
export default function hash2uuid(str) {
  return str.substring(6, 8) + str.substring(4, 6) + str.substring(2, 4) + str.substring(0, 2) +
    '-' + str.substring(10, 12) + str.substring(8, 10) +
    '-' + str.substring(14, 16) + str.substring(12, 14) +
    '-' + str.substring(16, 20) +
    '-' + str.substring(20, 32)
}
