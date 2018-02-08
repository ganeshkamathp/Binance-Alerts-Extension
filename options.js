function save_options() {
    var refresh_interval = document.getElementById('interval').value;
    if (isNaN(refresh_interval)) {
        show_status("Update interval is not a number", 10000, "red");
        return;
    }
    if (Number(refresh_interval) < 5) {
        show_status("Enter a number 5 or higher so that Binance website doesn't get overloaded", 10000, "red");
        return;
    }
    localStorage.play_sound = document.getElementById('sound').checked;
    localStorage.refresh_interval = refresh_interval;
    show_status("Options saved!", 10000, "green");

}

function show_status(message, timeout, color) {
    var status = document.getElementById('status');
    status.textContent = message;
    status.style.color = color;
    setTimeout(function () {
        status.textContent = '';
    }, 5000);
}

function restore_options() {
    document.getElementById('save').addEventListener('click', save_options);
    var refreshInteval = localStorage.refresh_interval || 10;
    var play_sound = localStorage.play_sound || false;
    localStorage.refresh_interval = refreshInteval;
    localStorage.play_sound = play_sound;

    document.getElementById('interval').value = refreshInteval;
    document.getElementById('sound').checked = play_sound;
}


document.addEventListener('DOMContentLoaded', restore_options);