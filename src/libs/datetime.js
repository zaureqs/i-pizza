export function dbTimeForIndianTime(str) {
  const utcTime = new Date(str);
  

  const options = {
    timeZone: 'Asia/Kolkata', 
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  const indianTime = utcTime.toLocaleString('en-US', options);

  return indianTime;
}
