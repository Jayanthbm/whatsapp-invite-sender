function getISTDateTime() {
  const now = new Date();

  const istDate = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );

  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, "0");

  const day = String(istDate.getDate()).padStart(2, "0");

  const hours = String(istDate.getHours()).padStart(2, "0");

  const minutes = String(istDate.getMinutes()).padStart(2, "0");

  const seconds = String(istDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
  getISTDateTime,
};
