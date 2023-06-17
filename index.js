import './style.css';

Parse.initialize(
  'dA9iQuXlEF700vefoWI7nwCHALI133HU5Utkbdaf',
  'rf2UWHozJFhYYKDRX106LEguPOI9CzqPelAQ70hM'
);
Parse.serverURL = 'https://parseapi.back4app.com/';

async function createParseUser() {
  let user = new Parse.User();

  const username = generateRandomString();
  const email = generateRandomString() + '@example.com';
  const password = generateRandomString();

  user.set('username', username);
  user.set('email', email);
  user.set('password', password);

  try {
    user = await user.save();
    if (user !== null) {
      alert(
        `New object created with success! ObjectId: ${user.id}, ${user.get(
          'username'
        )}`
      );
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function generateRandomString() {
  return Math.random().toString(36).substring(2);
}

document
  .getElementById('createButton')
  .addEventListener('click', async function () {
    createParseUser();
  });

async function searchUsers() {
  const searchInput = document.getElementById('searchInput');
  const query = new Parse.Query(Parse.User);
  query.startsWith('username', searchInput.value);

  try {
    const results = await query.find();
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    if (results.length > 0) {
      results.forEach((user) => {
        const username = user.get('username');
        const hobby = user.get('hobby');
        const skills = user.get('Habilidades');
        const photo = user.get('Foto');
        const description = user.get('Description');

        const tr = document.createElement('tr');

        const usernameCell = document.createElement('td');
        usernameCell.textContent = username;
        tr.appendChild(usernameCell);

        const hobbyCell = document.createElement('td');
        hobbyCell.textContent = hobby || 'Nenhum hobby encontrado.';
        tr.appendChild(hobbyCell);

        const skillsCell = document.createElement('td');
        skillsCell.textContent = skills || 'Nenhuma habilidade encontrada.';
        tr.appendChild(skillsCell);

        const photoCell = document.createElement('td');
        if (photo) {
          const img = document.createElement('img');
          img.src = photo.url();
          img.alt = 'Foto do usuário';
          photoCell.appendChild(img);
          photoCell.addEventListener('click', () => {
            displayDescription(description);
          });
        } else {
          photoCell.textContent = 'Nenhuma foto disponível.';
        }
        tr.appendChild(photoCell);

        resultsBody.appendChild(tr);
      });
    } else {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.textContent = 'Nenhum usuário encontrado.';
      tr.appendChild(td);
      resultsBody.appendChild(tr);
    }
  } catch (error) {
    console.error('Erro na pesquisa:', error);
  }
}

function displayDescription(description) {
  const infoContainer = document.getElementById('infoContainer');
  infoContainer.innerHTML = `
    <h2>Descrição do Usuário</h2>
    <p>${description || 'Nenhuma descrição disponível.'}</p>
  `;
}

document.getElementById('searchButton').addEventListener('click', searchUsers);
