export function toDateValue(val) {
  let year = val.substring(0, 4);
  let month = val.substring(4, 6);
  let day = val.substring(6, 8);
  let hour = val.substring(8, 10);
  let minute = val.substring(10, 12);
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function toDateDB(val, format) {
  let d = new Date(val);
  let year = d.getFullYear();
  let month = (d.getMonth() + 1).toString().padStart(2, '0');
  let day = d.getDate().toString().padStart(2, '0');
  let hour = d.getHours().toString().padStart(2, '0');
  let minute = d.getMinutes().toString().padStart(2, '0');

  switch (format) {
    case 'yyyyMMddHHmmss':
      return `${year}${month}${day}${hour}${minute}00`;
    case 'yyyyMMdd':
      return `${year}${month}${day}`;
  }
}
