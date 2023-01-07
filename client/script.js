import bot from './assets/bot.svg';
import user from './assets/user.svg' ;


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '' ;

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 300);
}

function typetext(element, text) {
  let index = 0;

  let interval = setInterval(() => {
  if(index < text.length) {
    element.innerHTML += text.charAt(index) ;
    index++;
  }  else {
    clearInterval(interval) ;
  }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`
}

function chatStripe (isAi, value, generateUniqueId) {
  const botUrl = './assets/bot.svg';
  const userUrl = './assets/user.svg';
  return (
    `
     <div class="wrapper ${isAi && 'ai'}"> 
        <div class="chat">
          <div className="profile>
            <img 
              src="${isAi ? botUrl : userUrl}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div> 
          <div class="message" id=${generateUniqueId}>${value}</div>
        </div>
     </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv)

  // fetch the data from the server

  const response = await fetch ('https://codex-1.onrender.com', {
    method: 'POST' ,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parseData = data.bot.trim();

    console.log({parseData})

    typetext(messageDiv, parseData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "somethign went wrong";
  
    alert(err)
  }
}

console.log(form)
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup' , (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
