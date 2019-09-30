const stuffTable = document.querySelector('#stuffTableBody');
const form = document.querySelector('#add-stuff-form');
const updForm = document.querySelector('#upd-stuff-form');


db.collection('checks').orderBy('dateAdded').get().then(snapshot => {
    snapshot.docs.forEach(doc => {
         console.log("hello");
         console.log(doc.data());
  });
});



function renderStuff(doc){
    let tr = document.createElement('tr');
    let tdTitle = document.createElement('td');
    let tdDeadline = document.createElement('td');
    let tdButton = document.createElement('td');

    let buttonsGroup = document.createElement('div');

    let editButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    let tdMoreOptBt = document.createElement('td');
    let moreOptBt = document.createElement('input');
    moreOptBt.setAttribute('type', 'checkbox');
    moreOptBt.setAttribute('id', 'taskDone');

    buttonsGroup.setAttribute('class', 'btn-group');
    buttonsGroup.setAttribute('role', 'group');
    buttonsGroup.setAttribute('aria-label', '...');


    tr.setAttribute('data-id', doc.id);
    deleteButton.setAttribute('class', 'btn btn-danger');
    editButton.setAttribute('class', 'btn btn-light');
    editButton.setAttribute('data-toggle', 'modal');
    editButton.setAttribute('data-target', '#editModal');

    tdTitle.textContent = doc.data().title;
    tdDeadline.textContent = doc.data().deadline;
    deleteButton.textContent = 'Delete';
    editButton.textContent = 'Edit';
    if(doc.data().isDone === true){
      moreOptBt.checked = true;
    }

    tdButton.appendChild(buttonsGroup);

    buttonsGroup.appendChild(editButton);
    buttonsGroup.appendChild(deleteButton);

    tdMoreOptBt.appendChild(moreOptBt);

    tr.appendChild(tdTitle);
    tr.appendChild(tdDeadline);
    tr.appendChild(tdButton);
    tr.appendChild(tdMoreOptBt);

    stuffTable.appendChild(tr);

    moreOptBt.addEventListener('click', (e) => {
      let id = e.target.parentElement.parentElement.getAttribute('data-id'); //TODO
      

      console.log(doc.data().title)
      console.log(doc.data().deadline)
      console.log(doc.data().isDone)

      console.log('============================')

      if (doc.data().isDone === true){
        console.log('was true')
        db.collection('checks').doc(id).update({
          isDone: false
        });
        // db.collection('checks').doc(id).update({
        //   title: updForm.updTitle.value,
        //   deadline: updForm.updDeadline.value,
        //   isDone: false
        // });
      }
      else{
        console.log('was false')
        db.collection('checks').doc(id).update({
          isDone: true
        });
        // db.collection('checks').doc(id).update({
        //   title: updForm.updTitle.value,
        //   deadline: updForm.updDeadline.value,
        //   isDone: true
        // });
      }

      console.log(doc.data().title)
      console.log(doc.data().deadline)
      console.log(doc.data().isDone)


        
    });

    

    editButton.addEventListener('click', (e) => {
      console.log("lalala")
      //('.collapseExample').show();
       let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');

        updForm.addEventListener('submit', (e) => {
          e.preventDefault();
           //TODO
          db.collection('checks').doc(id).update({
            title: updForm.updTitle.value,
            deadline: updForm.updDeadline.value
          });

         
          $('#editModal').modal('hide')
        });
    });


    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id'); //TODO
        db.collection('checks').doc(id).delete();
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('checks').add({
        title: form.title.value,
        deadline: form.deadline.value,
        isDone: false
    });
    form.title.value = '';
    form.deadline.value = '';
});




// real-time listener
db.collection('checks').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    //console.log('changes = ', changes);
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderStuff(change.doc);
        } else if (change.type == 'removed'){
            let tr = stuffTable.querySelector('[data-id=' + change.doc.id + ']');
            stuffTable.removeChild(tr);
        }
        else if (change.type == 'modified'){
            //console.log('mdf change = ', change.doc)
            let tr = stuffTable.querySelector('[data-id=' + change.doc.id + ']');
            let tdTitle = tr.querySelector('td:nth-child(1)')
            //tdTitle.textContent = updForm.updTitle.value;
            tdTitle.textContent = change.doc.data().title;
            let tdDeadline = tr.querySelector('td:nth-child(2)')
            //tdDeadline.textContent = updForm.updDeadline.value;
            tdDeadline.textContent = change.doc.data().deadline;

        }
    });
});

