document.getElementById('actionBtn').addEventListener('click', function() {
    const message = document.getElementById('hiddenMessage');
    if (message.style.display === 'none') {
        message.style.display = 'block';
        this.innerText = 'Hide Message';
    } else {
        message.style.display = 'none';
        this.innerText = 'Click Me';
    }
});
