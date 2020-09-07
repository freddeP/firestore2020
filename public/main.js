const db = firebase.firestore();
const col = db.collection("images");
//const output = [];
const addImageForm = document.getElementById("addImageForm");
const loginForm = document.getElementById("loginForm");



firebase.auth().onAuthStateChanged(function(user) {

    console.log("user is logged in");
    console.log(user.uid);
});





loginForm.addEventListener("submit",async function(e){
    e.preventDefault();

    try {
        let login =  await firebase.auth().signInWithEmailAndPassword(this.email.value, this.password.value);
        console.log(login);

    } catch (error) {
        
    }


});

addImageForm.addEventListener("submit",async function(e){
    e.preventDefault();

  try {
      await addImage(this.url.value,this.name.value);
  
  } catch (error) {
      console.error(error);
  }

});



console.log(col);

// Real Time Update of Data

col.onSnapshot(function(d){

const output = [];

    console.log(d);
 
    d.forEach(function(doc){
        console.log(doc.data());
        output.push(`
        <div id = "${doc.id}">
            <img src = "${doc.data().url}"><br>
            <i>${doc.data().name}</i> <button onclick="deleteImg('${doc.id}')" >delete</button>
            <button onclick = "edit('${doc.id}','${doc.data().name}','${doc.data().url}')">Edit</button>
            <hr>
        </div>
    `);


    });
    document.querySelector("main").innerHTML = output.join("");

});




//getImages();
async function getImages(){

    let docs = await col.orderBy("timestamp").get();
    let output = [];
    docs.forEach((d)=>{
        //console.log(d.data());
        output.push(`
            <div id = "${d.id}">
                <img src = "${d.data().url}"><br>
                <i>${d.data().name}</i> <button onclick="deleteImg('${d.id}')" >delete</button>
                <hr>
            </div>
        `);
    })
   document.querySelector("main").innerHTML = output.join("");

}  // end getImages


async function addImage(url,name){

    try {
        let obj = {uid: firebase.auth().currentUser.uid ,url, name, timestamp: firebase.firestore.Timestamp.now() };
        await col.add(obj);
    } catch (error) {
        console.log(error.message);
    }
}


async function deleteImg(id)
{
    try {
        await col.doc(id).delete();
        document.getElementById(id).remove();
    } catch (error) {
        
    }

}
/**
 * Edit/update-kod nedan
 */

document.querySelector("#editForm").addEventListener("submit",update);

function edit(id, name, url){

    console.log(id, name, url);
    document.querySelector("#edit").classList.toggle("hidden");
    let form = document.querySelector("#editForm");
    form.name.value = name;
    form.url.value = url;
    form.id.value = id;


}

async function update(e){

    e.preventDefault();
    let data = {url:this.url.value, name: this.name.value}
    let docId = this.id.value;

    try {
        await  col.doc(docId).set(data, { merge: true });
       
    } catch (error) {
        console.log(error.message);
    }
    document.querySelector("#edit").classList.toggle("hidden");
  

}