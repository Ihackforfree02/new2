// ==== ACCOUNT SYSTEM ====
const usersKey = "mrGamesUsers";
const sessionKey = "mrGamesSession";

function getUsers(){
  return JSON.parse(localStorage.getItem(usersKey) || "[]");
}

function saveUsers(users){
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function login(email, password){
  const users = getUsers();
  const user = users.find(u => u.email===email && u.password===password);
  if(user){
    localStorage.setItem(sessionKey, JSON.stringify(user));
    return true;
  } else return false;
}

function signup(email, username, password){
  const users = getUsers();
  if(users.find(u=>u.email===email)) return "EmailTaken";
  if(users.find(u=>u.username===username)) return "UsernameTaken";
  const newUser = {email, username, password};
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(sessionKey, JSON.stringify(newUser));
  return true;
}

function logout(){
  localStorage.removeItem(sessionKey);
  window.location.href = "index.html";
}

function checkLoggedIn(){
  const session = JSON.parse(localStorage.getItem(sessionKey) || "null");
  if(!session) window.location.href="index.html";
}

// ==== ADMIN PANEL ====
function isAdmin(){
  const session = JSON.parse(localStorage.getItem(sessionKey) || "null");
  if(!session) return false;
  const adminEmails = ["cameronjhannaway@gmail.com","cameron.hannaway274@education.nsw.gov.au"];
  return adminEmails.includes(session.email) || session.adminCode === "02022012";
}

function getAllUsers(){
  return getUsers();
}

// ==== CHAT SYSTEM ====
function toggleChat(){
  if(window.chatWindow && !window.chatWindow.closed){
    window.chatWindow.focus();
  } else {
    window.chatWindow = window.open(
      'https://communityhelp.linewize.org/',
      'ChatWindow',
      'width=400,height=600'
    );
    if(!window.chatWindow) alert("Popup blocked! Please allow popups to use chat.");
  }
}
