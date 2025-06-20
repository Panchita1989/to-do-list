
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const checkBoxes = document.querySelectorAll('input[type="checkbox"]')
const deleteButton = document.querySelector('.deleteAll')
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    const itemSpan = checkbox.parentNode.querySelector('.itemText')
        if (checkbox.checked) {
            itemSpan.classList.add('completed')
        } else {
            itemSpan.classList.remove('completed')
        }
    })

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(checkBoxes).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
deleteButton.addEventListener('click', deleteAll)

async function deleteItem(){
    const itemText = this.parentNode.querySelector('.itemText').innerText.trim()
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function deleteAll() {
    try{
        const response = await fetch('deleteAll',{
            method: 'delete',
            headers: {'Content-type':'application/json'},
        })
        const data = await response.json()
            console.log(data)
            location.reload()
    }catch(err){
        console.log(err)
    }    
}

async function markComplete(){
    const itemText = this.parentNode.querySelector('.itemText').innerText.trim()
    const isChecked = this.checked
    

    const route = isChecked ? 'markComplete' : 'markUnComplete'
    try{
        const response = await fetch(route, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

        if(isChecked){
            itemSpan.classList.add('completed')
        }else{
            itemSpan.classList.remove('completed')
        }

    }catch(err){
        console.log(err)
    }
}
