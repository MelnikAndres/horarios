import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'

import { getFirestore, addDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'
// Required for side-effects

const firebaseConfig = {
  apiKey: "AIzaSyDCehLkFa5oqLKinB6lUU52OZKzc3Z_5qo",
  authDomain: "horarios-ca674.firebaseapp.com",
  projectId: "horarios-ca674",
  storageBucket: "horarios-ca674.appspot.com",
  messagingSenderId: "924425527672",
  appId: "1:924425527672:web:f55dc7bb496d85f616288d"
};
const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const horas = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17,18,19,20,21,22]
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const horarios = {
  'lunes':[],
  'martes':[],
  'miercoles':[],
  'jueves':[],
  'viernes':[],
  'sabado':[],
  'domingo':[],
}


async function saveHorarios(horarios, nombre) {
  try {
    const docRef = await addDoc(collection(db, "horarios"), {
      nombre: nombre,
      ocupados: horarios,
    });
    console.log("Document written with ID: ", docRef.id);
    alert('Horarios subidos correctamente, recargar la pagina para ver los horarios disponibles')
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getHorarios() {
  const horariosCol = collection(db, 'horarios');
  const horariosSnapshot = await getDocs(horariosCol);
  const horariosList = horariosSnapshot.docs.map(doc => doc.data());
  return horariosList;
}


function addRemove(hor){
  let [dia, hora] = hor.split('-')
  hora = parseInt(hora)
  const wasSelected = horarios[dia].includes(hora)
  if(wasSelected){
    horarios[dia].splice(horarios[dia].indexOf(hora), 1)
    document.getElementById(hor).classList.remove('selected')
  }else{
    horarios[dia].push(hora)
    document.getElementById(hor).classList.add('selected')
  }
}
const root = document.getElementById('root')
let newcontent = ''
for(let dia of dias){
  newcontent = `<div class="dia"><h2>${dia}</h2>`
  for(let hora of horas){
    newcontent+=`<div class="hora">
    <div class="possible" id="${dia}-${hora}"></div>
    <span>${hora}:00</span>
    <button class="no-button" id="no-${dia}-${hora}" onclick="addRemove('${dia}-${hora}')">&#x274C;</button>
  </div>`
  }
  newcontent += '</div>'
  root.innerHTML += newcontent
}
for(let dia of dias){
  for(let hora of horas){
    document.getElementById("no-"+dia+"-"+hora).onclick = () => addRemove(dia+"-"+hora)
  }
}

document.getElementById('btn-subir').onclick = () => {
  const nombre = document.getElementById('nombre-input').value
  if(nombre.length < 3){
    alert('El nombre debe tener al menos 3 caracteres')
    return
  }
  saveHorarios(horarios, nombre)
  document.getElementById('btn-subir').disabled = true
}
getHorarios(db).then((horariosDisp) => { 
  const disponibles = document.getElementById('disponibles')
  let newcontent = ''
  for(let dia of dias){
    newcontent = `<div class="dia"><h2>${dia}</h2>`
    for(let hora of horas){
      let ocupado = false
      for(let i=0;i<horariosDisp.length;i++){
        if(horariosDisp[i].ocupados[dia] && horariosDisp[i].ocupados[dia].includes(hora)){
          ocupado = true
          break
        }
      }
      if(!ocupado){
        newcontent+=`<div class="hora">
        <div class="possible" id="${dia}-${hora}-disp"></div>
        <span>${hora}:00</span>
      </div>`
      }
    }
    newcontent += '</div>'
    disponibles.innerHTML += newcontent
  }
  let cargados = ''
  for(let i=0;i<horariosDisp.length;i++){
    cargados += horariosDisp[i].nombre + '<br>'
  }
  document.getElementById('cargados').innerHTML += cargados
})


