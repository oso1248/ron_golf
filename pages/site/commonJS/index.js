function setCookie(cookieName, cookieValue, hoursToExpire, path, domain) {
  let date = new Date();
  date.setTime(date.getTime() + hoursToExpire * 60 * 60 * 1000);
  document.cookie = cookieName + '=' + cookieValue + '; expires=' + date.toGMTString() + 'path=' + path + 'domain=' + domain;
}
function getCookie(cookieName) {
  var cookieValue = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}
function deleteCookie(cookieName) {
  document.cookie = cookieName + '=; max-age=0; expires=0';
}
let logoutRelocate = `/login.html`;
async function logout() {
  await fetch('/api/auth/logout', { method: 'post' })
    .then((res) => res.json())
    .then((data) => {
      if (data.msg === 'no user') {
        alert('no user');
        caches
          .keys()
          .then((keys) => {
            return caches.open(keys);
          })
          .then((cache) => {
            cache.delete('');
          });
        deleteCookie('BudApp');
        deleteCookie('perm');
        window.location.replace(logoutRelocate);
        return;
      } else if (window.location != logoutRelocate) {
        caches
          .keys()
          .then((keys) => {
            return caches.open(keys);
          })
          .then((cache) => {
            cache.delete('');
          });
        deleteCookie('BudApp');
        deleteCookie('perm');
        window.location.replace(logoutRelocate);
        return;
      } else {
        caches
          .keys()
          .then((keys) => {
            return caches.open(keys);
          })
          .then((cache) => {
            cache.delete('');
          });
        deleteCookie('BudApp');
        deleteCookie('perm');
        window.location.replace(logoutRelocate);
      }
    })
    .catch((err) => {
      window.location.replace('/offLine.html');
    });
}

const perm = getCookie(`perm`);
const perm4 = document.getElementById(`perm4`);
const perm5 = document.getElementsByClassName(`perm5`);

if (perm >= 5 && perm5.length > 0) {
  for (let i = 0; i < perm5.length; i++) {
    perm5[i].style.display = 'block';
  }
}

if (perm >= 4 && perm4) {
  perm4.style.display = 'block';
}

let logOutButton = document.getElementById('logout');
if (logOutButton) {
  document.getElementById('logout').addEventListener('click', logout);
}
