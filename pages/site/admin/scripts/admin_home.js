document.addEventListener('DOMContentLoaded', (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  // if (`geolocation` in navigator) {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log(DateTime.fromMillis(position.timestamp).toFormat(`MM-dd-yyyy HH:mm`));

  //     let coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
  //     console.log(coords);
  //   });
  // } else {
  //   console.log(`this is garbage`);
  // }
});
