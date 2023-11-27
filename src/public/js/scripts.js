$('#post-comment').hide
$('#btn-toggle-comment').click(function(e){
    e.preventDefault();
    $('#post-comment').slideToggle();
})

const buttonDelete = document.getElementById('btn-delete')
const buttonLike = document.getElementById("btn-like")

buttonLike.addEventListener("click", async function (e) {
    e.preventDefault()

    let imgId = buttonDelete.getAttribute("data-id")
    
    console.log(imgId)

        const res = await fetch("http://localhost:5500/images/" + imgId +"/like", {
            method: "post"
        })

        if(res.ok) {
            const json = await res.json()
            
            document.querySelector(".likes-count").textContent = json.likes
        }

});

buttonDelete.addEventListener("click", async function (e) {
    e.preventDefault();

    const response = confirm('¿Está seguro de querer eliminar la imagen?');

    if (response) {
        let imgId = buttonDelete.getAttribute("data-id")
        console.log(imgId)

        const res = await fetch("http://localhost:5500/images/" + imgId, {
            method: "delete"
        })

        const json = await res.json()
        console.log(json);

        if(json) {
            window.location.href = "/"
        }
    }
})