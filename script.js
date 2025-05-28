// 간단한 로그인 처리
const validCredentials = {
  "admin": "1234",
  "user": "password",
  "iot": "iot123"
};

// 로그인 폼 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 로그인 검증
    if (validCredentials[username] && validCredentials[username] === password) {
      // 로그인 성공
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('username', username);
      window.location.href = 'mainPage.html';
    } else {
      // 로그인 실패
      showError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  });
});

// 에러 메시지 표시
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';

  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 3000);
}

// 메인 페이지 접근 제한 (mainPage.html에서 사용)
function checkLogin() {
  if (!sessionStorage.getItem('loggedIn')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// 로그아웃
function logout() {
  sessionStorage.removeItem('loggedIn');
  sessionStorage.removeItem('username');
  window.location.href = 'index.html';
}