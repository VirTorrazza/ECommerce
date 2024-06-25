Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Enter your e-mail',
    inputValidator: value => {
        return !value.trim() && 'Enter a valid e-mail';
    },
    allowOutsideClick: false

}).then(result => {
    let user = result.value;
    document.getElementById('user').innerHTML = user;
    let socket = io();

    let chatbox = document.getElementById('chatbox');
    chatbox.addEventListener('keyup', e => {
        if(e.key === 'Enter'){
            if(chatbox.value.trim().length >0){
                socket.emit('message', { 
                    user,
                    message: chatbox.value
                });
            }
        }
    });

    socket.on('logs', data => {
        const log = document.getElementById('log');
        let messages = '';
        data.reverse().forEach( message => {
            messages += `<p><i>${message.user}</i>: ${message.message}</p>`
        });
        log.innerHTML = messages;
    });

})